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
                    backgroundColor: '#ff0000',
                    pointStyle: 'crossRot',
                    pointRadius: 10,
                    borderColor: '#ff0000',
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'logarithmic',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    },
                    min: 100,
                    max: 20000
                },
                x: {
                    display: false,
                    min: -0.5,
                    max: 1.5
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
        responses.heard.push({ y: frequency, x: 1 });
    } else {
        responses.notHeard.push({ y: frequency, x: 1 });
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
    const canvas = document.getElementById('responseChart');
    const context = canvas.getContext('2d');
    
    // Save the current state
    context.save();
    
    // Store the current chart image
    const chartImage = canvas.toDataURL();
    
    // Create a new canvas with white background
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = canvas.width;
    downloadCanvas.height = canvas.height;
    const downloadContext = downloadCanvas.getContext('2d');
    
    // Fill white background
    downloadContext.fillStyle = 'white';
    downloadContext.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    
    // Draw the chart on top
    const img = new Image();
    img.onload = function() {
        downloadContext.drawImage(img, 0, 0);
        // Create download link
        const link = document.createElement('a');
        link.download = 'hearing-test-results.png';
        link.href = downloadCanvas.toDataURL('image/png');
        link.click();
    };
    img.src = chartImage;
    
    // Restore the original state
    context.restore();
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