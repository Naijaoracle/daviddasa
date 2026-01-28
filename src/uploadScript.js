function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

document.addEventListener('DOMContentLoaded', async (event) => {
  const form = document.getElementById('imageUploadForm');
  const fileInput = document.querySelector('input[name="imageFile"]');
  const submitButton = document.querySelector('input[type="submit"]');
  const sasToken = document.getElementById('sasToken').value.trim();

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file.');
      return;
    }

    if (!sasToken) {
      alert('Upload token is missing. Please provide a valid SAS token.');
      return;
    }

    try {
      submitButton.disabled = true; // Prevent double submits
      const randomString = generateRandomString(8);
      const blobName = `kerastb${randomString}`;
      const formAction = form.action + '?' + sasToken; // Include SAS token in query string

      const response = await fetch(formAction, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.ok) {
        alert('Image uploaded to Blob Storage.');

        const functionResponse = await fetch('https://daviddasa.azurewebsites.net/api/HttpInitTrigger?clientId=blobs_extension', {
          method: 'POST',
          body: JSON.stringify({ blobName }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (functionResponse.ok) {
          try {
            const result = await functionResponse.text();
            alert('Prediction result: ' + result);
          } catch (error) {
            console.error('Error fetching prediction result:', error);
            alert('Failed to fetch prediction result.');
          }
        } else {
          throw new Error('Failed to trigger Azure Function.');
        }

        form.reset();
      } else {
        throw new Error('Failed to upload image to Blob Storage.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      submitButton.disabled = false; // Enable the button after processing
    }
  });
});
