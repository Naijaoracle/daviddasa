/**
 * Hearing Frequency Screening Test
 * An interactive tool to test hearing across different frequencies
 */

let audioContext;
let gainNode;
let chart;
const testFrequencies = [125, 250, 500, 1000, 2000, 4000, 8000, 16000];
let currentFrequencyIndex = 0;
let isPlaying = false;
let currentOscillator = null;

const responses = {
    heard: [],
    notHeard: []
};

// Frequency range labels for results interpretation
const frequencyRanges = {
    low: { min: 125, max: 500, label: 'Low frequencies (bass sounds)' },
    speech: { min: 500, max: 2000, label: 'Speech frequencies' },
    high: { min: 2000, max: 16000, label: 'High frequencies' }
};

function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        
        // Set initial volume
        const volumeSlider = document.getElementById('volumeSlider');
        gainNode.gain.value = volumeSlider.value / 100;
        
        // Update volume when slider changes
        volumeSlider.addEventListener('input', () => {
            gainNode.gain.value = volumeSlider.value / 100;
        });
        
        return true;
    } catch (error) {
        console.error('Audio initialization failed:', error);
        showMessage('Audio not supported in this browser. Please try Chrome or Firefox.', 'error');
        return false;
    }
}

function initializeChart() {
    const ctx = document.getElementById('responseChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Heard ✓',
                    data: [],
                    backgroundColor: '#2ecc71',
                    pointStyle: 'circle',
                    pointRadius: 12,
                    borderColor: '#27ae60',
                    borderWidth: 2
                },
                {
                    label: 'Not Heard ✗',
                    data: [],
                    backgroundColor: '#e74c3c',
                    pointStyle: 'crossRot',
                    pointRadius: 12,
                    borderColor: '#c0392b',
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
                        text: 'Frequency (Hz)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#333'
                    },
                    min: 100,
                    max: 20000,
                    ticks: {
                        callback: function(value) {
                            const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000, 16000];
                            if (frequencies.includes(value)) {
                                return value >= 1000 ? (value/1000) + 'k' : value;
                            }
                            return null;
                        },
                        font: { size: 12 },
                        padding: 10,
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    }
                },
                x: {
                    display: false,
                    min: 0,
                    max: 2
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 14, weight: '500' },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const freq = context.parsed.y;
                            const status = context.dataset.label.includes('Heard') ? 'Heard' : 'Not heard';
                            return `${freq} Hz - ${status}`;
                        }
                    }
                }
            },
            layout: {
                padding: { left: 15, right: 15, top: 15, bottom: 15 }
            }
        }
    });
}

function updateProgressIndicator() {
    const progressContainer = document.getElementById('progressIndicator');
    if (!progressContainer) return;
    
    const progress = ((currentFrequencyIndex) / testFrequencies.length) * 100;
    const progressBar = progressContainer.querySelector('.progress-bar');
    const progressText = progressContainer.querySelector('.progress-text');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `${currentFrequencyIndex} of ${testFrequencies.length} frequencies tested`;
    }
}

function showPlayingIndicator(show) {
    const indicator = document.getElementById('playingIndicator');
    if (indicator) {
        indicator.style.display = show ? 'flex' : 'none';
    }
    
    // Add pulse animation to frequency display
    const freqDisplay = document.querySelector('.frequency-display');
    if (freqDisplay) {
        if (show) {
            freqDisplay.classList.add('playing');
        } else {
            freqDisplay.classList.remove('playing');
        }
    }
}

function playTone(frequency, duration = 2000) {
    return new Promise((resolve) => {
        if (!audioContext) {
            resolve();
            return;
        }
        
        // Resume audio context if suspended (required by browsers)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Create new oscillator for this tone
        currentOscillator = audioContext.createOscillator();
        currentOscillator.type = 'sine';
        currentOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        currentOscillator.connect(gainNode);
        
        isPlaying = true;
        showPlayingIndicator(true);
        currentOscillator.start();
        
        // Stop after duration
        setTimeout(() => {
            if (currentOscillator) {
                currentOscillator.stop();
                currentOscillator.disconnect();
                currentOscillator = null;
            }
            isPlaying = false;
            showPlayingIndicator(false);
            
            // Play end beep
            playEndBeep().then(resolve);
        }, duration);
    });
}

function playEndBeep() {
    return new Promise((resolve) => {
        if (!audioContext) {
            resolve();
            return;
        }
        
        const beepOscillator = audioContext.createOscillator();
        const beepGain = audioContext.createGain();
        
        beepOscillator.type = 'sine';
        beepOscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        beepGain.gain.setValueAtTime(gainNode.gain.value * 0.3, audioContext.currentTime);
        
        beepOscillator.connect(beepGain);
        beepGain.connect(audioContext.destination);
        
        beepOscillator.start();
        
        // Short beep
        setTimeout(() => {
            beepOscillator.stop();
            beepOscillator.disconnect();
            beepGain.disconnect();
            resolve();
        }, 150);
    });
}

function startTest() {
    // Initialize audio on first interaction (required by browsers)
    if (!audioContext) {
        if (!initializeAudio()) {
            return;
        }
    }
    
    if (!chart) {
        initializeChart();
    }
    
    // Reset test state
    currentFrequencyIndex = 0;
    responses.heard = [];
    responses.notHeard = [];
    
    // Update UI
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('responseButtons').style.display = 'block';
    
    const progressContainer = document.getElementById('progressIndicator');
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
    
    // Clear and reinitialize chart
    initializeChart();
    updateProgressIndicator();
    
    // Start first frequency
    playCurrentFrequency();
}

async function playCurrentFrequency() {
    if (currentFrequencyIndex >= testFrequencies.length) {
        endTest();
        return;
    }
    
    const frequency = testFrequencies[currentFrequencyIndex];
    document.getElementById('frequencyInput').value = frequency;
    
    // Disable response buttons while playing
    setResponseButtonsEnabled(false);
    
    // Play the tone
    await playTone(frequency, 2000);
    
    // Enable response buttons after tone ends
    setResponseButtonsEnabled(true);
}

function setResponseButtonsEnabled(enabled) {
    const yesBtn = document.querySelector('.yes-button');
    const noBtn = document.querySelector('.no-button');
    
    if (yesBtn) yesBtn.disabled = !enabled;
    if (noBtn) noBtn.disabled = !enabled;
}

function answer(response) {
    if (isPlaying) return; // Prevent answering while tone is playing
    
    const frequency = testFrequencies[currentFrequencyIndex];
    
    if (response === 'Yes') {
        responses.heard.push({ y: frequency, x: 1 });
    } else {
        responses.notHeard.push({ y: frequency, x: 1 });
    }
    
    updateChart();
    currentFrequencyIndex++;
    updateProgressIndicator();
    
    if (currentFrequencyIndex < testFrequencies.length) {
        // Small delay before next frequency
        setTimeout(playCurrentFrequency, 800);
    } else {
        endTest();
    }
}

function endTest() {
    document.getElementById('responseButtons').style.display = 'none';
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('startButton').textContent = 'Restart Test';
    document.getElementById('frequencyInput').value = '';
    
    // Show results summary
    showResultsSummary();
}

function showResultsSummary() {
    const summaryContainer = document.getElementById('resultsSummary');
    if (!summaryContainer) return;
    
    const totalTested = testFrequencies.length;
    const heardCount = responses.heard.length;
    const notHeardCount = responses.notHeard.length;
    
    // Analyze results by frequency range
    const lowFreqResults = analyzeRange(125, 500);
    const speechFreqResults = analyzeRange(500, 2000);
    const highFreqResults = analyzeRange(2000, 16000);
    
    let summaryHTML = `
        <h3>Test Results Summary</h3>
        <div class="results-stats">
            <div class="stat-item heard">
                <span class="stat-number">${heardCount}</span>
                <span class="stat-label">Frequencies Heard</span>
            </div>
            <div class="stat-item not-heard">
                <span class="stat-number">${notHeardCount}</span>
                <span class="stat-label">Frequencies Not Heard</span>
            </div>
        </div>
        <div class="range-analysis">
            <div class="range-item ${lowFreqResults.status}">
                <strong>Low Frequencies (125-500 Hz):</strong> 
                ${lowFreqResults.heard}/${lowFreqResults.total} heard
                <span class="range-note">(Bass sounds, music)</span>
            </div>
            <div class="range-item ${speechFreqResults.status}">
                <strong>Speech Frequencies (500-2000 Hz):</strong> 
                ${speechFreqResults.heard}/${speechFreqResults.total} heard
                <span class="range-note">(Important for conversation)</span>
            </div>
            <div class="range-item ${highFreqResults.status}">
                <strong>High Frequencies (2000-16000 Hz):</strong> 
                ${highFreqResults.heard}/${highFreqResults.total} heard
                <span class="range-note">(Consonants, high-pitched sounds)</span>
            </div>
        </div>
    `;
    
    if (notHeardCount > 0) {
        summaryHTML += `
            <div class="recommendation">
                <p><strong>Note:</strong> This is a screening tool only. If you have concerns about your hearing, 
                please consult an audiologist or ENT specialist for a comprehensive hearing evaluation.</p>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = summaryHTML;
    summaryContainer.style.display = 'block';
}

function analyzeRange(minFreq, maxFreq) {
    const freqsInRange = testFrequencies.filter(f => f >= minFreq && f <= maxFreq);
    const heardInRange = responses.heard.filter(r => r.y >= minFreq && r.y <= maxFreq);
    
    const total = freqsInRange.length;
    const heard = heardInRange.length;
    
    let status = 'good';
    if (heard < total * 0.5) status = 'concerning';
    else if (heard < total) status = 'partial';
    
    return { total, heard, status };
}

function updateChart() {
    if (!chart) return;
    
    chart.data.datasets[0].data = responses.heard;
    chart.data.datasets[1].data = responses.notHeard;
    chart.update('none'); // 'none' for no animation during update
}

function downloadChart() {
    const canvas = document.getElementById('responseChart');
    
    // Create a new canvas with white background and results
    const downloadCanvas = document.createElement('canvas');
    const padding = 40;
    downloadCanvas.width = canvas.width + padding * 2;
    downloadCanvas.height = canvas.height + 100;
    const downloadContext = downloadCanvas.getContext('2d');
    
    // Fill white background
    downloadContext.fillStyle = 'white';
    downloadContext.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    
    // Add title
    downloadContext.fillStyle = '#333';
    downloadContext.font = 'bold 18px Arial';
    downloadContext.textAlign = 'center';
    downloadContext.fillText('Hearing Frequency Test Results', downloadCanvas.width / 2, 30);
    
    // Add date
    downloadContext.font = '12px Arial';
    downloadContext.fillText(`Date: ${new Date().toLocaleDateString()}`, downloadCanvas.width / 2, 50);
    
    // Draw the chart
    downloadContext.drawImage(canvas, padding, 60);
    
    // Add summary at bottom
    const summaryY = canvas.height + 75;
    downloadContext.font = '12px Arial';
    downloadContext.textAlign = 'left';
    downloadContext.fillText(
        `Heard: ${responses.heard.length}/${testFrequencies.length} frequencies | ` +
        `Not Heard: ${responses.notHeard.length}/${testFrequencies.length} frequencies`,
        padding, summaryY
    );
    
    // Create download link
    const link = document.createElement('a');
    link.download = `hearing-test-results-${new Date().toISOString().split('T')[0]}.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();
}

function showMessage(message, type = 'info') {
    // Create or get message container
    let msgContainer = document.getElementById('testMessage');
    if (!msgContainer) {
        msgContainer = document.createElement('div');
        msgContainer.id = 'testMessage';
        const testContainer = document.querySelector('.test-container');
        if (testContainer) {
            testContainer.insertBefore(msgContainer, testContainer.firstChild);
        }
    }
    
    msgContainer.className = `test-message ${type}`;
    msgContainer.textContent = message;
    msgContainer.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        msgContainer.style.display = 'none';
    }, 5000);
}

// Initialize chart on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
});
