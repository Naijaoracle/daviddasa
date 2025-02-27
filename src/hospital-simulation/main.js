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
        
        // Initialize staff visualizer
        this.staffVisualizer = new StaffVisualizer(Object.values(this.staff));
        
        // Initialize hospital resources
        this.resources = new HospitalResources();
        
        // Initialize waiting room and treatment areas
        this.waitingRoom = [];
        this.treatmentAreas = {
            bay1: null,
            bay2: null,
            bay3: null,
            bay4: null
        };
        
        // Bind event listeners
        this.bindEventListeners();
    }

    bindEventListeners() {
        document.getElementById('add-patient').addEventListener('click', () => this.generatePatient());
        document.getElementById('add-emergency').addEventListener('click', () => this.generatePatient(true));
    }

    start() {
        this.running = true;
        this.runSimulation();
    }

    stop() {
        this.running = false;
    }

    runSimulation() {
        if (!this.running) return;

        // Simulate patient arrival every few seconds
        setInterval(() => {
            if (this.running) {
                this.generatePatient();
            }
        }, 3000);
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
                
                // Update staff status
                availableStaff.assignPatient(patient);
                this.staffVisualizer.updateStaffStatus(availableStaff.id, {
                    status: 'treating',
                    patient: patient
                });
                
                // Update treatment bay display
                document.getElementById(bayId).innerHTML = `
                    ${availableStaff.role === 'doctor' ? '👨‍⚕️' : '👩‍⚕️'} ${availableStaff.name}<br>
                    🤒 ${patient.name}
                `;
                
                // Simulate treatment
                setTimeout(() => {
                    this.completePatientTreatment(patient, availableStaff, bayId);
                }, (Math.random() * 10000) + 5000);
            }
        }
    }

    completePatientTreatment(patient, staff, bayId) {
        // Update stats
        patient.treatmentEndTime = Date.now();
        patient.treatmentTime = (patient.treatmentEndTime - patient.treatmentStartTime) / 1000 / 60;
        this.dataTracker.updateStats(patient, 'treatment-end');
        
        // Clear treatment bay
        this.treatmentAreas[bayId] = null;
        document.getElementById(bayId).innerHTML = `Bay ${bayId.slice(-1)}`;
        
        // Update staff status
        staff.releasePatient();
        this.staffVisualizer.updateStaffStatus(staff.id, {
            status: 'available'
        });
        
        // Try to assign new patient if any waiting
        if (this.waitingRoom.length > 0) {
            this.assignPatientToStaff(this.waitingRoom[0]);
        }
    }
}

// Initialize and start the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new HospitalSimulation();
    simulation.start();
});
