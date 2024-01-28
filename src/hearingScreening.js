let audioContext;
let oscillator;
let chartData = {
  labels: [],
  datasets: [
    {
      label: 'Yes',
      borderColor: 'blue',
      backgroundColor: 'blue',
      data: []
    },
    {
      label: 'No',
      borderColor: 'red',
      backgroundColor: 'red',
      data: []
    }
  ]
};
let chart;

function initAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
}

function playSound() {
  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  if (isNaN(frequency)) {
    alert('Please enter a valid frequency.');
    return;
  }

  initAudioContext();

  oscillator.type = 'sine'; // Change the waveform here if needed
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
}

function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
  }
}

function answer(response) {
  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  chartData.labels.push(`${frequency} Hz`);
  if (response === 'Yes') {
    chartData.datasets[0].data.push(frequency);
    chartData.datasets[1].data.push(null);
  } else {
    chartData.datasets[0].data.push(null);
    chartData.datasets[1].data.push(frequency);
  }

  if (chart) {
    chart.update(); // Update the chart immediately after the user responds
  } else {
    chart = new Chart(document.getElementById('responseChart').getContext('2d'), {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'linear',
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
