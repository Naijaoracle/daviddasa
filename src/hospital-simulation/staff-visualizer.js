// Staff Activity Visualizer using p5.js
class StaffVisualizer {
    constructor(staffMembers) {
        this.staffMembers = staffMembers;
        this.sketches = {};
        this.iconImages = {
            'patient': null,
            'doctor': null,
            'nurse': null,
            'lab': null,
            'rest': null,
            'medicine': null
        };
        this.initializeVisualizers();
    }

    initializeVisualizers() {
        // Create a p5 sketch for each staff member
        this.staffMembers.forEach(staff => {
            const sketchId = staff.id;
            
            this.sketches[sketchId] = new p5(sketch => {
                let activities = [];
                let lastActivity = null;
                let icons = {};
                let activityScene = null;
                
                sketch.preload = () => {
                    // We're using emoji icons instead of loading images
                };
                
                sketch.setup = () => {
                    const canvas = sketch.createCanvas(300, 150);
                    canvas.parent(`${sketchId}-canvas`);
                    sketch.frameRate(30);
                    sketch.textAlign(sketch.CENTER, sketch.CENTER);
                    
                    // Create the activity scene for this staff member
                    activityScene = new ActivityScene(sketch, staff);
                };
                
                sketch.draw = () => {
                    sketch.background(245, 247, 250);
                    
                    // Update the current status and activity
                    updateStaffStatus();
                    
                    // Draw the activity scene
                    if (activityScene) {
                        activityScene.update();
                        activityScene.display();
                    }
                };
                
                function updateStaffStatus() {
                    // Check if the staff status has changed
                    if (lastActivity !== staff.status || 
                        (staff.currentPatient && !activities.includes(staff.currentPatient.condition))) {
                        
                        lastActivity = staff.status;
                        
                        if (staff.status === 'busy' && staff.currentPatient) {
                            activities = [staff.currentPatient.condition];
                            activityScene.setActivityType('treating');
                            activityScene.setPatientDetails(staff.currentPatient);
                        } else if (staff.status === 'assisting') {
                            activities = ['Assisting colleague'];
                            activityScene.setActivityType('assisting');
                        } else if (staff.status === 'on break') {
                            activities = ['Taking a break'];
                            activityScene.setActivityType('break');
                        } else {
                            activities = ['Waiting for patients'];
                            activityScene.setActivityType('waiting');
                        }
                    }
                }
            });
        });
    }

    updateStaffStatus(staffId, status) {
        const headerElement = document.querySelector(`#${staffId}-canvas`).previousElementSibling;
        const statusElement = headerElement.querySelector('.status');
        
        if (status === 'available') {
            statusElement.textContent = 'Available';
            statusElement.className = 'status available';
        } else if (status === 'busy' || status === 'assisting') {
            statusElement.textContent = 'Busy';
            statusElement.className = 'status busy';
        } else if (status === 'on break') {
            statusElement.textContent = 'On Break';
            statusElement.className = 'status';
        }
    }
}

// Activity Scene Class to handle visualizations
class ActivityScene {
    constructor(sketch, staff) {
        this.sketch = sketch;
        this.staff = staff;
        this.activityType = 'waiting';
        this.patientDetails = null;
        this.progress = 0;
        this.targetProgress = 0;
        this.animations = [];
        
        // Defines particle systems for various activities
        this.particles = [];
        this.maxParticles = 20;
    }
    
    setActivityType(type) {
        this.activityType = type;
        this.progress = 0;
        this.particles = [];
        
        if (type === 'treating' || type === 'assisting') {
            // Create particles for treatment animation
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push(new Particle(this.sketch));
            }
        }
    }
    
    setPatientDetails(patient) {
        this.patientDetails = patient;
    }
    
    update() {
        // Update progress
        if (this.activityType === 'treating' || this.activityType === 'assisting') {
            if (this.staff.status === 'busy' || this.staff.status === 'assisting') {
                this.targetProgress = 100;
            } else {
                this.targetProgress = 0;
            }
        } else if (this.activityType === 'break') {
            if (this.staff.status === 'on break') {
                const timeRemaining = this.staff.busyUntil - Date.now();
                const totalTime = 5 * 60 * 1000; // 5 minutes in ms
                this.targetProgress = 100 - Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
            } else {
                this.targetProgress = 0;
            }
        } else {
            this.targetProgress = 0;
        }
        
        // Smooth progress animation
        this.progress += (this.targetProgress - this.progress) * 0.05;
        
        // Update particles
        this.particles.forEach(p => p.update());
    }
    
    display() {
        const s = this.sketch;
        const w = s.width;
        const h = s.height;
        
        // Draw main activity area (removed staff icon drawing)
        s.push();
        s.fill(255);
        s.stroke(200);
        s.rect(80, 30, w - 100, h - 60, 10);
        s.pop();
        
        // Draw activity based on type
        if (this.activityType === 'waiting') {
            this.drawWaitingActivity();
        } else if (this.activityType === 'treating') {
            this.drawTreatingActivity();
        } else if (this.activityType === 'assisting') {
            this.drawAssistingActivity();
        } else if (this.activityType === 'break') {
            this.drawBreakActivity();
        }
        
        // Draw progress bar if applicable
        if (this.progress > 0) {
            s.push();
            s.noStroke();
            s.fill(230);
            s.rect(100, h - 20, w - 140, 10, 5);
            s.fill(this.getProgressColor());
            s.rect(100, h - 20, (w - 140) * (this.progress / 100), 10, 5);
            s.pop();
        }
    }
    
    drawWaitingActivity() {
        const s = this.sketch;
        const w = s.width;
        const h = s.height;
        
        s.push();
        s.fill(70);
        s.textSize(14);
        s.text("Waiting for next patient", w/2 + 40, h/2);
        s.pop();
        
        // Draw a simple animation (clock or similar)
        let angle = (s.frameCount % 60) / 60 * s.TWO_PI;
        s.push();
        s.translate(w/2 + 40, h/2 - 30);
        s.noFill();
        s.stroke(100);
        s.ellipse(0, 0, 20, 20);
        s.stroke(50);
        s.line(0, 0, s.cos(angle) * 8, s.sin(angle) * 8);
        s.line(0, 0, s.cos(angle/12) * 6, s.sin(angle/12) * 6);
        s.pop();
    }
    
    drawTreatingActivity() {
        const s = this.sketch;
        const w = s.width;
        const h = s.height;
        
        if (!this.patientDetails) return;
        
        // Draw patient info
        s.push();
        s.fill(70);
        s.textSize(12);
        s.textAlign(s.CENTER, s.TOP);
        s.text(`Treating: ${this.patientDetails.name}`, w/2 + 40, 35);
        s.textSize(10);
        s.fill(100);
        s.text(`Condition: ${this.patientDetails.condition}`, w/2 + 40, 55);
        
        // Draw patient icon
        s.textSize(20);
        s.text(this.patientDetails.avatar, w/2 + 40, h/2 - 10);
        
        // Draw vitals
        s.textSize(8);
        s.textAlign(s.LEFT, s.CENTER);
        s.text(`HR: ${this.patientDetails.vitals.heartRate} BP: ${this.patientDetails.vitals.bloodPressure}`, w/2 - 30, h/2 + 20);
        s.text(`Temp: ${this.patientDetails.vitals.temperature}°C`, w/2 - 30, h/2 + 30);
        s.pop();
        
        // Draw treatment animation with particles
        if (this.staff.status === 'busy') {
            s.push();
            s.noStroke();
            this.particles.forEach(p => p.display());
            s.pop();
        }
    }
    
    drawAssistingActivity() {
        const s = this.sketch;
        const w = s.width;
        const h = s.height;
        
        s.push();
        s.fill(70);
        s.textSize(14);
        s.text("Assisting colleague", w/2 + 40, h/2 - 10);
        
        // Draw connecting lines animation
        s.stroke(100, 150, 255, 150);
        s.strokeWeight(2);
        let offset = s.sin(s.frameCount * 0.1) * 5;
        
        for (let i = 0; i < 3; i++) {
            let x = w/2 + 40 + i * 10 - 10;
            s.line(x - 20, h/2 + 20, x + offset, h/2 + 40 + i * 3);
        }
        s.pop();
        
        // Draw assistance animation with particles
        s.push();
        s.noStroke();
        this.particles.forEach(p => p.display());
        s.pop();
    }
    
    drawBreakActivity() {
        const s = this.sketch;
        const w = s.width;
        const h = s.height;
        
        s.push();
        s.fill(70);
        s.textSize(14);
        s.text("Taking a break", w/2 + 40, h/2);
        
        // Draw a coffee cup or rest icon
        s.textSize(20);
        s.text("☕", w/2 + 40, h/2 - 30);
        
        // Show time remaining if on break
        if (this.staff.status === 'on break') {
            const timeRemaining = Math.max(0, Math.ceil((this.staff.busyUntil - Date.now()) / 1000 / 60));
            s.textSize(10);
            s.fill(100);
            s.text(`${timeRemaining} min remaining`, w/2 + 40, h/2 + 20);
        }
        s.pop();
    }
    
    getProgressColor() {
        if (this.activityType === 'treating') {
            return this.sketch.color(74, 144, 226);
        } else if (this.activityType === 'assisting') {
            return this.sketch.color(155, 89, 182);
        } else if (this.activityType === 'break') {
            return this.sketch.color(230, 126, 34);
        }
        return this.sketch.color(52, 152, 219);
    }
}

// Particle class for animations
class Particle {
    constructor(sketch) {
        this.sketch = sketch;
        this.reset();
    }
    
    reset() {
        const s = this.sketch;
        const w = s.width;
        const h = s.height;
        
        this.x = w/2 + 40 + s.random(-30, 30);
        this.y = h/2 + s.random(-20, 20);
        this.size = s.random(3, 6);
        this.color = s.color(
            s.random(50, 150),
            s.random(150, 255),
            s.random(200, 255),
            s.random(100, 200)
        );
        this.speedX = s.random(-1, 1);
        this.speedY = s.random(-1, 1);
        this.life = s.random(20, 60);
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        
        if (this.life <= 0) {
            this.reset();
        }
    }
    
    display() {
        const s = this.sketch;
        s.fill(this.color);
        s.ellipse(this.x, this.y, this.size, this.size);
    }
}