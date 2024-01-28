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
  const middleX = 10010; // Middle of the x-axis range
  
  if (response === 'Yes') {
    chartData.datasets[0].data.push({ x: middleX, y: frequency });
    chartData.datasets[1].data.push({ x: frequency, y: middleX });
  } else {
    chartData.datasets[0].data.push({ x: frequency, y: middleX });
    chartData.datasets[1].data.push({ x: middleX, y: frequency });
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
            type: 'linear', // Change the x-axis type to linear
            position: 'bottom', 
            title: {
              display: false,
            },
            ticks: {
              userCallback: function (value, index, values) {
                return value.toString();
              }
            }
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