// Hospital Data Tracking and Visualization using Chart.js
class DataTracker {
    constructor() {
        this.stats = {
            patientsServed: 0,
            emergencyCases: 0,
            averageWaitTime: 0,
            staffUtilization: {
                'doctor1': 0,
                'doctor2': 0,
                'nurse1': 0,
                'nurse2': 0
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
        this.initializeCharts();
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
                    label: 'Utilization %',
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
                            text: 'Utilization %'
                        }
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

    updateStaffUtilization(staffId, busy) {
        this.stats.staffUtilization[staffId] = busy ? 100 : 0;
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
        this.charts.staffUtilization.data.datasets[0].data = [
            this.stats.staffUtilization.doctor1,
            this.stats.staffUtilization.doctor2,
            this.stats.staffUtilization.nurse1,
            this.stats.staffUtilization.nurse2
        ];
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