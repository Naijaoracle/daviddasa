// Patient Model
class Patient {
    constructor(id) {
        this.id = id;
        this.name = this.generateName();
        this.condition = this.generateCondition();
        this.isEmergency = Math.random() < 0.1; // 10% chance for emergency
        this.severity = this.generateSeverity(); // Move after isEmergency
        this.waitingTime = 0;
        this.arrivalTime = Date.now();
        this.treatmentStartTime = null;
        this.treatmentEndTime = null;
        this.treatedBy = null;
        this.avatar = this.generateAvatar();
        this.vitals = this.generateVitals();
        this.age = Math.floor(Math.random() * 70) + 18;
        this.gender = Math.random() < 0.5 ? 'Male' : 'Female';
    }

    generateName() {
        const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
                           'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                          'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    generateCondition() {
        const conditions = [
            'Chest Pain', 'Broken Arm', 'High Fever', 'Severe Headache',
            'Allergic Reaction', 'Cut Wound', 'Breathing Difficulty', 'Stomach Pain',
            'Back Pain', 'Dizziness', 'Sprained Ankle', 'Eye Irritation',
            'Burn', 'Nausea', 'Skin Rash', 'Joint Pain'
        ];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    generateSeverity() {
        // More complex severity determination based on condition
        const criticalConditions = ['Chest Pain', 'Breathing Difficulty', 'Severe Headache'];
        if (criticalConditions.includes(this.condition) || this.isEmergency) {
            return 'urgent';
        }
        return Math.random() < 0.3 ? 'urgent' : 'stable';
    }

    generateAvatar() {
        const avatars = ['🤒', '😷', '🤕', '🤢', '🤧', '😵', '🥴', '🤩'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    generateVitals() {
        // Generate reasonable vital signs based on condition and severity
        let heartRate, bloodPressure, temperature, respiratoryRate;
        
        if (this.severity === 'urgent' || this.isEmergency) {
            // Abnormal vitals for urgent cases
            heartRate = Math.floor(Math.random() * 40) + 100; // 100-140 bpm
            
            const systolic = Math.floor(Math.random() * 60) + 140; // 140-200 mmHg
            const diastolic = Math.floor(Math.random() * 30) + 90; // 90-120 mmHg
            bloodPressure = `${systolic}/${diastolic}`;
            
            temperature = (Math.random() * 2 + 38).toFixed(1); // 38-40°C
            respiratoryRate = Math.floor(Math.random() * 10) + 20; // 20-30 bpm
        } else {
            // Normal range vitals for stable cases
            heartRate = Math.floor(Math.random() * 40) + 60; // 60-100 bpm
            
            const systolic = Math.floor(Math.random() * 40) + 110; // 110-150 mmHg
            const diastolic = Math.floor(Math.random() * 20) + 70; // 70-90 mmHg
            bloodPressure = `${systolic}/${diastolic}`;
            
            temperature = (Math.random() * 1.5 + 36.5).toFixed(1); // 36.5-38°C
            respiratoryRate = Math.floor(Math.random() * 8) + 12; // 12-20 bpm
        }
        
        return {
            heartRate,
            bloodPressure,
            temperature,
            respiratoryRate
        };
    }

    updateWaitingTime() {
        if (!this.treatmentStartTime) {
            this.waitingTime = Math.floor((Date.now() - this.arrivalTime) / 1000);
        }
    }
}

// Staff Model
class Staff {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role; // 'doctor' or 'nurse'
        this.status = 'available'; // 'available', 'busy', 'assisting'
        this.currentPatient = null;
        this.location = 'station'; // 'station', 'bay1', 'bay2', 'bay3', 'bay4', 'lab', 'rest'
        this.busyUntil = 0;
        this.totalPatientsServed = 0;
        this.totalWorkTime = 0;
        this.specializationSkills = this.generateSpecializationSkills();
        this.assistingStaff = null;
        this.icon = role === 'doctor' ? (name.includes('Dr. Smith') ? '👨‍⚕️' : '👩‍⚕️') : (name.includes('Nurse Davis') ? '👨‍⚕️' : '👩‍⚕️');
        this.activityLog = [];
    }

    generateSpecializationSkills() {
        const allSkills = {
            'doctor': ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine', 'Internal Medicine'],
            'nurse': ['Triage', 'Wound Care', 'Pediatrics', 'Critical Care', 'Geriatrics']
        };
        
        // Select 2-3 skills for this staff member
        const skillsCount = Math.floor(Math.random() * 2) + 2;
        const skills = [];
        
        while (skills.length < skillsCount) {
            const skill = allSkills[this.role][Math.floor(Math.random() * allSkills[this.role].length)];
            if (!skills.includes(skill)) {
                skills.push(skill);
            }
        }
        
        return skills;
    }

    assignPatient(patient) {
        this.status = 'busy';
        this.currentPatient = patient;
        patient.treatedBy = this.name;
        patient.treatmentStartTime = Date.now();
        this.addActivity(`Started treating ${patient.name} for ${patient.condition}`);
    }

    releasePatient() {
        if (this.currentPatient) {
            const patient = this.currentPatient;
            patient.treatmentEndTime = Date.now();
            
            // Calculate treatment time in minutes
            const treatmentTimeMinutes = ((patient.treatmentEndTime - patient.treatmentStartTime) / 1000 / 60).toFixed(1);
            this.totalWorkTime += parseFloat(treatmentTimeMinutes);
            
            this.totalPatientsServed++;
            this.addActivity(`Completed treatment for ${patient.name} after ${treatmentTimeMinutes} minutes`);
            
            this.currentPatient = null;
            this.status = 'available';
            return patient;
        }
        return null;
    }

    requestAssistance(fromStaff) {
        this.assistingStaff = fromStaff;
        fromStaff.status = 'assisting';
        fromStaff.addActivity(`Assisting ${this.name} with patient ${this.currentPatient.name}`);
        this.addActivity(`Requested assistance from ${fromStaff.name}`);
    }

    completeAssistance() {
        if (this.assistingStaff) {
            this.assistingStaff.status = 'available';
            this.assistingStaff.addActivity(`Completed assisting ${this.name}`);
            this.assistingStaff = null;
        }
    }

    takeBreak(duration = 5) {
        this.status = 'on break';
        this.location = 'rest';
        this.busyUntil = Date.now() + (duration * 60 * 1000); // duration in minutes
        this.addActivity(`Taking a ${duration} minute break`);
    }

    addActivity(description) {
        this.activityLog.push({
            timestamp: Date.now(),
            description
        });
    }
}

// Hospital Resources Model
class HospitalResources {
    constructor() {
        this.medications = {
            'Painkillers': 100,
            'Antibiotics': 75,
            'Sedatives': 50,
            'Antihistamines': 60,
            'IV Fluids': 120
        };
        
        this.equipment = {
            'Ventilators': { total: 10, available: 8 },
            'X-Ray Machines': { total: 3, available: 3 },
            'CT Scanners': { total: 1, available: 1 },
            'MRI Machines': { total: 1, available: 1 },
            'Defibrillators': { total: 5, available: 5 }
        };
        
        this.rooms = {
            'Operating Rooms': { total: 2, available: 2 },
            'ICU Beds': { total: 8, available: 6 },
            'Regular Beds': { total: 25, available: 15 }
        };
    }

    useMedication(name, quantity = 1) {
        if (this.medications[name] >= quantity) {
            this.medications[name] -= quantity;
            return true;
        }
        return false;
    }

    useEquipment(name) {
        if (this.equipment[name].available > 0) {
            this.equipment[name].available -= 1;
            return true;
        }
        return false;
    }

    releaseEquipment(name) {
        if (this.equipment[name].available < this.equipment[name].total) {
            this.equipment[name].available += 1;
            return true;
        }
        return false;
    }

    useRoom(type) {
        if (this.rooms[type].available > 0) {
            this.rooms[type].available -= 1;
            return true;
        }
        return false;
    }

    releaseRoom(type) {
        if (this.rooms[type].available < this.rooms[type].total) {
            this.rooms[type].available += 1;
            return true;
        }
        return false;
    }
}