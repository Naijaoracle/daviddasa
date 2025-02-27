class Patient {
    constructor(id) {
        this.id = id;
        this.name = this.generateName();
        this.condition = this.generateCondition();
        this.severity = this.generateSeverity();
        this.waitingTime = 0;
    }

    generateName() {
        const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    generateCondition() {
        const conditions = [
            'Chest Pain', 'Broken Arm', 'High Fever', 'Severe Headache',
            'Allergic Reaction', 'Cut Wound', 'Breathing Difficulty', 'Stomach Pain'
        ];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    generateSeverity() {
        return Math.random() < 0.3 ? 'urgent' : 'stable';
    }
}

class HospitalSimulation {
    constructor() {
        this.patients = [];
        this.treatmentBays = {
            bay1: null,
            bay2: null,
            bay3: null,
            bay4: null
        };
        this.patientCounter = 0;
        this.isRunning = false;
        this.dialogueQueue = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-patient').addEventListener('click', () => this.addNewPatient());
        document.getElementById('toggle-simulation').addEventListener('click', () => this.toggleSimulation());
    }

    addNewPatient() {
        const patient = new Patient(++this.patientCounter);
        this.patients.push(patient);
        this.addPatientToWaitingRoom(patient);
        this.addDialogue(`New patient arrived: ${patient.name} - ${patient.condition} (${patient.severity})`);
    }

    addPatientToWaitingRoom(patient) {
        const waitingRoom = document.querySelector('.waiting-patients');
        const patientElement = document.createElement('div');
        patientElement.className = `patient ${patient.severity}`;
        patientElement.id = `patient-${patient.id}`;
        patientElement.innerHTML = `
            <span>🤒</span>
            <div>
                <strong>${patient.name}</strong>
                <div>${patient.condition}</div>
            </div>
        `;
        waitingRoom.appendChild(patientElement);
    }

    assignPatientToTreatmentBay() {
        if (this.patients.length === 0) return;

        for (const bayId in this.treatmentBays) {
            if (this.treatmentBays[bayId] === null) {
                // Find the most urgent patient
                const urgentPatients = this.patients.filter(p => p.severity === 'urgent');
                const patientToTreat = urgentPatients.length > 0 ? urgentPatients[0] : this.patients[0];
                
                // Move patient to treatment bay
                this.treatmentBays[bayId] = patientToTreat;
                const patientElement = document.getElementById(`patient-${patientToTreat.id}`);
                const bay = document.getElementById(bayId);
                
                if (patientElement && bay) {
                    patientElement.remove();
                    const treatingPatient = patientElement.cloneNode(true);
                    treatingPatient.classList.add('being-treated');
                    bay.appendChild(treatingPatient);
                    
                    // Remove patient from waiting list
                    this.patients = this.patients.filter(p => p.id !== patientToTreat.id);
                    
                    // Add treatment dialogue
                    this.addDialogue(`${this.getRandomStaffMember()} is now treating ${patientToTreat.name} in ${bayId}`);
                    
                    // Schedule patient release
                    setTimeout(() => {
                        this.releasePatient(bayId, patientToTreat);
                    }, this.getTreatmentTime());
                }
                break;
            }
        }
    }

    releasePatient(bayId, patient) {
        const bay = document.getElementById(bayId);
        if (bay) {
            bay.innerHTML = bayId.replace('bay', 'Bay ');
            this.treatmentBays[bayId] = null;
            this.addDialogue(`${patient.name} has been treated and released`);
        }
    }

    getRandomStaffMember() {
        const staff = ['Dr. Smith', 'Dr. Johnson', 'Nurse Davis', 'Nurse Wilson'];
        return staff[Math.floor(Math.random() * staff.length)];
    }

    getTreatmentTime() {
        return Math.random() * 5000 + 5000; // 5-10 seconds
    }

    addDialogue(message) {
        const dialogueContent = document.querySelector('.dialogue-content');
        const timestamp = new Date().toLocaleTimeString();
        const dialogueElement = document.createElement('div');
        dialogueElement.textContent = `[${timestamp}] ${message}`;
        dialogueContent.insertBefore(dialogueElement, dialogueContent.firstChild);
        
        // Keep only last 5 messages
        while (dialogueContent.children.length > 5) {
            dialogueContent.removeChild(dialogueContent.lastChild);
        }
    }

    toggleSimulation() {
        this.isRunning = !this.isRunning;
        const button = document.getElementById('toggle-simulation');
        button.textContent = this.isRunning ? 'Stop Simulation' : 'Start Simulation';
        button.style.background = this.isRunning ? '#e74c3c' : '#27ae60';
        
        if (this.isRunning) {
            this.runSimulation();
        }
    }

    runSimulation() {
        if (!this.isRunning) return;
        
        this.assignPatientToTreatmentBay();
        
        // Randomly add new patients
        if (Math.random() < 0.3) {
            this.addNewPatient();
        }
        
        setTimeout(() => this.runSimulation(), 2000);
    }
}

// Initialize the simulation
const hospitalSim = new HospitalSimulation(); 