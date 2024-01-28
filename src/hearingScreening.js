let audioContext;
let oscillator;
let chartData = {
  labels: [],
  datasets: [
    {
      label: 'Hearing Thresholds',
      borderColor: 'blue',
      backgroundColor: 'blue',
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: 'blue',
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

function adjustVolume(direction) {
  const volumeInput = document.getElementById('volumeInput');
  let currentVolume = parseFloat(volumeInput.value);

  if (isNaN(currentVolume)) {
    currentVolume = 0;
  }

  if (direction === '+') {
    currentVolume += 0.1;
  } else if (direction === '-') {
    currentVolume -= 0.1;
  }

  currentVolume = Math.max(0, Math.min(1, currentVolume)); // Ensure volume is between 0 and 1
  volumeInput.value = currentVolume.toFixed(1);
  oscillator.volume = currentVolume;
}

function answer(response) {
  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  chartData.labels.push(`${frequency} Hz`);
  chartData.datasets[0].data.push({ x: frequency, y: oscillator.volume * 100 });

  if (chart) {
    chart.update(); // Update the chart immediately after the user responds
  } else {
    chart = new Chart(document.getElementById('responseChart').getContext('2d'), {
      type: 'scatter',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          },
          y: {
            title: {
              display: true,
              text: 'Volume (%)'
            }
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
