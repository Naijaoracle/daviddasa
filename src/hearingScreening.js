let audioContext;
let oscillator;
let gainNode;
let chart;
const testFrequencies = [125, 250, 500, 1000, 2000, 4000, 8000, 16000];
let currentFrequencyIndex = 0;
const responses = {
    heard: [],
    notHeard: []
};

function initializeAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set initial volume
    const volumeSlider = document.getElementById('volumeSlider');
    gainNode.gain.value = volumeSlider.value / 100;
    
    // Update volume when slider changes
    volumeSlider.addEventListener('input', () => {
        gainNode.gain.value = volumeSlider.value / 100;
    });
}

function initializeChart() {
    const ctx = document.getElementById('responseChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Heard',
                    data: [],
                    backgroundColor: '#2ecc71',
                    pointStyle: 'circle',
                    pointRadius: 8
                },
                {
                    label: 'Not Heard',
                    data: [],
                    backgroundColor: '#e74c3c',
                    pointStyle: 'crossRot',
                    pointRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'logarithmic',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    },
                    min: 100,
                    max: 20000
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function startTest() {
    if (!audioContext) {
        initializeAudio();
        initializeChart();
    }
    
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('responseButtons').style.display = 'block';
    
    currentFrequencyIndex = 0;
    responses.heard = [];
    responses.notHeard = [];
    playCurrentFrequency();
}

function playCurrentFrequency() {
    const frequency = testFrequencies[currentFrequencyIndex];
    document.getElementById('frequencyInput').value = frequency;
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.start();
    
    // Stop after 2 seconds
    setTimeout(() => {
        oscillator.stop();
        oscillator = audioContext.createOscillator();
        oscillator.connect(gainNode);
    }, 2000);
}

function answer(response) {
    const frequency = testFrequencies[currentFrequencyIndex];
    
    if (response === 'Yes') {
        responses.heard.push({ x: frequency, y: 1 });
    } else {
        responses.notHeard.push({ x: frequency, y: 1 });
    }
    
    updateChart();
    
    currentFrequencyIndex++;
    if (currentFrequencyIndex < testFrequencies.length) {
        setTimeout(playCurrentFrequency, 1000);
    } else {
        document.getElementById('responseButtons').style.display = 'none';
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('startButton').textContent = 'Restart Test';
    }
}

function updateChart() {
    chart.data.datasets[0].data = responses.heard;
    chart.data.datasets[1].data = responses.notHeard;
    chart.update();
}

function downloadChart() {
    const link = document.createElement('a');
    link.download = 'hearing-test-results.png';
    link.href = document.getElementById('responseChart').toDataURL();
    link.click();
}

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
});

function answerYes() {
  answer('Yes');
}

function answerNo() {
  answer('No');
  alert('It is recommended to consult with a healthcare professional about your hearing.');
}