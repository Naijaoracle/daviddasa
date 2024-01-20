function scheduleReminder(time, frequency, days) {
    const selectedTimeArray = time.split(':');
    const hoursInMilliseconds = parseInt(selectedTimeArray[0]) * 60 * 60 * 1000;
    const minutesInMilliseconds = parseInt(selectedTimeArray[1]) * 60 * 1000;
    const selectedTimeInMilliseconds = hoursInMilliseconds + minutesInMilliseconds;

    const now = new Date();
    const currentTimeInMilliseconds = now.getHours() * 60 * 60 * 1000 + now.getMinutes() * 60 * 1000;

    let delay;

    switch (frequency) {
        case 'OD':
            delay = selectedTimeInMilliseconds - currentTimeInMilliseconds;
            break;
        case 'BD':
            const morningTime = 8 * 60 * 60 * 1000; // 8:00 AM
            const eveningTime = 14 * 60 * 60 * 1000; // 2:00 PM
            const currentTime = now.getHours() * 60 * 60 * 1000 + now.getMinutes() * 60 * 1000;

            delay = (currentTime < morningTime)
                ? morningTime - currentTime
                : eveningTime - currentTime + (24 * 60 * 60 * 1000);
            break;
        case 'TDS':
            // For Three Times Daily, schedule reminders for morning, noon, and evening
            const noonTime = 12 * 60 * 60 * 1000; // 12:00 PM
            const eveningTimeTDS = 18 * 60 * 60 * 1000; // 6:00 PM

            delay = (currentTime < morningTime)
                ? morningTime - currentTime
                : (currentTime < noonTime)
                    ? noonTime - currentTime
                    : eveningTimeTDS - currentTime + (24 * 60 * 60 * 1000);
            break;
        case 'QDS':
            // For Four Times Daily, schedule reminders for morning, noon, evening, and night
            const nightTime = 20 * 60 * 60 * 1000; // 8:00 PM

            delay = (currentTime < morningTime)
                ? morningTime - currentTime
                : (currentTime < noonTime)
                    ? noonTime - currentTime
                    : (currentTime < eveningTimeTDS)
                        ? eveningTimeTDS - currentTime
                        : nightTime - currentTime + (24 * 60 * 60 * 1000);
            break;
        default:
            alert('Invalid frequency.');
            return;
    }

    // If specific days are selected, adjust the delay based on the next occurrence
    if (days.length > 0) {
        const today = now.getDay();
        const selectedDaysIndices = days.map(day => (day - today + 7) % 7); // Calculate the indices of selected days

        // Find the next selected day
        const nextDay = selectedDaysIndices.find(index => index * 24 * 60 * 60 * 1000 > delay);

        if (nextDay !== undefined) {
            delay = nextDay * 24 * 60 * 60 * 1000;
        } else {
            // If no future selected days, set the delay to the next week
            delay += (7 - today) * 24 * 60 * 60 * 1000;
        }
    }

    setTimeout(() => {
        showNotification();
    }, delay);
}

function setReminder() {
    // Get the selected time, frequency, and days from the HTML elements
    const time = document.getElementById('med-time').value;
    const frequency = document.getElementById('frequency').value;
    const days = Array.from(document.getElementById('days').selectedOptions).map(option => option.value);

    // Call the scheduleReminder function with the selected time, frequency, and days
    scheduleReminder(time, frequency, days);
}

function showNotification() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications.");
        return;
    }

    // Request permission to display notifications
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            // Create a new notification
            const notification = new Notification("Medication Reminder", {
                body: "It's time to take your medication!",
                icon: "https://github.com/Naijaoracle/static_web_app/blob/main/src/DD_logo.png?raw=true"// Replace with the path to your notification icon
            });

            // Handle click event on the notification
            notification.onclick = function () {
                // Handle the click event here
                console.log("Notification clicked.");
            };
        }
    });
}