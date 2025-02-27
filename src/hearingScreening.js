let audioContext;
let oscillator;
let chartData = {
  labels: [],
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

function initAudioContext() {
  if (audioContext) {
    audioContext.close();
  }
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
  oscillator.connect(audioContext.destination);
}

function playSound() {
  stopSound(); // Stop the sound if already playing

  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  if (isNaN(frequency)) {
    alert('Please enter a valid frequency.');
    return;
  }

  initAudioContext();

  oscillator.type = 'sine'; // Change the waveform here if needed
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
  stopSound(); // Stop the sound when answering

  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  if (isNaN(frequency) || frequency < 20 || frequency > 20000) {
    alert('Please enter a valid frequency between 20 Hz and 20000 Hz.');
    return;
  }

  // Add the frequency to the data
  if (response === 'Yes') {
    chartData.datasets[0].data.push({ x: frequency, y: 1 });
  } else {
    chartData.datasets[1].data.push({ x: frequency, y: 0 });
  }
  
  if (chart) {
    chart.update();
  } else {
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
              size: 16
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