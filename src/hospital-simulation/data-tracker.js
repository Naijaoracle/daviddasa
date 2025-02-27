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
                    label: 'Average Wait Time',
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
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Waiting Time'
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
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initStaffUtilizationChart() {
        const ctx = document.getElementById('staff-utilization-chart').getContext('2d');
        this.charts.staffUtilization = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Nurse Davis', 'Nurse Wilson', 'Nurse Thompson'],
                datasets: [{
                    label: 'Staff Utilization Rate',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
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
                            text: 'Utilization Rate (%)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Staff Utilization Rates'
                    },
                    legend: {
                        display: false
                    }
                }
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
                        position: 'right'
                    }
                }
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