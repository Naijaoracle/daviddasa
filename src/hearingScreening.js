let audioContext;
let oscillator;
let gainNode;
let currentFrequency = 0;
const testFrequencies = [125, 250, 500, 1000, 2000, 4000, 8000, 12000, 16000];
let chartData = {
  datasets: [
    {
      label: 'Heard',
      borderColor: '#2ecc71',
      backgroundColor: '#2ecc71',
      pointRadius: 8,
      pointHoverRadius: 10,
      pointStyle: 'circle',
      data: []
    },
    {
      label: 'Not Heard',
      borderColor: '#e74c3c',
      backgroundColor: '#e74c3c',
      pointRadius: 8,
      pointHoverRadius: 10,
      pointStyle: 'crossRot',
      data: []
    }
  ]
};
let chart;

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initChart();
  setupVolumeControl();
});

function initChart() {
  const ctx = document.getElementById('responseChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {
        x: {
          type: 'logarithmic',
          position: 'bottom',
          title: {
            display: true,
            text: 'Frequency (Hz)'
          },
          min: 20,
          max: 20000,
          ticks: {
            callback: function(value) {
              return value.toString();
            }
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          min: -0.5,
          max: 1.5,
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Hearing Test Results',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function setupVolumeControl() {
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
      if (gainNode) {
        gainNode.gain.value = this.value / 100;
      }
    });
  }
}

function initAudioContext() {
  if (audioContext) {
    audioContext.close();
  }
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    gainNode.gain.value = volumeSlider.value / 100;
  }
}

function startTest() {
  chartData.datasets[0].data = [];
  chartData.datasets[1].data = [];
  if (chart) {
    chart.update();
  }
  currentFrequency = 0;
  playNextFrequency();
}

function playNextFrequency() {
  if (currentFrequency < testFrequencies.length) {
    const frequency = testFrequencies[currentFrequency];
    document.getElementById('frequencyInput').value = frequency;
    playSound();
    // Stop sound after 2 seconds
    setTimeout(() => {
      stopSound();
    }, 2000);
  } else {
    alert('Test complete! You can now download your results.');
  }
}

function playSound() {
  stopSound();

  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  if (isNaN(frequency) || frequency < 20 || frequency > 20000) {
    alert('Please enter a valid frequency between 20 Hz and 20000 Hz.');
    return;
  }

  initAudioContext();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.start();
}

function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
  }
}

function answer(response) {
  stopSound();

  const frequency = testFrequencies[currentFrequency];
  
  if (response === 'Yes') {
    chartData.datasets[0].data.push({ x: frequency, y: 1 });
  } else {
    chartData.datasets[1].data.push({ x: frequency, y: 0 });
  }
  
  if (chart) {
    chart.update();
  }

  currentFrequency++;
  setTimeout(playNextFrequency, 1000); // Wait 1 second before playing next frequency
}

function downloadChart() {
  const canvas = document.getElementById('responseChart');
  
  // Create a white background
  const context = canvas.getContext('2d');
  const backgroundColor = context.fillStyle;
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Convert to image
  const dataUrl = canvas.toDataURL('image/png');
  
  // Restore original background
  context.fillStyle = backgroundColor;
  
  // Create download link
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  link.href = dataUrl;
  link.download = `hearing_test_results_${date}.png`;
  link.click();
}

function answerYes() {
  answer('Yes');
}

function answerNo() {
  answer('No');
  alert('It is recommended to consult with a healthcare professional about your hearing.');
}