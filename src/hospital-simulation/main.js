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
        
        // Simulation time settings
        this.simulationTimeScale = 10; // 1 real second = 10 simulation seconds
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
        
        // Bind event listeners
        this.bindEventListeners();
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

        // Only keep the 10 most recent entries
        this.activityLog = this.activityLog.slice(0, 10);

        logContainer.innerHTML = this.activityLog
            .map(entry => `
                <div class="log-entry ${entry.type}">
                    <span class="timestamp">${entry.timestamp}</span>
                    ${entry.message}
                </div>
            `)
            .join('');
    }

    bindEventListeners() {
        document.getElementById('toggle-simulation').addEventListener('click', () => {
            const button = document.getElementById('toggle-simulation');
            if (this.running) {
                this.stop();
                button.textContent = 'Start Simulation';
                button.style.background = '#27ae60';
            } else {
                this.start();
                button.textContent = 'Stop Simulation';
                button.style.background = '#e74c3c';
            }
        });
    }

    getSimulationTime() {
        if (!this.simulationStartTime) return 0;
        const realElapsed = Date.now() - this.simulationStartTime;
        return realElapsed * (this.simulationTimeScale / 1000); // Convert to simulation seconds
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.simulationStartTime = Date.now();
        this.logActivity('Simulation started', 'info');
        
        // Start break rotation
        this.startBreakRotation();
        
        // Generate initial batch of patients (4-8 patients)
        const initialPatients = Math.floor(Math.random() * 5) + 4;
        for (let i = 0; i < initialPatients; i++) {
            this.generatePatient();
        }
        
        // Start patient generation
        this.simulationInterval = setInterval(() => {
            if (this.running) {
                // 15% chance of emergency patient
                if (Math.random() < 0.15) {
                    this.generatePatient(true);
                } else {
                    this.generatePatient();
                }
            }
        }, 3000);
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        this.logActivity('Simulation stopped', 'warning');
        
        // Clear all intervals
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        if (this.breakRotationInterval) {
            clearInterval(this.breakRotationInterval);
        }
    }

    startBreakRotation() {
        // Initially send first staff members on break
        this.sendStaffOnBreak('doctors');
        this.sendStaffOnBreak('nurses');
        
        // Set up break rotation interval using simulation time
        const workDurationReal = (this.breakSchedule.workDuration * 60 * 1000) / this.simulationTimeScale;
        
        this.breakRotationInterval = setInterval(() => {
            this.rotateBreaks('doctors');
            this.rotateBreaks('nurses');
        }, workDurationReal);
    }

    sendStaffOnBreak(staffType) {
        const currentId = this.breakSchedule[staffType][this.breakSchedule.currentIndex[staffType]];
        const staff = this.staff[currentId];
        
        if (staff && !staff.currentPatient) {
            staff.status = 'on break';
            this.staffVisualizer.updateStaffStatus(staff.id, { status: 'on break' });
            
            // Move staff to rest area in the hospital map
            this.hospitalMap.moveStaffToLocation(staff.id, 'restArea');
            
            this.logActivity(`${staff.name} is taking a break`, 'info');
            
            // Schedule end of break using simulation time
            const breakDurationReal = (this.breakSchedule.breakDuration * 60 * 1000) / this.simulationTimeScale;
            
            setTimeout(() => {
                if (staff.status === 'on break') {
                    staff.status = 'available';
                    this.staffVisualizer.updateStaffStatus(staff.id, { status: 'available' });
                    
                    // Move staff back to their office/station
                    const location = staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation';
                    this.hospitalMap.moveStaffToLocation(staff.id, location);
                    
                    this.logActivity(`${staff.name} has returned from break`, 'info');
                }
            }, breakDurationReal);

            // Prevent staff from being assigned during break
            staff.onBreak = true;
            setTimeout(() => {
                staff.onBreak = false;
            }, breakDurationReal);
        }
    }

    rotateBreaks(staffType) {
        // Move to next staff member in rotation
        this.breakSchedule.currentIndex[staffType] = 
            (this.breakSchedule.currentIndex[staffType] + 1) % this.breakSchedule[staffType].length;
        
        this.sendStaffOnBreak(staffType);
    }

    runSimulation() {
        // This method is now handled by start()
        this.start();
    }

    generatePatient(isEmergency = false) {
        const patient = new Patient(Math.random().toString(36).substr(2, 9));
        
        // Determine severity - 30% chance of urgent if not emergency
        if (!isEmergency) {
            patient.severity = Math.random() < 0.3 ? 'urgent' : 'stable';
        } else {
            patient.severity = 'urgent';
            patient.isEmergency = true;
        }

        // Try to add to waiting room
        if (this.waitingRoom.addPatient(patient)) {
            this.updateWaitingRoomDisplay();
            
            // Log patient arrival
            this.logActivity(
                `${patient.name} arrived with ${patient.condition} (${patient.severity})`,
                isEmergency ? 'emergency' : 'info'
            );

            // Track patient arrival
            this.dataTracker.updateStats(patient, 'arrival');

            // Try to assign patient to available staff
            this.assignPatientToStaff();
        } else {
            this.logActivity(
                `${patient.name} turned away - waiting room full`,
                'warning'
            );
        }
    }

    updateWaitingRoomDisplay() {
        // Update the waiting room display in the metrics panel
        const waitingRoomElement = document.querySelector('.waiting-patients');
        waitingRoomElement.innerHTML = '';
        
        const waitingRoomGrid = document.createElement('div');
        waitingRoomGrid.className = 'waiting-room-grid';
        
        // Get all waiting room cells in the hospital map
        const mapCells = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                const cellId = `waiting_${i}_${j}`;
                const cell = document.querySelector(`[name="${cellId}"]`);
                if (cell) {
                    mapCells.push(cell);
                }
            }
        }
        console.log('Found waiting room cells:', mapCells.length); // Debug log
        
        // Clear all existing cells
        mapCells.forEach(cell => {
            const cellGraphics = cell.graphics;
            if (cellGraphics) {
                cellGraphics.destroy();
            }
            cell.removeAllListeners('pointerover');
            cell.removeAllListeners('pointerout');
            
            // Create new graphics for the cell
            const scene = this.hospitalMap.game.scene.scenes[0];
            const initialCellGraphics = scene.add.graphics();
            const bounds = cell.getBounds();
            
            // Draw the cell background
            initialCellGraphics.fillStyle(0xf0f0f0);
            initialCellGraphics.fillRect(bounds.x - bounds.width/2, bounds.y - bounds.height/2, bounds.width, bounds.height);
            
            cell.graphics = initialCellGraphics;
        });
        
        // Fill grid with patients
        const patients = this.waitingRoom.getAllPatients();
        console.log('Patients to display:', patients.length); // Debug log
        
        patients.forEach((patient, index) => {
            if (index < mapCells.length) {
                const cell = mapCells[index];
                const scene = this.hospitalMap.game.scene.scenes[0];
                const bounds = cell.getBounds();
                
                // Create patient icon
                const icon = patient.severity === 'urgent' ? '🚨' : '🤒';
                const patientIcon = scene.add.text(
                    bounds.centerX,
                    bounds.centerY,
                    icon,
                    { fontSize: '16px' }
                );
                patientIcon.setOrigin(0.5, 0.5);
                
                // Update cell graphics
                const patientCellGraphics = cell.graphics;
                if (patientCellGraphics) {
                    patientCellGraphics.clear();
                    patientCellGraphics.fillStyle(0xffffff);
                    patientCellGraphics.fillRect(bounds.x - bounds.width/2, bounds.y - bounds.height/2, bounds.width, bounds.height);
                    patientCellGraphics.lineStyle(2, patient.severity === 'urgent' ? 0xe74c3c : 0x27ae60);
                    patientCellGraphics.strokeRect(bounds.x - bounds.width/2, bounds.y - bounds.height/2, bounds.width, bounds.height);
                }
                
                // Store the icon reference in the cell
                cell.patientIcon = patientIcon;
                
                // Update metrics panel grid
                const patientCell = document.createElement('div');
                patientCell.className = `patient-cell ${patient.severity}`;
                
                // Calculate wait time using simulation time
                const realWaitTime = Date.now() - patient.addedTime;
                const simulationWaitTime = Math.floor((realWaitTime * this.simulationTimeScale) / (1000 * 60)); // simulation minutes
                
                patientCell.innerHTML = `
                    <div class="patient-icon">${icon}</div>
                    <div class="patient-info">
                        <div class="patient-name">${patient.name}</div>
                        <div class="patient-condition">${patient.condition}</div>
                        <div class="wait-time">${simulationWaitTime}m waiting</div>
                    </div>
                `;
                waitingRoomGrid.appendChild(patientCell);
            }
        });
        
        // Clean up any remaining patient icons from empty cells
        mapCells.slice(patients.length).forEach(cell => {
            if (cell.patientIcon) {
                cell.patientIcon.destroy();
                cell.patientIcon = null;
            }
            
            // Reset cell graphics to empty state
            const emptyGraphics = cell.graphics;
            if (emptyGraphics) {
                emptyGraphics.clear();
                emptyGraphics.fillStyle(0xf0f0f0);
                const bounds = cell.getBounds();
                emptyGraphics.fillRect(bounds.x - bounds.width/2, bounds.y - bounds.height/2, bounds.width, bounds.height);
                emptyGraphics.lineStyle(1, 0xdddddd);
                emptyGraphics.strokeRect(bounds.x - bounds.width/2, bounds.y - bounds.height/2, bounds.width, bounds.height);
            }
        });
        
        waitingRoomElement.appendChild(waitingRoomGrid);
    }

    assignPatientToStaff() {
        if (this.waitingRoom.getTotalCount() === 0) return;

        // Find available staff member (excluding those on break)
        const availableStaff = Object.values(this.staff).find(staff => 
            !staff.currentPatient && !staff.onBreak && staff.status !== 'on break'
        );
        
        if (availableStaff) {
            // Find available treatment bay
            const availableBay = Object.entries(this.treatmentAreas).find(([_, p]) => !p);
            
            if (availableBay) {
                const [bayId, _] = availableBay;
                const patient = this.waitingRoom.getNextPatient();
                
                if (!patient) return;

                // Remove from waiting room
                this.waitingRoom.removePatient(patient.id);
                this.updateWaitingRoomDisplay();
                
                // Calculate waiting time
                const waitingTime = Math.floor((Date.now() - patient.addedTime) / 1000 / 60); // minutes
                
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
                
                // Simulate treatment (5-15 minutes in simulation time)
                const treatmentDuration = ((Math.random() * 10 + 5) * 60 * 1000) / this.simulationTimeScale;
                setTimeout(() => {
                    this.completePatientTreatment(patient, availableStaff, bayId);
                }, treatmentDuration);
            } else {
                this.logActivity(
                    `No treatment bays available for ${patient.name}`,
                    'warning'
                );
            }
        } else {
            this.logActivity(
                `No staff available to treat ${patient.name}`,
                'warning'
            );
        }
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
        const staffWindow = document.querySelector(`#${staffId}-canvas`);
        const statusElement = staffWindow.parentElement.querySelector('.status');
        const patientInfo = staffWindow.querySelector('.patient-info');
        
        if (status.patient) {
            // Staff is treating a patient
            statusElement.textContent = 'Busy';
            statusElement.classList.remove('available');
            statusElement.classList.add('busy');
            
            patientInfo.innerHTML = `
                <div class="patient-icon">🏥</div>
                <div class="patient-name">Treating ${status.patient.name}</div>
                <div class="treatment-timer">0:00</div>
            `;
        } else {
            // Staff is available
            statusElement.textContent = 'Available';
            statusElement.classList.remove('busy');
            statusElement.classList.add('available');
            
            patientInfo.innerHTML = ''; // Empty when available
        }
    }
}

// Initialize and start the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new HospitalSimulation();
    simulation.start();
});
