/**
 * Medication Reminder Utility Functions
 * Shared utilities for medication tracking and notifications
 * 
 * Note: The main medication reminder logic is embedded in medication-reminder.html
 * This file provides additional utility functions that can be imported elsewhere.
 */

// ========== Notification Utilities ==========

/**
 * Request notification permission from the browser
 * @returns {Promise<string>} Permission status: 'granted', 'denied', or 'default'
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Browser does not support notifications');
        return 'denied';
    }
    
    if (Notification.permission === 'granted') {
        return 'granted';
    }
    
    return await Notification.requestPermission();
}

/**
 * Show a browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Notification|null} The notification object or null if not supported
 */
function showNotification(title, options = {}) {
    if (Notification.permission !== 'granted') {
        console.log('Notification permission not granted');
        return null;
    }
    
    const defaultOptions = {
        icon: 'https://github.com/Naijaoracle/daviddasa/blob/9556670c224c56b73e2a7f21ce1a4e27cbc1a90e/src/DD_logo.png?raw=true',
        badge: 'https://github.com/Naijaoracle/daviddasa/blob/9556670c224c56b73e2a7f21ce1a4e27cbc1a90e/src/DD_logo.png?raw=true',
        requireInteraction: true,
        ...options
    };
    
    return new Notification(title, defaultOptions);
}

// ========== Audio Utilities ==========

/**
 * Play a notification beep sound using Web Audio API
 * @param {Object} options - Sound options
 * @param {number} options.frequency - Frequency in Hz (default: 880)
 * @param {number} options.volume - Volume 0-1 (default: 0.3)
 * @param {number} options.beeps - Number of beeps (default: 3)
 */
function playNotificationSound(options = {}) {
    const { frequency = 880, volume = 0.3, beeps = 3 } = options;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        oscillator.start();
        
        // Create beep pattern
        for (let i = 0; i < beeps; i++) {
            const onTime = i * 400;
            const offTime = onTime + 200;
            
            setTimeout(() => { gainNode.gain.value = volume; }, onTime);
            setTimeout(() => { gainNode.gain.value = 0; }, offTime);
        }
        
        // Stop after all beeps
        setTimeout(() => {
            oscillator.stop();
            audioContext.close();
        }, beeps * 400);
        
    } catch (error) {
        console.warn('Audio playback not supported:', error);
    }
}

// ========== Time Utilities ==========

/**
 * Format 24-hour time to 12-hour format
 * @param {string} time24 - Time in HH:MM format
 * @returns {string} Time in 12-hour format with AM/PM
 */
function formatTime12Hour(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

/**
 * Get time until next occurrence of a specific time
 * @param {string} time24 - Time in HH:MM format
 * @returns {number} Milliseconds until the time
 */
function getTimeUntil(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }
    
    return target.getTime() - now.getTime();
}

/**
 * Format a date for display
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
function formatDateTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// ========== Storage Utilities ==========

/**
 * Get medications from localStorage
 * @returns {Array} Array of medication objects
 */
function getMedications() {
    try {
        return JSON.parse(localStorage.getItem('medications')) || [];
    } catch (error) {
        console.error('Error reading medications:', error);
        return [];
    }
}

/**
 * Save medications to localStorage
 * @param {Array} medications - Array of medication objects
 */
function saveMedications(medications) {
    try {
        localStorage.setItem('medications', JSON.stringify(medications));
    } catch (error) {
        console.error('Error saving medications:', error);
    }
}

/**
 * Get medication history from localStorage
 * @returns {Array} Array of history entries
 */
function getMedicationHistory() {
    try {
        return JSON.parse(localStorage.getItem('medHistory')) || [];
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

/**
 * Save medication history to localStorage
 * @param {Array} history - Array of history entries
 */
function saveMedicationHistory(history) {
    try {
        localStorage.setItem('medHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

// ========== Frequency Helpers ==========

/**
 * Get human-readable label for frequency code
 * @param {string} freq - Frequency code
 * @returns {string} Human-readable label
 */
function getFrequencyLabel(freq) {
    const labels = {
        'daily': 'Once daily',
        'twice': 'Twice daily',
        'thrice': 'Three times daily',
        'four': 'Four times daily',
        'weekly': 'Once weekly',
        'asneeded': 'As needed',
        'OD': 'Once daily',
        'BD': 'Twice daily',
        'TDS': 'Three times daily',
        'QDS': 'Four times daily'
    };
    return labels[freq] || freq;
}

/**
 * Get number of daily doses for a frequency
 * @param {string} freq - Frequency code
 * @returns {number} Number of doses per day
 */
function getDosesPerDay(freq) {
    const doses = {
        'daily': 1, 'OD': 1,
        'twice': 2, 'BD': 2,
        'thrice': 3, 'TDS': 3,
        'four': 4, 'QDS': 4,
        'weekly': 0.14,
        'asneeded': 0
    };
    return doses[freq] || 1;
}

// ========== Export for use in other modules ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        requestNotificationPermission,
        showNotification,
        playNotificationSound,
        formatTime12Hour,
        getTimeUntil,
        formatDateTime,
        getMedications,
        saveMedications,
        getMedicationHistory,
        saveMedicationHistory,
        getFrequencyLabel,
        getDosesPerDay
    };
}
