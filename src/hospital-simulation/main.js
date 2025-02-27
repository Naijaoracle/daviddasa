// Main Hospital Simulation Controller

class HospitalSimulation {
    constructor() {
        this.dataTracker = new DataTracker();
        this.running = false;
    }

    start() {
        this.running = true;
        this.runSimulation();
    }

    stop() {
        this.running = false;
    }

    runSimulation() {
        // Simulation loop
        if (!this.running) return;

        // Simulate patient arrival every few seconds
        setInterval(() => {
            if (this.running) {
                this.generatePatient();
            }
        }, 3000);
    }

    generatePatient() {
        const conditions = ['Fracture', 'Fever', 'Chest Pain', 'Headache', 'Allergic Reaction'];
        const severities = ['urgent', 'stable'];
        
        const patient = {
            id: Math.random().toString(36).substr(2, 9),
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            arrivalTime: Date.now(),
            waitingTime: 0,
            treatmentTime: 0
        };

        // Track patient arrival
        this.dataTracker.updateStats(patient, 'arrival');

        // Simulate treatment after random delay
        setTimeout(() => {
            patient.waitingTime = (Date.now() - patient.arrivalTime) / 1000 / 60; // Convert to minutes
            this.dataTracker.updateStats(patient, 'treatment-start');
            
            // Simulate treatment duration
            setTimeout(() => {
                patient.treatmentTime = Math.random() * 30 + 15; // 15-45 minutes
                this.dataTracker.updateStats(patient, 'treatment-end');
            }, Math.random() * 5000 + 2000);
        }, Math.random() * 10000 + 2000);
    }
}

// Initialize and start the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const simulation = new HospitalSimulation();
    simulation.start();
});
