// Hospital Data Tracking and Visualization using Chart.js
class DataTracker {
    constructor() {
        this.stats = {
            totalPatients: 0,
            currentPatients: 0,
            waitingPatients: 0,
            treatedPatients: 0,
            patientsByType: {
                urgent: 0,
                stable: 0
            },
            patientsServed: 0,
            emergencyCases: 0,
            averageWaitTime: {
                urgent: 0,
                stable: 0
            },
            averageTreatmentTime: {
                urgent: 0,
                stable: 0
            },
            treatmentTimes: {
                urgent: [],
                stable: []
            },
            staffUtilization: {
                'doctor1': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'doctor2': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'doctor3': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'nurse1': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'nurse2': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'nurse3': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false }
            },
            conditionBreakdown: {},
            severityBreakdown: {
                urgent: 0,
                stable: 0
            },
            waitingTimes: {
                urgent: [],
                stable: []
            },
            hourlyPatients: Array(24).fill(0)
        };
        
        this.charts = {};
        this.dataPoints = {
            waitingTime: [],
            patientFlow: [],
            staffUtilization: [],
            patientConditions: []
        };
        
        this.isInitialized = false;
        this.lastUpdate = Date.now();
        // Throttling controls for chart updates
        this._lastChartsUpdate = 0;
        this._updateScheduled = false;
        this._minUpdateIntervalMs = 500;
        this.initializeCharts();
        
        // Start tracking time
        setInterval(() => this.updateUtilizationTime(), 1000); // Update every second
    }
    
    destroyCharts() {
        // Destroy all existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
        this.isInitialized = false;
    }
    
    initializeCharts() {
        if (this.isInitialized) {
            return; // Don't initialize if already initialized
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCharts());
        } else {
            this.setupCharts();
        }
    }

    setupCharts() {
        if (this.isInitialized) {
            return; // Don't setup if already initialized
        }
        
        // Destroy any existing charts first
        this.destroyCharts();
        
        // Initialize charts in the correct order
        this.initStaffUtilizationChart();    // Top left
        this.initPatientSeverityChart();     // Top right
        this.initWaitingTimeChart();         // Bottom left
        this.initConditionBreakdownChart();  // Bottom right
        
        this.isInitialized = true;
        this.startAutoUpdate();
    }
    
    initWaitingTimeChart() {
        const ctx = document.getElementById('waiting-time-chart').getContext('2d');
        this.charts.waitingTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(20).fill('').map((_, i) => `${i}m`),
                datasets: [
                    {
                        label: 'Urgent',
                        data: Array(20).fill(0),
                        borderColor: '#ff4444',
                        backgroundColor: 'rgba(255, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: 'Stable',
                        data: Array(20).fill(0),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        right: 50  // Add padding for legend
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Waiting Times',
                        position: 'left',
                        font: {
                            size: 14
                        },
                        padding: {
                            bottom: 10
                        }
                    },
                    legend: {
                        display: true,
                        position: 'right',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            boxWidth: 8,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + 'm';
                            }
                        },
                        min: 0,
                        suggestedMax: 10
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0,
                            maxTicksLimit: 10
                        }
                    }
                },
                animation: {
                    duration: 200,
                    easing: 'easeOutQuad'
                },
                elements: {
                    point: {
                        radius: 0
                    },
                    line: {
                        borderWidth: 2
                    }
                }
            }
        });
    }

    initPatientSeverityChart() {
        const ctx = document.getElementById('patient-severity-chart').getContext('2d');
        this.charts.severity = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Urgent', 'Stable'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#e74c3c', '#27ae60']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                },
                animation: { duration: 200 },
                responsiveAnimationDuration: 0
            }
        });
    }

    initStaffUtilizationChart() {
        const ctx = document.getElementById('staff-utilization-chart').getContext('2d');
        this.charts.staffUtilization = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'N. Davis', 'N. Wilson', 'N. Thompson'],
                datasets: [{
                    label: 'Utilization %',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Utilization %',
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: false  // Removed title to save space
                    },
                    legend: {
                        display: false
                    }
                },
                layout: {
                    padding: {
                        left: 2,
                        right: 2,
                        top: 2,
                        bottom: 2
                    }
                },
                animation: { duration: 200 },
                responsiveAnimationDuration: 0
            }
        });
    }

    initConditionBreakdownChart() {
        const ctx = document.getElementById('condition-chart').getContext('2d');
        this.charts.conditions = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Stomach Pain', 'Dizziness', 'Chest Pain', 'Joint Pain', 'Breathing Difficulty', 'High Fever', 'Severe Headache'],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#e74c3c',  // Red
                        '#f1c40f',  // Yellow
                        '#2ecc71',  // Green
                        '#9b59b6',  // Purple
                        '#34495e',  // Dark Blue
                        '#e67e22',  // Orange
                        '#3498db'   // Light Blue
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'start',
                        labels: {
                            boxWidth: 10,
                            padding: 8,
                            font: {
                                size: 9
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Conditions',
                        position: 'bottom',  // Moved title to bottom
                        font: {
                            size: 12
                        },
                        padding: {
                            bottom: 0
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 2,
                        right: 2,
                        top: 2,
                        bottom: 10  // Added padding for bottom title
                    }
                },
                animation: { duration: 200 },
                responsiveAnimationDuration: 0
            }
        });
    }

    updateStats(patient, event) {
        switch(event) {
            case 'arrival':
                // Track patient arrival
                this.stats.totalPatients++;
                this.stats.currentPatients++;
                this.stats.patientsByType[patient.severity]++;
                this.stats.waitingPatients++;
                
                // Update severity breakdown
                this.stats.severityBreakdown[patient.severity]++;
                
                // Update condition breakdown
                this.updateConditionBreakdown(patient.condition);
                
                // Initialize waiting time tracking
                if (!this.stats.waitingTimes[patient.severity]) {
                    this.stats.waitingTimes[patient.severity] = [];
                }
                
                // Initialize average wait time if not set
                if (!this.stats.averageWaitTime[patient.severity]) {
                    this.stats.averageWaitTime[patient.severity] = 0;
                }
                break;
                
            case 'waiting':
                // Update the current average wait time for this severity
                const currentWaitTime = patient.waitingTime;
                this.stats.averageWaitTime[patient.severity] = currentWaitTime;
                this.scheduleUpdate();
                break;
                
            case 'treatment-start':
                // Track treatment start
                this.stats.waitingPatients--;
                
                // Calculate and store waiting time
                const waitTime = (Date.now() - patient.addedTime) / 1000 / 60; // Convert to minutes
                this.stats.waitingTimes[patient.severity].push(waitTime);
                
                // Update average wait time for this severity
                const waitTimes = this.stats.waitingTimes[patient.severity];
                if (waitTimes && waitTimes.length > 0) {
                    const totalWaitTime = waitTimes.reduce((a, b) => a + b, 0);
                    this.stats.averageWaitTime[patient.severity] = totalWaitTime / waitTimes.length;
                    console.log(`Updated ${patient.severity} average wait time to: ${this.stats.averageWaitTime[patient.severity].toFixed(1)} minutes`);
                }
                break;
                
            case 'treatment-end':
                // Track treatment completion
                this.stats.currentPatients--;
                this.stats.treatedPatients++;
                this.stats.patientsByType[patient.severity]--;
                
                // Calculate and store treatment time
                const treatmentTime = (patient.treatmentEndTime - patient.treatmentStartTime) / 1000 / 60;
                this.stats.treatmentTimes[patient.severity].push(treatmentTime);
                
                // Update average treatment time
                const times = this.stats.treatmentTimes[patient.severity];
                this.stats.averageTreatmentTime[patient.severity] = 
                    times.reduce((a, b) => a + b, 0) / times.length;
                break;
        }
        
        // Schedule chart update with throttling
        this.scheduleUpdate();
    }

    updateConditionBreakdown(condition) {
        this.stats.conditionBreakdown[condition] = 
            (this.stats.conditionBreakdown[condition] || 0) + 1;
    }

    updateWaitingTime(patient) {
        const waitTime = (Date.now() - patient.addedTime) / 1000 / 60; // Convert to minutes
        this.stats.waitingTimes[patient.severity].push(waitTime);
        
        // Update average wait time for this severity
        const times = this.stats.waitingTimes[patient.severity];
        this.stats.averageWaitTime[patient.severity] = 
            times.reduce((a, b) => a + b, 0) / times.length;
    }

    updateUtilizationTime() {
        const now = Date.now();
        const timeDiff = (now - this.lastUpdate) / 1000; // Convert to seconds

        // Update total time and busy time for all staff
        Object.entries(this.stats.staffUtilization).forEach(([staffId, staff]) => {
            staff.totalTime += timeDiff;
            if (staff.currentStatus && staff.lastBusyStart) {
                staff.busyTime += timeDiff;
            }
        });

        this.lastUpdate = now;
        this.scheduleUpdate();
    }

    updateStaffUtilization(staffId, busy) {
        const staff = this.stats.staffUtilization[staffId];
        if (!staff) return;

        const now = Date.now();

        // If status is changing, update the metrics
        if (busy !== staff.currentStatus) {
            if (busy) {
                staff.lastBusyStart = now;
            } else if (staff.lastBusyStart) {
                // Add the time spent busy to total busy time
                const busyDuration = (now - staff.lastBusyStart) / 1000;
                staff.busyTime += busyDuration;
                staff.lastBusyStart = null;
            }
            staff.currentStatus = busy;
        }

        // Calculate and update utilization percentage dataset (chart update is throttled)
        const staffIndex = {
            'doctor1': 0,
            'doctor2': 1,
            'doctor3': 2,
            'nurse1': 3,
            'nurse2': 4,
            'nurse3': 5
        }[staffId];

        if (this.charts.staffUtilization && staffIndex !== undefined) {
            let currentBusyTime = staff.busyTime;
            if (staff.currentStatus && staff.lastBusyStart) {
                currentBusyTime += (now - staff.lastBusyStart) / 1000;
            }
            const utilizationPercentage = staff.totalTime > 0 
                ? (currentBusyTime / staff.totalTime) * 100 
                : 0;
            this.charts.staffUtilization.data.datasets[0].data[staffIndex] = Math.round(utilizationPercentage);
        }
        
        this.scheduleUpdate();
    }

    updateCharts() {
        if (!this.isInitialized) return;  // Skip updates if charts aren't ready
        
        // Update waiting time chart
        if (this.charts.waitingTime) {
            const urgentData = this.charts.waitingTime.data.datasets[0].data;
            const stableData = this.charts.waitingTime.data.datasets[1].data;
            
            // Get current average wait times
            const urgentWaitTime = this.stats.averageWaitTime.urgent || 0;
            const stableWaitTime = this.stats.averageWaitTime.stable || 0;
            
            // Shift old data points
            urgentData.shift();
            stableData.shift();
            
            // Add new data points
            urgentData.push(Number(urgentWaitTime.toFixed(1)));
            stableData.push(Number(stableWaitTime.toFixed(1)));
            
            // Calculate the maximum wait time for y-axis scaling
            const maxWaitTime = Math.max(
                ...urgentData.filter(v => v !== null && !isNaN(v)),
                ...stableData.filter(v => v !== null && !isNaN(v))
            );
            
            // Update y-axis max value with some headroom
            if (maxWaitTime > 0) {
                const suggestedMax = Math.ceil(maxWaitTime * 1.2); // Add 20% headroom
                this.charts.waitingTime.options.scales.y.suggestedMax = Math.max(10, suggestedMax);
            }
            
            // Force an immediate update of the chart
            this.charts.waitingTime.update('none');
        }
        
        // Update severity chart
        this.charts.severity.data.datasets[0].data = [
            this.stats.severityBreakdown.urgent,
            this.stats.severityBreakdown.stable
        ];
        this.charts.severity.update('none');
        
        // Update staff utilization chart
        const utilizationData = Object.values(this.stats.staffUtilization).map(staff => {
            let currentBusyTime = staff.busyTime;
            if (staff.currentStatus && staff.lastBusyStart) {
                currentBusyTime += (Date.now() - staff.lastBusyStart) / 1000;
            }
            return staff.totalTime > 0 ? (currentBusyTime / staff.totalTime) * 100 : 0;
        });
        
        this.charts.staffUtilization.data.datasets[0].data = utilizationData.map(Math.round);
        this.charts.staffUtilization.update('none');
        
        // Update condition breakdown chart
        const conditions = Object.keys(this.stats.conditionBreakdown);
        const conditionCounts = conditions.map(c => this.stats.conditionBreakdown[c]);
        this.charts.conditions.data.labels = conditions;
        this.charts.conditions.data.datasets[0].data = conditionCounts;
        this.charts.conditions.update('none');
        
        this._lastChartsUpdate = Date.now();
        this._updateScheduled = false;
    }

    startAutoUpdate() {
        setInterval(() => this.scheduleUpdate(), 5000); // Update every 5 seconds
    }

    // Schedule chart updates with throttling to avoid excessive redraws
    scheduleUpdate(force = false) {
        const now = Date.now();
        if (force || now - this._lastChartsUpdate >= this._minUpdateIntervalMs) {
            this.updateCharts();
            return;
        }
        if (this._updateScheduled) return;
        this._updateScheduled = true;
        const delay = this._minUpdateIntervalMs - (now - this._lastChartsUpdate);
        setTimeout(() => this.updateCharts(), Math.max(0, delay));
    }

    // Batch setter to update average waiting times and schedule one chart refresh
    setAverageWaitTimes(urgentAvg, stableAvg) {
        if (typeof urgentAvg === 'number') this.stats.averageWaitTime.urgent = urgentAvg;
        if (typeof stableAvg === 'number') this.stats.averageWaitTime.stable = stableAvg;
        this.scheduleUpdate();
    }
}