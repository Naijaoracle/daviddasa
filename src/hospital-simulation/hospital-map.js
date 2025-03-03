// Hospital Map using Phaser.js
class HospitalMap {
    constructor(staffMembers, resources) {
        this.staffMembers = staffMembers;
        this.resources = resources;
        this.game = null;
        this.sprites = {};
        this.labels = {};
        this.paths = {};
        this.initializeMap();
    }

    initializeMap() {
        // Configure Phaser game
        const config = {
            type: Phaser.AUTO,
            parent: 'hospital-map',
            width: 800,
            height: 300,
            backgroundColor: '#f8f9fa',
            scene: {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            canvas: {
                willReadFrequently: true
            }
        };

        // Initialize Phaser game instance
        this.game = new Phaser.Game(config);
    }

    preload() {
        // This method is automatically called by Phaser for preloading assets
        const scene = this.game.scene.scenes[0];
        
        // Load tilemap for hospital layout
        // Since we're not loading external assets, we'll create everything in the create method
    }

    create() {
        const scene = this.game.scene.scenes[0];
        
        // Create hospital layout
        this.createHospitalLayout(scene);
        
        // Create staff sprites
        this.createStaffSprites(scene);
        
        // Create interaction zones
        this.createInteractionAreas(scene);
    }

    createHospitalLayout(scene) {
        // Draw background
        const graphics = scene.add.graphics();
        
        // Room colors
        const colors = {
            waitingRoom: 0xd4edda,
            treatmentBay: 0xe8f4fd,
            nurseStation: 0xfff3cd,
            doctorOffice: 0xd1ecf1,
            restArea: 0xf5f5f5
        };
        
        // Draw waiting room with grid
        graphics.fillStyle(colors.waitingRoom, 1);
        graphics.fillRect(20, 50, 180, 200);
        
        // Draw waiting room grid
        graphics.lineStyle(1, 0xaaaaaa, 0.5);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                graphics.strokeRect(35 + i * 50, 65 + j * 45, 45, 40);
            }
        }
        
        // Draw treatment bays
        for (let i = 0; i < 4; i++) {
            const x = 250 + (i % 2) * 160;
            const y = 50 + Math.floor(i / 2) * 110;
            graphics.fillStyle(colors.treatmentBay, 1);
            graphics.fillRect(x, y, 150, 100);
            
            // Bay borders
            graphics.lineStyle(2, 0x4a90e2, 1);
            graphics.strokeRect(x, y, 150, 100);
        }
        
        // Staff area dimensions
        const officeWidth = 100;
        const officeHeight = 80;
        const staffAreaStartX = 570;
        const staffAreaStartY = 50;
        
        // Draw nurse office (left)
        graphics.fillStyle(colors.nurseStation, 1);
        graphics.fillRect(staffAreaStartX, staffAreaStartY, officeWidth, officeHeight);
        
        // Draw doctor office (right)
        graphics.fillStyle(colors.doctorOffice, 1);
        graphics.fillRect(staffAreaStartX + officeWidth + 10, staffAreaStartY, officeWidth, officeHeight);
        
        // Draw large rest area below offices
        graphics.fillStyle(colors.restArea, 1);
        graphics.fillRect(staffAreaStartX, staffAreaStartY + officeHeight + 10, 
                         officeWidth * 2 + 10, // Width of both offices plus gap
                         120); // Taller than offices
        
        // Add room labels
        this.addRoomLabel(scene, 110, 40, 'Waiting Room');
        this.addRoomLabel(scene, 325, 40, 'Treatment Bay 1');
        this.addRoomLabel(scene, 485, 40, 'Treatment Bay 2');
        this.addRoomLabel(scene, 325, 150, 'Treatment Bay 3');
        this.addRoomLabel(scene, 485, 150, 'Treatment Bay 4');
        this.addRoomLabel(scene, staffAreaStartX + officeWidth/2, staffAreaStartY - 10, 'Nurse Office');
        this.addRoomLabel(scene, staffAreaStartX + officeWidth*1.5 + 10, staffAreaStartY - 10, 'Doctor Office');
        this.addRoomLabel(scene, staffAreaStartX + officeWidth + 5, staffAreaStartY + officeHeight + 60, 'Rest Area');
        
        // Add corridors
        graphics.fillStyle(0xf8f9fa, 1);
        graphics.fillRect(200, 100, 50, 100); // Corridor to waiting room
        
        // Draw corridor lines
        graphics.lineStyle(1, 0xcccccc, 1);
        graphics.beginPath();
        graphics.moveTo(200, 150);
        graphics.lineTo(800, 150);
        graphics.stroke();
        graphics.beginPath();
        graphics.moveTo(570, 100);
        graphics.lineTo(570, 250);
        graphics.stroke();
    }
    
    addRoomLabel(scene, x, y, text) {
        const label = scene.add.text(x, y, text, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#333333'
        });
        label.setOrigin(0.5, 0.5);
    }
    
    createStaffSprites(scene) {
        // Create sprites for each staff member
        this.staffMembers.forEach(staff => {
            // Create sprite based on staff role
            const initialPosition = this.getStaffInitialPosition(staff);
            
            // Create staff sprite
            const sprite = scene.add.text(initialPosition.x, initialPosition.y, staff.icon, {
                fontSize: '20px'
            });
            sprite.setOrigin(0.5, 0.5);
            
            // Make sprite draggable
            sprite.setInteractive();
            scene.input.setDraggable(sprite);
            
            // Add staff name label
            const nameLabel = scene.add.text(initialPosition.x, initialPosition.y + 15, staff.name.split(' ')[1], {
                fontSize: '10px',
                fontFamily: 'Arial',
                color: '#333333'
            });
            nameLabel.setOrigin(0.5, 0.5);
            
            // Store references to sprites and labels
            this.sprites[staff.id] = sprite;
            this.labels[staff.id] = nameLabel;
            
            // Initialize paths
            this.paths[staff.id] = {
                target: null,
                active: false,
                timeline: null
            };
        });
        
        // Set up dragging behavior
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            
            // Update corresponding label position
            const staffId = Object.keys(this.sprites).find(key => this.sprites[key] === gameObject);
            if (staffId && this.labels[staffId]) {
                this.labels[staffId].x = dragX;
                this.labels[staffId].y = dragY + 15;
            }
        });
    }
    
    getStaffInitialPosition(staff) {
        // Different initial positions based on staff role and ID
        if (staff.role === 'doctor') {
            if (staff.id === 'doctor1') {
                return { x: 590 + Math.random() * 60, y: 180 + Math.random() * 30 };
            } else {
                return { x: 590 + Math.random() * 60, y: 180 + Math.random() * 30 };
            }
        } else { // nurse
            if (staff.id === 'nurse1') {
                return { x: 620 + Math.random() * 60, y: 70 + Math.random() * 30 };
            } else {
                return { x: 620 + Math.random() * 60, y: 70 + Math.random() * 30 };
            }
        }
    }
    
    createInteractionAreas(scene) {
        // Create interactive zones for treatment bays, waiting room, etc.
        
        // Waiting room grid zones
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                this.createInteractionZone(scene, 35 + i * 50, 65 + j * 45, 45, 40, `waiting_${i}_${j}`);
            }
        }
        
        // Treatment bays
        this.createInteractionZone(scene, 250, 50, 150, 100, 'bay1');
        this.createInteractionZone(scene, 410, 50, 150, 100, 'bay2');
        this.createInteractionZone(scene, 250, 160, 150, 100, 'bay3');
        this.createInteractionZone(scene, 410, 160, 150, 100, 'bay4');
        
        // Staff areas
        this.createInteractionZone(scene, 570, 50, 210, 80, 'nurseStation');
        this.createInteractionZone(scene, 570, 140, 100, 110, 'doctorOffice');
        this.createInteractionZone(scene, 680, 140, 100, 110, 'restArea');
    }
    
    createInteractionZone(scene, x, y, width, height, name) {
        const zone = scene.add.zone(x + width/2, y + height/2, width, height);
        zone.setInteractive();
        zone.setName(name);
        zone.input.dropZone = true;
        
        // Highlight on hover
        zone.on('pointerover', () => {
            const graphics = scene.add.graphics();
            graphics.lineStyle(2, 0x4a90e2, 1);
            graphics.strokeRect(x, y, width, height);
            zone.graphics = graphics;
        });
        
        zone.on('pointerout', () => {
            if (zone.graphics) {
                zone.graphics.destroy();
                zone.graphics = null;
            }
        });
        
        // Handle staff drop on zone
        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            if (dropZone === zone) {
                const staffId = Object.keys(this.sprites).find(key => this.sprites[key] === gameObject);
                if (staffId) {
                    const staff = this.staffMembers.find(s => s.id === staffId);
                    if (staff) {
                        // Update staff location
                        staff.location = name;
                        staff.addActivity(`Moved to ${this.getLocationName(name)}`);
                        
                        // Trigger any special location actions
                        this.handleLocationAction(staff, name);
                    }
                }
            }
        });
    }
    
    getLocationName(locationId) {
        const names = {
            'waitingRoom': 'Waiting Room',
            'bay1': 'Treatment Bay 1',
            'bay2': 'Treatment Bay 2',
            'bay3': 'Treatment Bay 3',
            'bay4': 'Treatment Bay 4',
            'nurseStation': 'Nurse Station',
            'doctorOffice': 'Doctor Office',
            'lab': 'Laboratory',
            'restArea': 'Rest Area'
        };
        
        return names[locationId] || locationId;
    }
    
    handleLocationAction(staff, location) {
        // Special actions when staff enters a location
        if (location === 'restArea' && staff.status === 'available') {
            staff.takeBreak();
        } else if (location === 'lab') {
            staff.addActivity('Working in the laboratory');
        }
    }
    
    update() {
        const scene = this.game.scene.scenes[0];
        
        // Update staff sprites based on their current location and status
        this.staffMembers.forEach(staff => {
            const sprite = this.sprites[staff.id];
            const label = this.labels[staff.id];
            
            if (sprite && label) {
                // Update sprite appearance based on status
                if (staff.status === 'busy') {
                    sprite.setTint(0xffaa00);
                } else if (staff.status === 'assisting') {
                    sprite.setTint(0xaa00ff);
                } else if (staff.status === 'on break') {
                    sprite.setTint(0x999999);
                } else {
                    sprite.clearTint();
                }
                
                // Animate staff movement if needed
                if (staff.currentPatient && !this.paths[staff.id].active) {
                    if (staff.currentPatient.treatingBay) {
                        const bayNumber = parseInt(staff.currentPatient.treatingBay.replace('bay', ''));
                        const targetX = 250 + ((bayNumber - 1) % 2) * 160 + 75;
                        const targetY = 50 + Math.floor((bayNumber - 1) / 2) * 110 + 50;
                        
                        this.moveStaffTo(scene, staff.id, targetX, targetY);
                    }
                }
                
                // Update label position to follow sprite
                label.x = sprite.x;
                label.y = sprite.y + 15;
            }
        });
    }
    
    moveStaffTo(scene, staffId, targetX, targetY) {
        const sprite = this.sprites[staffId];
        const path = this.paths[staffId];
        
        if (sprite && !path.active) {
            path.active = true;
            
            // Create a timeline for movement
            path.timeline = scene.tweens.createTimeline();
            
            // Add movement tween
            path.timeline.add({
                targets: sprite,
                x: targetX,
                y: targetY,
                ease: 'Power1',
                duration: 1000,
                onComplete: () => {
                    path.active = false;
                }
            });
            
            // Start the timeline
            path.timeline.play();
        }
    }
    
    moveStaffToLocation(staffId, location) {
        const scene = this.game.scene.scenes[0];
        const sprite = this.sprites[staffId];
        const label = this.labels[staffId];
        
        if (!sprite || !label) return;
        
        let targetX, targetY;
        
        switch(location) {
            case 'bay1':
                targetX = 325;
                targetY = 100;
                break;
            case 'bay2':
                targetX = 485;
                targetY = 100;
                break;
            case 'bay3':
                targetX = 325;
                targetY = 210;
                break;
            case 'bay4':
                targetX = 485;
                targetY = 210;
                break;
            case 'nurseStation':
                targetX = 620 + Math.random() * 60;
                targetY = 70 + Math.random() * 30;
                break;
            case 'doctorOffice':
                targetX = 590 + Math.random() * 60;
                targetY = 180 + Math.random() * 30;
                break;
            case 'restArea':
                targetX = 700 + Math.random() * 60;
                targetY = 180 + Math.random() * 30;
                break;
            default:
                return;
        }
        
        this.moveStaffTo(scene, staffId, targetX, targetY);
    }
}