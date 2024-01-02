function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

window.addEventListener('DOMContentLoaded', async (event) => {
  const form = document.getElementById('imageUploadForm');
  const fileInput = document.querySelector('input[name="imageFile"]');
  const submitButton = document.querySelector('input[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file.');
      return;
    }

    try {
      const randomString = generateRandomString(8);
      const blobName = `kerastb${randomString}`;

      const uploadURL = 'https://csb10032002a3ba9f46.blob.core.windows.net/azure-webjobs-hosts?sp=racw&st=2024-01-01T23:43:03Z&se=2025-01-01T07:43:03Z&spr=https&sv=2022-11-02&sr=c&sig=ryiM2t6bGsOVNdJyPL%2BaURpHOIAuQgzMwOmZAn5arhU%3D';

      const response = await fetch(uploadURL, {
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
          body: JSON.stringify({ blobName }), // Sending the constructed blob name
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (functionResponse.ok) {
          const result = await functionResponse.text();
          alert('Prediction result: ' + result);
        } else {
          throw new Error('Failed to trigger Azure Function.');
        }

        form.reset(); // Reset the form to clear the file input
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
