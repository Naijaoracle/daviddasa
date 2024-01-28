let audioContext;
let oscillator;
let gainNode; // Added GainNode
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
  gainNode = audioContext.createGain(); // Create GainNode
  oscillator.connect(gainNode); // Connect oscillator to gainNode
  gainNode.connect(audioContext.destination); // Connect gainNode to destination
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
  gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Set gain to 1 (full volume)
  oscillator.start();
}

function stopSound() {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
  }
}

function adjustVolume(direction) {
  stopSound(); // Stop the sound if currently playing

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

  if (oscillator) {
    // Set gain to the updated volume
    gainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);
    oscillator.start();
  }

  // Calculate the volume as a fraction of 120
  const volumeFraction = (currentVolume * 120).toFixed(1);

  // Display the current volume as a fraction
  document.getElementById('currentVolume').innerText = `${volumeFraction} / 120`;
}

function answer(response) {
  stopSound(); // Stop the sound when answering

  const frequencyInput = document.getElementById('frequencyInput');
  const frequency = parseFloat(frequencyInput.value);

  chartData.labels.push(frequency.toString());
  if (response === 'Yes') {
    chartData.datasets[0].data.push({ x: frequency, y: 120 - oscillator.volume * 120 });
    chartData.datasets[1].data.push(null);
  } else {
    chartData.datasets[0].data.push(null);
    chartData.datasets[1].data.push({ x: frequency, y: 120 - oscillator.volume * 120 });
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
            type: 'logarithmic',
            position: 'bottom',
            title: {
              display: true,
              text: 'Frequency (Hz)'
            },
            ticks: {
              userCallback: function (value, index, values) {
                return value.toString();
              }
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 120,
            title: {
              display: true,
              text: 'Volume (dB)'
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
