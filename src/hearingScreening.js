let audioContext;
let oscillator;
let chartData = {
  labels: ['20', '50', '100', '200', '500', '1000', '2000', '5000', '7500', '10000', '15000', '20000'],
  datasets: [
    {
      label: 'Heard',
      borderColor: 'blue',
      backgroundColor: 'blue',
      pointRadius: 8,
      pointHoverRadius: 10,
      data: []
    },
    {
      label: 'Not Heard',
      borderColor: 'red',
      backgroundColor: 'red',
      pointRadius: 8,
      pointHoverRadius: 10,
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

  chartData.labels.push(frequency.toString());
  if (response === 'Yes') {
    chartData.datasets[0].data.push({ x: 0, y: frequency });
    chartData.datasets[1].data.push({ x: frequency, y: 0 }); // Change here
  } else {
    chartData.datasets[0].data.push({ x: frequency, y: 0 }); // Change here
    chartData.datasets[1].data.push({ x: 0, y: frequency });
  }

  if (chart) {
    chart.update(); // Update the chart immediately after the user responds
  } else {
    chart = new Chart(document.getElementById('responseChart').getContext('2d'), {
      type: 'scatter',
      data: chartData,
      options: {
        scales: {
          x: {
            display: false // Hide the x-axis
          },
          y: {
            type: 'logarithmic',
            position: 'left',
            title: {
              display: true,
              text: 'Frequency (Hz)'
            },
            ticks: {
              userCallback: function (value, index, values) {
                return value.toString();
              }
            }
          }
        },
        elements: {
          point: {
            hitRadius: 5,
            hoverRadius: 5
          }
        },
        responsive: false, // Keep the chart size fixed
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }
}

function downloadChart() {
  const canvas = document.getElementById('responseChart');
  const ctx = canvas.getContext('2d');

  // Save current state
  const prevFillStyle = ctx.fillStyle;

  // Set background color to white
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Restore previous state
  ctx.fillStyle = prevFillStyle;

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'hearing_response_chart.png';
  link.click();
}

function answerYes() {
  answer('Yes');
}

function answerNo() {
  answer('No');
  alert('It is recommended to consult with a healthcare professional about your hearing.');
}