let audioContext;
let oscillator;

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

  oscillator.type = 'sine'; // Change the waveform if needed
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
  }, 10000); // Play the sound for 10 seconds
}

function answerYes() {
  alert('Great! Your hearing seems fine.');
}

function answerNo() {
  alert('It is recommended to consult with a healthcare professional about your hearing.');
}