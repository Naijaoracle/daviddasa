// Main Hospital Simulation Controller

class WaitingRoom {
    constructor(maxCapacity = 12) {
        this.maxCapacity = maxCapacity;
        this.patients = {
            urgent: [],
            stable: []
        };
        this.lastUrgentTreated = false;
    }

    isFull() {
        return this.getTotalCount() >= this.maxCapacity;
    }

    getTotalCount() {
        return this.patients.urgent.length + this.patients.stable.length;
    }

    addPatient(patient) {
        if (this.isFull()) {
            return false;
        }

        patient.addedTime = Date.now();
        this.patients[patient.severity].push(patient);
        
        // Sort by waiting time within each category
        this.patients[patient.severity].sort((a, b) => a.addedTime - b.addedTime);
        return true;
    }

    getNextPatient() {
        if (this.getTotalCount() === 0) return null;

        // If only one type of patients, return the longest waiting one
        if (this.patients.urgent.length === 0) return this.patients.stable[0];
        if (this.patients.stable.length === 0) return this.patients.urgent[0];

        const oldestUrgent = this.patients.urgent[0];
        const oldestStable = this.patients.stable[0];
        const urgentWaitTime = Date.now() - oldestUrgent.addedTime;
        const stableWaitTime = Date.now() - oldestStable.addedTime;

        // Prioritize stable patients if they've waited too long (over 10 minutes)
        if (stableWaitTime > 10 * 60 * 1000) {
            return oldestStable;
        }

        // Alternate between urgent and stable to prevent starvation
        if (this.lastUrgentTreated && stableWaitTime > urgentWaitTime * 0.5) {
            return oldestStable;
        }

        return oldestUrgent;
    }

    removePatient(patientId) {
        let removed = null;
        ['urgent', 'stable'].forEach(severity => {
            const index = this.patients[severity].findIndex(p => p.id === patientId);
            if (index !== -1) {
                removed = this.patients[severity].splice(index, 1)[0];
                this.lastUrgentTreated = (severity === 'urgent');
            }
        });
        return removed;
    }

    getAllPatients() {
        return [...this.patients.urgent, ...this.patients.stable]
            .sort((a, b) => a.addedTime - b.addedTime);
    }
}

class HospitalSimulation {
    constructor() {
        this.dataTracker = new DataTracker();
        this.running = false;
        
        // Debug logging flag
        this.debug = true;
        
        // Simulation time settings
        this.simulationTimeScale = 60; // 1 real second = 1 simulation minute
        this.simulationStartTime = null;
        
        // Initialize staff members
        this.staff = {
            doctor1: new Staff('doctor1', 'Dr. Smith', 'doctor'),
            doctor2: new Staff('doctor2', 'Dr. Johnson', 'doctor'),
            doctor3: new Staff('doctor3', 'Dr. Williams', 'doctor'),
            nurse1: new Staff('nurse1', 'Nurse Davis', 'nurse'),
            nurse2: new Staff('nurse2', 'Nurse Wilson', 'nurse'),
            nurse3: new Staff('nurse3', 'Nurse Thompson', 'nurse')
        };
        
        // Initialize break schedule (in simulation minutes)
        this.breakSchedule = {
            doctors: ['doctor1', 'doctor2', 'doctor3'],
            nurses: ['nurse1', 'nurse2', 'nurse3'],
            currentIndex: { doctors: 0, nurses: 0 },
            breakDuration: 30,     // 30 simulation minutes
            workDuration: 240      // 4 simulation hours
        };
        
        // Initialize hospital resources
        this.resources = new HospitalResources();
        
        // Initialize staff visualizer
        this.staffVisualizer = new StaffVisualizer(Object.values(this.staff));
        
        // Initialize hospital map
        this.hospitalMap = new HospitalMap(Object.values(this.staff), this.resources);
        
        // Initialize waiting room and treatment areas
        this.waitingRoom = new WaitingRoom(12);
        this.treatmentAreas = {
            bay1: null,
            bay2: null,
            bay3: null,
            bay4: null
        };
        
        // Initialize activity log
        this.activityLog = [];
        
        // Set up regular waiting time updates
        setInterval(() => this.updateWaitingRoomDisplay(), 1000);
        
        // Auto-start the simulation after a short delay to ensure everything is initialized
        setTimeout(() => this.start(), 1000);
    }

    logActivity(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message,
            type
        };
        this.activityLog.unshift(logEntry); // Add to beginning of array
        this.updateActivityLog();
    }

    updateActivityLog() {
        const logContainer = document.querySelector('.dialogue-content');
        if (!logContainer) return;

        // Calculate simulation time
        const realElapsedMs = Date.now() - this.simulationStartTime;
        const simElapsedMinutes = Math.floor((realElapsedMs * this.simulationTimeScale) / (1000 * 60));
        const simHours = Math.floor(simElapsedMinutes / 60);
        const simMins = simElapsedMinutes % 60;
        
        // Calculate real time
        const realElapsedSeconds = Math.floor(realElapsedMs / 1000);
        const realMins = Math.floor(realElapsedSeconds / 60);
        const realSecs = realElapsedSeconds % 60;

        // Create time display HTML
        const timeDisplay = `
            <div class="time-counters">
                <div class="sim-time">Simulation Time: ${simHours}h ${simMins}m</div>
                <div class="real-time">Real Time: ${realMins}m ${realSecs}s</div>
            </div>
        `;

        // Only keep the 10 most recent entries
        this.activityLog = this.activityLog.slice(0, 10);

        logContainer.innerHTML = timeDisplay + this.activityLog
            .map(entry => `
                <div class="log-entry ${entry.type}">
                    <span class="timestamp">${entry.timestamp}</span>
                    ${entry.message}
                </div>
            `)
            .join('');
    }

    getSimulationTime() {
        if (!this.simulationStartTime) return 0;
        const realElapsed = Date.now() - this.simulationStartTime;
        return realElapsed * (this.simulationTimeScale / 1000); // Convert to simulation seconds
    }

    start() {
        if (this.running) return;
        console.log('Starting simulation...');
        this.running = true;
        this.simulationStartTime = Date.now();
        this.logActivity('Simulation started', 'info');
        
        // Start break rotation
        console.log('Starting break rotation...');
        this.startBreakRotation();
        
        // Generate initial batch of patients (4-8 patients)
        const initialPatients = Math.floor(Math.random() * 5) + 4;
        console.log(`Generating ${initialPatients} initial patients...`);
        for (let i = 0; i < initialPatients; i++) {
            this.generatePatient();
        }
        
        // Start patient generation
        console.log('Setting up patient generation interval...');
        this.simulationInterval = setInterval(() => {
            if (this.running) {
                // 25% chance of emergency patient
                if (Math.random() < 0.25) {
                    this.generatePatient(true);
                } else {
                    this.generatePatient();
                }
            }
        }, 1000);
    }

    startBreakRotation() {
        // Force check for any stuck breaks before starting rotation
        this.checkAndClearStuckBreaks();
        
        // Initially send first staff members on break
        this.sendStaffOnBreak('doctors');
        this.sendStaffOnBreak('nurses');
        
        // Set up break rotation interval using simulation time
        const workDurationReal = Math.floor((this.breakSchedule.workDuration * 60 * 1000) / this.simulationTimeScale);
        
        // Clear any existing interval
        if (this.breakRotationInterval) {
            clearInterval(this.breakRotationInterval);
        }
        
        // Set up periodic check for stuck breaks
        if (this.stuckBreakCheckInterval) {
            clearInterval(this.stuckBreakCheckInterval);
        }
        
        this.stuckBreakCheckInterval = setInterval(() => {
            if (this.running) {
                this.checkAndClearStuckBreaks();
            }
        }, 30000); // Check every 30 seconds
        
        this.breakRotationInterval = setInterval(() => {
            if (this.running) {
                console.log('Rotating breaks...');
                if (!this.checkAndClearStuckBreaks()) {
                    this.rotateBreaks('doctors');
                    this.rotateBreaks('nurses');
                }
            }
        }, workDurationReal);
    }

    checkAndClearStuckBreaks() {
        let clearedAny = false;
        Object.values(this.staff).forEach(staff => {
            // Case 1: Staff is in rest area but not on break
            if (staff.location === 'rest' && staff.status !== 'on break') {
                console.log(`${staff.name} is in rest area but not on break, moving back to station`);
                const returnLocation = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                this.hospitalMap.moveStaffToLocation(staff.id, returnLocation);
                this.updateStaffStatus(staff.id, { status: 'available' });
                clearedAny = true;
            }
            
            // Case 2: Staff is on break but time has expired
            if (staff.status === 'on break' && Date.now() > staff.busyUntil) {
                console.log(`Forcing ${staff.name} to return from break (time expired)`);
                staff.endBreak();
                this.updateStaffStatus(staff.id, { status: 'available' });
                const returnLocation = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                this.hospitalMap.moveStaffToLocation(staff.id, returnLocation);
                clearedAny = true;
            }
            
            // Case 3: Staff is marked as on break but not in rest area
            if (staff.status === 'on break' && staff.location !== 'rest') {
                console.log(`${staff.name} is on break but not in rest area, moving to rest area`);
                this.hospitalMap.moveStaffToLocation(staff.id, 'rest');
                clearedAny = true;
            }
            
            // Case 4: Staff has onBreak flag but incorrect status
            if (staff.onBreak && staff.status !== 'on break') {
                console.log(`${staff.name} has inconsistent break state, fixing`);
                staff.endBreak();
                this.updateStaffStatus(staff.id, { status: 'available' });
                const returnLocation = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                this.hospitalMap.moveStaffToLocation(staff.id, returnLocation);
                clearedAny = true;
            }
            
            // Case 5: Staff is treating a patient but marked as on break
            if (staff.currentPatient && (staff.status === 'on break' || staff.onBreak)) {
                console.log(`${staff.name} is treating patient but marked as on break, fixing`);
                staff.endBreak();
                this.updateStaffStatus(staff.id, { status: 'busy', patient: staff.currentPatient });
                clearedAny = true;
            }
        });
        return clearedAny;
    }

    sendStaffOnBreak(staffType) {
        // First, ensure no staff of this type are stuck on break
        this.checkAndClearStuckBreaks();

        // Count how many staff of this type are currently on break
        const currentlyOnBreak = Object.values(this.staff)
            .filter(s => s.role === staffType.slice(0, -1) && 
                        (s.status === 'on break' || s.location === 'rest')).length;

        // If we already have the maximum number on break, don't send more
        if (currentlyOnBreak >= 1) {
            console.log(`Already have ${currentlyOnBreak} ${staffType} on break, skipping...`);
            return;
        }

        // Get all staff of this type who could potentially go on break
        const eligibleStaff = Object.values(this.staff)
            .filter(s => s.role === staffType.slice(0, -1) && 
                        !s.onBreak && 
                        s.location !== 'rest' &&
                        s.status !== 'on break')
            .sort((a, b) => (b.totalWorkTime || 0) - (a.totalWorkTime || 0));

        // First try to find available staff
        let staffToBreak = eligibleStaff.find(s => s.status === 'available' && !s.currentPatient);

        // If no available staff, find one that will finish soon (within 30 seconds)
        if (!staffToBreak) {
            staffToBreak = eligibleStaff.find(s => 
                s.status === 'busy' && 
                s.currentPatient && 
                s.busyUntil && 
                (s.busyUntil - Date.now() < 30000)
            );
        }

        if (staffToBreak) {
            const sendOnBreak = () => {
                // Calculate break duration in real milliseconds based on simulation time scale
                const breakDurationReal = Math.floor((this.breakSchedule.breakDuration * 60 * 1000) / this.simulationTimeScale);
                
                // First move to rest area
                this.hospitalMap.moveStaffToLocation(staffToBreak.id, 'rest');
                
                // Then update status and start break
                staffToBreak.takeBreak(this.breakSchedule.breakDuration, this.simulationTimeScale);
                this.updateStaffStatus(staffToBreak.id, { status: 'on break' });
                this.logActivity(`${staffToBreak.name} is taking a break`, 'break');
                
                // Schedule return from break
                setTimeout(() => {
                    if (staffToBreak.status === 'on break') {
                        staffToBreak.endBreak();
                        this.updateStaffStatus(staffToBreak.id, { status: 'available' });
                        
                        const returnLocation = staffToBreak.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                        this.hospitalMap.moveStaffToLocation(staffToBreak.id, returnLocation);
                        
                        this.logActivity(`${staffToBreak.name} has returned from break`, 'break');
                        
                        // When staff returns, try to send another staff member on break
                        setTimeout(() => {
                            this.rotateBreaks(staffType);
                        }, 1000);
                    }
                }, breakDurationReal);
            };

            if (staffToBreak.status === 'busy') {
                // Wait for current task to complete
                const checkInterval = setInterval(() => {
                    if (staffToBreak.status === 'available') {
                        clearInterval(checkInterval);
                        sendOnBreak();
                    }
                }, 1000);
            } else {
                sendOnBreak();
            }
        }
    }

    rotateBreaks(staffType) {
        // First ensure no staff are stuck on break
        if (this.checkAndClearStuckBreaks()) {
            return; // If we cleared any stuck breaks, skip rotation this time
        }

        // Count current staff on break and get their IDs
        const staffOnBreak = Object.values(this.staff)
            .filter(s => s.role === staffType.slice(0, -1) && s.status === 'on break');
        
        // Force return anyone who's been on break too long (over 35 simulation minutes)
        staffOnBreak.forEach(staff => {
            if (Date.now() > staff.busyUntil) {
                console.log(`${staff.name} has been on break too long, forcing return`);
                staff.endBreak();
                this.updateStaffStatus(staff.id, { status: 'available' });
                const returnLocation = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                this.hospitalMap.moveStaffToLocation(staff.id, returnLocation);
            }
        });

        // Recount after forcing returns
        const currentlyOnBreak = staffOnBreak.filter(s => s.status === 'on break').length;

        // Only rotate if we don't have anyone on break
        if (currentlyOnBreak === 0) {
            // Move to next staff member in rotation
            this.breakSchedule.currentIndex[staffType] = 
                (this.breakSchedule.currentIndex[staffType] + 1) % this.breakSchedule[staffType].length;
            
            // Try to send next staff member on break
            this.sendStaffOnBreak(staffType);
        }
    }

    generatePatient(isEmergency = false) {
        console.log('Generating patient:', isEmergency ? 'emergency' : 'regular');
        const patient = new Patient(Math.random().toString(36).substr(2, 9));
        
        // Determine severity - 30% chance of urgent if not emergency
        if (!isEmergency) {
            patient.severity = Math.random() < 0.3 ? 'urgent' : 'stable';
        } else {
            patient.severity = 'urgent';
            patient.isEmergency = true;
        }

        console.log('Patient created:', patient.name, patient.severity);

        // Try to add to waiting room
        if (this.waitingRoom.addPatient(patient)) {
            console.log('Patient added to waiting room');
            this.updateWaitingRoomDisplay();
            
            // Log patient arrival
            this.logActivity(
                `${patient.name} arrived with ${patient.condition} (${patient.severity})`,
                isEmergency ? 'emergency' : 'info'
            );

            // Track patient arrival
            this.dataTracker.updateStats(patient, 'arrival');

            // Try to assign patient to staff after a short delay
            setTimeout(() => {
                console.log('Attempting to assign patient to staff:', patient.name);
                this.assignPatientToStaff();
            }, 2000); // 2 second delay
        } else {
            console.log('Waiting room full, patient turned away');
            this.logActivity(
                `${patient.name} turned away - waiting room full`,
                'warning'
            );
        }
    }

    updateWaitingRoomDisplay() {
        const waitingPatients = this.waitingRoom.getAllPatients();
        const waitingRoomElement = document.querySelector('.waiting-patients');
        if (!waitingRoomElement) return;  // Guard against missing element
        
        waitingRoomElement.innerHTML = '';

        let urgentSum = 0, urgentCount = 0, stableSum = 0, stableCount = 0;
        
        // Update waiting room grid in the UI
        waitingPatients.forEach(patient => {
            const patientElement = document.createElement('div');
            patientElement.className = 'waiting-patient';
            
            // Calculate current waiting time in simulation minutes
            const realElapsedMs = Date.now() - patient.addedTime;
            const simElapsedMinutes = Math.floor((realElapsedMs * this.simulationTimeScale) / (1000 * 60));
            
            // Update patient's waiting time property
            patient.waitingTime = simElapsedMinutes;
            if (patient.severity === 'urgent') {
                urgentSum += simElapsedMinutes;
                urgentCount++;
            } else {
                stableSum += simElapsedMinutes;
                stableCount++;
            }
            
            const icon = patient.severity === 'urgent' ? '🚨' : '🤒';
            
            patientElement.innerHTML = `
                <div class="patient-icon">${icon}</div>
                <div class="patient-name">${patient.name}</div>
                <div class="patient-condition">${patient.condition}</div>
                <div class="waiting-time">${simElapsedMinutes}m waiting</div>
            `;
            
            waitingRoomElement.appendChild(patientElement);
        });

        // Batch update average waiting times once
        const urgentAvg = urgentCount ? urgentSum / urgentCount : 0;
        const stableAvg = stableCount ? stableSum / stableCount : 0;
        this.dataTracker.setAverageWaitTimes(urgentAvg, stableAvg);

        // Update hospital map display
        const scene = this.hospitalMap.game.scene.scenes[0];
        if (scene) {
            // Clear existing patient sprites
            if (scene.patientSprites) {
                scene.patientSprites.forEach(sprite => sprite.destroy());
            }
            scene.patientSprites = [];

            // Add new patient sprites to the waiting room grid
            waitingPatients.forEach((patient, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const x = 35 + col * 50 + 22;
                const y = 65 + row * 45 + 20;

                const sprite = scene.add.text(x, y, patient.severity === 'urgent' ? '🚨' : '🤒', {
                    fontSize: '20px'
                });
                sprite.setOrigin(0.5, 0.5);
                scene.patientSprites.push(sprite);
            });
        }
    }

    assignPatientToStaff() {
        console.log('Checking for patients to assign...');
        if (this.waitingRoom.getTotalCount() === 0) {
            console.log('No patients in waiting room');
            return;
        }
        
        // Find available staff member (excluding those on break)
        const availableStaff = Object.values(this.staff).find(staff => 
            !staff.currentPatient && !staff.onBreak && staff.status !== 'on break'
        );
        
        console.log('Available staff:', availableStaff ? availableStaff.name : 'none');
        
        if (!availableStaff) {
            this.logActivity('No staff available for treatment', 'warning');
            return;
        }
        
        // Find available treatment bay that is completely empty
        const availableBay = Object.entries(this.treatmentAreas).find(([bayId, patient]) => {
            // Check if bay is empty of patients
            if (patient) return false;
            
            // Check if ANY staff member is currently in this bay
            const anyStaffInBay = Object.values(this.staff).some(staff => 
                staff.location === bayId || 
                (staff.currentPatient && staff.currentPatient.treatingBay === bayId)
            );
            
            return !anyStaffInBay;
        });
        
        console.log('Available bay:', availableBay ? availableBay[0] : 'none');
        
        if (!availableBay) {
            this.logActivity('No treatment bays available', 'warning');
            return;
        }
        
        const [bayId, _] = availableBay;
        
        // Double check the bay is still available before proceeding
        const bayIsOccupied = Object.values(this.staff).some(staff => 
            staff.location === bayId || 
            (staff.currentPatient && staff.currentPatient.treatingBay === bayId)
        );
        
        if (bayIsOccupied) {
            console.log(`Bay ${bayId} was taken before assignment could be made`);
            return;
        }
        
        const patient = this.waitingRoom.getNextPatient();
        
        if (!patient) {
            console.log('No patient available to assign');
            return;
        }
        
        // Remove from waiting room
        this.waitingRoom.removePatient(patient.id);
        this.updateWaitingRoomDisplay();
        
        // Calculate waiting time in simulation minutes
        const realWaitMs = Date.now() - patient.addedTime;
        const waitingTime = Math.floor((realWaitMs * this.simulationTimeScale) / (1000 * 60));
        
        // Update waiting time statistics
        this.dataTracker.updateStats(patient, 'treatment-start');
        
        // Assign to treatment bay
        this.treatmentAreas[bayId] = patient;
        patient.treatingBay = bayId;
        patient.treatmentStartTime = Date.now();
        
        // Log assignment
        this.logActivity(
            `${patient.name} assigned to ${availableStaff.name} in ${bayId} after ${waitingTime}m wait`,
            'transfer'
        );
        
        // Update staff status
        availableStaff.assignPatient(patient);
        this.staffVisualizer.updateStaffStatus(availableStaff.id, {
            status: 'treating',
            patient: patient
        });

        // Update staff utilization
        this.dataTracker.updateStaffUtilization(availableStaff.id, true);

        // Move directly to treatment bay
        this.hospitalMap.moveStaffToLocation(availableStaff.id, bayId);
        
        // Update treatment bay display with side-by-side layout
        document.getElementById(bayId).innerHTML = `
            <div class="treatment-bay-content">
                <div class="treatment-bay-row">
                    <div class="treatment-bay-person">
                        <span>${availableStaff.role === 'doctor' ? '👨‍⚕️' : '👩‍⚕️'}</span>
                        <span>${availableStaff.name}</span>
                    </div>
                    <div class="treatment-bay-person">
                        <span>${patient.severity === 'urgent' ? '🚨' : '🤒'}</span>
                        <span>${patient.name}</span>
                    </div>
                </div>
                <div class="treatment-bay-info">
                    <span class="condition">${patient.condition}</span>
                </div>
            </div>
        `;
        
        // Simulate treatment (2-5 minutes in simulation time)
        const treatmentDuration = ((Math.random() * 3 + 2) * 60 * 1000) / this.simulationTimeScale;
        setTimeout(() => {
            this.completePatientTreatment(patient, availableStaff, bayId);
        }, treatmentDuration);
    }

    completePatientTreatment(patient, staff, bayId) {
        // Update stats
        patient.treatmentEndTime = Date.now();
        patient.treatmentTime = (patient.treatmentEndTime - patient.treatmentStartTime) / 1000 / 60;
        this.dataTracker.updateStats(patient, 'treatment-end');
        
        // Log treatment completion
        this.logActivity(
            `${patient.name} treatment completed by ${staff.name}`,
            'treatment'
        );
        
        // Clear treatment bay
        this.treatmentAreas[bayId] = null;
        document.getElementById(bayId).innerHTML = '';
        
        // Update staff status
        staff.releasePatient();
        this.staffVisualizer.updateStaffStatus(staff.id, {
            status: 'available'
        });

        // Update staff utilization
        this.dataTracker.updateStaffUtilization(staff.id, false);

        // Move staff back to their station
        const staffLocation = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
        this.hospitalMap.moveStaffToLocation(staff.id, staffLocation);
        
        // Try to assign new patient if any waiting
        if (this.waitingRoom.getTotalCount() > 0) {
            setTimeout(() => {
                this.assignPatientToStaff();
            }, 1000); // Add a small delay before next assignment
        }
    }

    updateStaffStatus(staffId, status) {
        const staff = this.staff[staffId];
        if (!staff) return;

        const staffWindow = document.querySelector(`#${staffId}-canvas`);
        const statusElement = staffWindow.parentElement.querySelector('.status');
        const patientInfo = staffWindow.querySelector('.patient-info');
        
        if (status.patient) {
            // Staff is treating a patient
            staff.status = 'busy';
            statusElement.textContent = 'Busy';
            statusElement.classList.remove('available', 'on-break');
            statusElement.classList.add('busy');
            
            patientInfo.innerHTML = `
                <div class="patient-icon">🏥</div>
                <div class="patient-name">Treating ${status.patient.name}</div>
                <div class="treatment-timer">0:00</div>
            `;
        } else if (status.status === 'on break') {
            // Staff is on break
            staff.status = 'on break';
            statusElement.textContent = 'On Break';
            statusElement.classList.remove('available', 'busy');
            statusElement.classList.add('on-break');
            
            patientInfo.innerHTML = `
                <div class="patient-icon">☕</div>
                <div class="break-info">Taking a break</div>
            `;

            // Ensure staff is moved to rest area
            this.hospitalMap.moveStaffToLocation(staffId, 'rest');
        } else {
            // Staff is available
            staff.status = 'available';
            statusElement.textContent = 'Available';
            statusElement.classList.remove('busy', 'on-break');
            statusElement.classList.add('available');
            
            patientInfo.innerHTML = ''; // Empty when available
            
            // Move back to appropriate station if they were on break
            if (staff.location === 'rest') {
                const returnLocation = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                this.hospitalMap.moveStaffToLocation(staffId, returnLocation);
            }
        }
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HospitalSimulation();
});
