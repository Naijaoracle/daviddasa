// Hospital Data Tracking and Visualization using Chart.js
class DataTracker {
    constructor() {
        this.stats = {
            patientsServed: 0,
            emergencyCases: 0,
            averageWaitTime: 0,
            staffUtilization: {
                'doctor1': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'doctor2': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'nurse1': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false },
                'nurse2': { busyTime: 0, totalTime: 0, lastBusyStart: null, currentStatus: false }
            },
            conditionBreakdown: {},
            severityBreakdown: {
                urgent: 0,
                stable: 0
            },
            waitingTimes: [],
            hourlyPatients: Array(24).fill(0),
            treatmentTimes: []
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
        
        this.initWaitingTimeChart();
        this.initPatientSeverityChart();
        this.initStaffUtilizationChart();
        this.initConditionBreakdownChart();
        this.isInitialized = true;
        this.startAutoUpdate();
    }
    
    initWaitingTimeChart() {
        const ctx = document.getElementById('waiting-time-chart').getContext('2d');
        this.charts.waitingTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(10).fill('').map((_, i) => `${i*5}m ago`),
                datasets: [{
                    label: 'Average Waiting Time (minutes)',
                    data: Array(10).fill(0),
                    fill: false,
                    borderColor: '#4a90e2',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
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
                maintainAspectRatio: false
            }
        });
    }

    initStaffUtilizationChart() {
        const ctx = document.getElementById('staff-utilization-chart').getContext('2d');
        this.charts.staffUtilization = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dr. Smith', 'Dr. Johnson', 'Nurse Davis', 'Nurse Wilson'],
                datasets: [{
                    label: 'Staff Utilization',
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#3498db', '#3498db', '#2ecc71', '#2ecc71']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Time Spent Treating Patients (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = Math.round(context.raw);
                                return `Utilization: ${value}% of total time`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 500
                }
            }
        });
    }

    initConditionBreakdownChart() {
        const ctx = document.getElementById('condition-chart').getContext('2d');
        this.charts.conditions = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#e74c3c', '#3498db', '#f1c40f', '#2ecc71',
                        '#9b59b6', '#e67e22', '#1abc9c', '#34495e'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    updateStats(patient, action) {
        switch(action) {
            case 'arrival':
                this.stats.hourlyPatients[new Date().getHours()]++;
                this.stats.severityBreakdown[patient.severity]++;
                this.updateConditionBreakdown(patient.condition);
                break;
                
            case 'treatment-start':
                this.stats.patientsServed++;
                if (patient.severity === 'urgent') {
                    this.stats.emergencyCases++;
                }
                this.updateWaitingTime(patient.waitingTime);
                break;
                
            case 'treatment-end':
                this.stats.treatmentTimes.push(patient.treatmentTime);
                break;
        }
        
        this.updateCharts();
    }

    updateConditionBreakdown(condition) {
        this.stats.conditionBreakdown[condition] = 
            (this.stats.conditionBreakdown[condition] || 0) + 1;
    }

    updateWaitingTime(time) {
        this.stats.waitingTimes.push(time);
        this.stats.averageWaitTime = 
            this.stats.waitingTimes.reduce((a, b) => a + b, 0) / this.stats.waitingTimes.length;
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
        this.updateCharts();
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

        // Calculate and update utilization percentage
        const staffIndex = {
            'doctor1': 0,
            'doctor2': 1,
            'nurse1': 2,
            'nurse2': 3
        }[staffId];

        if (this.charts.staffUtilization && staffIndex !== undefined) {
            // Calculate current utilization including ongoing busy time
            let currentBusyTime = staff.busyTime;
            if (staff.currentStatus && staff.lastBusyStart) {
                currentBusyTime += (now - staff.lastBusyStart) / 1000;
            }

            const utilizationPercentage = staff.totalTime > 0 
                ? (currentBusyTime / staff.totalTime) * 100 
                : 0;
            
            this.charts.staffUtilization.data.datasets[0].data[staffIndex] = Math.round(utilizationPercentage);
            this.charts.staffUtilization.update('none');
        }
    }

    updateCharts() {
        if (!this.isInitialized) return;  // Skip updates if charts aren't ready

        // Update waiting time chart
        this.charts.waitingTime.data.datasets[0].data.shift();
        this.charts.waitingTime.data.datasets[0].data.push(this.stats.averageWaitTime);
        this.charts.waitingTime.update();

        // Update severity chart
        this.charts.severity.data.datasets[0].data = [
            this.stats.severityBreakdown.urgent,
            this.stats.severityBreakdown.stable
        ];
        this.charts.severity.update();

        // Update staff utilization chart
        const utilizationData = Object.values(this.stats.staffUtilization).map(staff => {
            let currentBusyTime = staff.busyTime;
            if (staff.currentStatus && staff.lastBusyStart) {
                currentBusyTime += (Date.now() - staff.lastBusyStart) / 1000;
            }
            return staff.totalTime > 0 ? (currentBusyTime / staff.totalTime) * 100 : 0;
        });
        
        this.charts.staffUtilization.data.datasets[0].data = utilizationData.map(Math.round);
        this.charts.staffUtilization.update();

        // Update condition breakdown chart
        const conditions = Object.keys(this.stats.conditionBreakdown);
        const conditionCounts = conditions.map(c => this.stats.conditionBreakdown[c]);
        this.charts.conditions.data.labels = conditions;
        this.charts.conditions.data.datasets[0].data = conditionCounts;
        this.charts.conditions.update();
    }

    startAutoUpdate() {
        setInterval(() => this.updateCharts(), 5000); // Update every 5 seconds
    }
}