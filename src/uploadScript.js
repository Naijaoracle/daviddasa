function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  window.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('imageUploadForm');
    const fileInput = document.querySelector('input[name="imageFile"]');
    const submitButton = document.querySelector('input[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const file = fileInput.files[0];
      if (!file) {
        alert('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      submitButton.disabled = true; // Disable the button during submission

      try {
        // Generate a random 8-character alphanumeric string
        const randomString = generateRandomString(8);

        // Construct the blob name
        const blobName = `kerastb${randomString}`;

        // Your blob storage URL for uploading the image
        const uploadURL = `https://csb10032002a3ba9f46.blob.core.windows.net/azure-webjobs-hosts/${blobName}`;

        const response = await fetch(uploadURL, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (response.ok) {
          // File uploaded to Blob Storage, trigger Azure Function
          const functionResponse = await fetch('https://daviddasa.azurewebsites.net/api/HttpInitTrigger?', {
            method: 'POST',
            body: formData
          });

          if (functionResponse.ok) {
            const result = await functionResponse.json();
            alert('Prediction result: ' + JSON.stringify(result));
          } else {
            alert('Failed to trigger Azure Function.');
          }

          form.reset(); // Reset the form to clear the file input
        } else {
          alert('Failed to upload image to Blob Storage.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      } finally {
        submitButton.disabled = false; // Enable the button after processing
      }
    });
  });
