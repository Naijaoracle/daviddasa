// Main Hospital Simulation Controller

class HospitalSimulation {
    constructor() {
        this.dataTracker = new DataTracker();
        this.running = false;
        
        // Initialize staff members
        this.staff = {
            doctor1: new Staff('doctor1', 'Dr. Smith', 'doctor'),
            doctor2: new Staff('doctor2', 'Dr. Johnson', 'doctor'),
            nurse1: new Staff('nurse1', 'Nurse Davis', 'nurse'),
            nurse2: new Staff('nurse2', 'Nurse Wilson', 'nurse')
        };
        
        // Initialize hospital resources
        this.resources = new HospitalResources();
        
        // Initialize staff visualizer
        this.staffVisualizer = new StaffVisualizer(Object.values(this.staff));
        
        // Initialize hospital map
        this.hospitalMap = new HospitalMap(Object.values(this.staff), this.resources);
        
        // Initialize waiting room and treatment areas
        this.waitingRoom = [];
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

    start() {
        if (this.running) return; // Don't start if already running
        this.running = true;
        this.logActivity('Simulation started', 'info');
        this.simulationInterval = setInterval(() => {
            if (this.running) {
                this.generatePatient();
            }
        }, 3000);
    }

    stop() {
        if (!this.running) return; // Don't stop if already stopped
        this.running = false;
        this.logActivity('Simulation stopped', 'warning');
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
    }

    runSimulation() {
        // This method is now handled by start()
        this.start();
    }

    generatePatient(isEmergency = false) {
        const patient = new Patient(Math.random().toString(36).substr(2, 9));
        if (isEmergency) {
            patient.severity = 'urgent';
            patient.isEmergency = true;
        }

        // Add to waiting room
        this.waitingRoom.push(patient);
        this.updateWaitingRoomDisplay();

        // Log patient arrival
        this.logActivity(
            `${patient.name} arrived with ${patient.condition} (${patient.severity})`,
            isEmergency ? 'emergency' : 'info'
        );

        // Track patient arrival
        this.dataTracker.updateStats(patient, 'arrival');

        // Try to assign patient to available staff
        this.assignPatientToStaff(patient);
    }

    updateWaitingRoomDisplay() {
        const waitingRoomElement = document.querySelector('.waiting-patients');
        waitingRoomElement.innerHTML = '';
        
        this.waitingRoom.forEach(patient => {
            const patientElement = document.createElement('div');
            patientElement.className = `patient-avatar ${patient.severity}`;
            patientElement.innerHTML = `🤒 ${patient.name}<br>${patient.condition}`;
            waitingRoomElement.appendChild(patientElement);
        });
    }

    assignPatientToStaff(patient) {
        // Find available staff member
        const availableStaff = Object.values(this.staff).find(staff => !staff.currentPatient);
        
        if (availableStaff) {
            // Find available treatment bay
            const availableBay = Object.entries(this.treatmentAreas).find(([_, p]) => !p);
            
            if (availableBay) {
                const [bayId, _] = availableBay;
                
                // Remove from waiting room
                this.waitingRoom = this.waitingRoom.filter(p => p.id !== patient.id);
                this.updateWaitingRoomDisplay();
                
                // Assign to treatment bay
                this.treatmentAreas[bayId] = patient;
                
                // Log assignment
                this.logActivity(
                    `${patient.name} assigned to ${availableStaff.name} in ${bayId}`,
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

                // Move staff to patient in waiting room first
                this.hospitalMap.moveStaffToLocation(availableStaff.id, 'waitingRoom');
                
                // Then after a delay, move to treatment bay
                setTimeout(() => {
                    this.hospitalMap.moveStaffToLocation(availableStaff.id, bayId);
                }, 1500);
                
                // Update treatment bay display
                document.getElementById(bayId).innerHTML = `
                    ${availableStaff.role === 'doctor' ? '👨‍⚕️' : '👩‍⚕️'} ${availableStaff.name}<br>
                    🤒 ${patient.name}
                `;
                
                // Simulate treatment
                setTimeout(() => {
                    this.completePatientTreatment(patient, availableStaff, bayId);
                }, (Math.random() * 10000) + 5000);
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
        document.getElementById(bayId).innerHTML = `Bay ${bayId.slice(-1)}`;
        
        // Update staff status
        staff.releasePatient();
        this.staffVisualizer.updateStaffStatus(staff.id, {
            status: 'available'
        });

        // Update staff utilization
        this.dataTracker.updateStaffUtilization(staff.id, false);

        // Move staff back to their station
        this.hospitalMap.moveStaffToLocation(staff.id, staff.role === 'doctor' ? 'doctorOffice' : 'nurseStation');
        
        // Try to assign new patient if any waiting
        if (this.waitingRoom.length > 0) {
            this.assignPatientToStaff(this.waitingRoom[0]);
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
            
            patientInfo.innerHTML = `
                <div class="patient-icon">⏳</div>
                <div class="patient-name">Waiting for patient</div>
            `;
        }
    }
}

// Initialize and start the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new HospitalSimulation();
    simulation.start();
});
