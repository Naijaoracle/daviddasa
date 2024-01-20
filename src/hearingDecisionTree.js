document.addEventListener('DOMContentLoaded', function () {
  var yesButton = document.getElementById('hearingYesButton');
  var noButton = document.getElementById('hearingNoButton');
  yesButton.addEventListener('click', function () {
    generatePromptElements(prompts[0].actions[0].actions[0]);
  });
  noButton.addEventListener('click', function () {
    showResult("nothing wrong with your ears or you may have an ear condition not associated with hearing loss.");
  });

  // Array to store prompts and actions
  var prompts = [
    {
      prompt: "Hearing Loss?",
      actions: [
        {
          answer: "yes",
          prompt: "Is the hearing loss sudden? (Yes/No)",
          actions: [
            {
              answer: "yes",
              prompt: "Do you experience pain? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Tympanic Perforation");
                  },
                },
              ],
            },
            {
              answer: "no",
              action: function () {
                showResult("Sensorineural hearing loss or a Foreign Body in your ear");
              },
            },
          ],
        },
        {
          answer: "no",
          prompt: "Is the hearing loss gradual? (Yes/No)",
          actions: [
            {
              answer: "yes",
              prompt: "Do you experience pain? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Otitis Media");
                  },
                },
              ],
            },
            {
              answer: "no",
              prompt: "Do you have recent runny nose and/or fevers? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Labrynthitis");
                  },
                },
              ],
            },
            {
              answer: "no",
              prompt: "Do you experience loss of balance? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Meniere's Disease");
                  },
                },
                {
                  answer: "no",
                  action: function () {
                    showResult("Wax Build-up");
                  },
                },
              ],
            },
            {
              answer: "no",
              action: function () {
                showResult("Further assessment needed");
              },
            },
          ],
        },
      ],
    },
    // Add more prompts and actions as needed
  ];
  

// Function to generate prompt elements
function generatePromptElements(prompt) {
  var container = document.querySelector('.container');

  // Clear existing content in the container
  container.innerHTML = '';

  // Display the current prompt
  var promptElement = document.createElement('p');
  promptElement.textContent = prompt.prompt;
  container.appendChild(promptElement);

  // Create buttons for each possible answer
  prompt.actions.forEach(function (action) {
    var button = document.createElement('button');
    button.textContent = action.answer.charAt(0).toUpperCase() + action.answer.slice(1); // Capitalize the first letter
    button.addEventListener('click', function () {
      handleAnswer(action, action.answer);
    });
    container.appendChild(button);
  });
}

// Function to handle user's answer
function handleAnswer(action, answer) {
  if (action.action) {
    // If there's a specific action associated with the answer, execute it
    action.action();
  } else if (action.actions) {
    // If there are nested actions, generate the next set of prompts
    generatePromptElements(action);
  } else {
    // Handle any other cases as needed
    console.error("Unhandled action:", action);
  }
}

  // Function to display the result
  function showResult(result) {
    var container = document.querySelector('.container');
    var message = document.createElement('p');
    message.textContent = "You may have " + result +"."+"\nThis is not medical advice, please speak to your doctor. For general hearing tools and tips, click the link below.";

    var link = document.createElement('a');
    link.href = "https://www.daviddasa.com/earCare-advice";
    link.textContent = "Click here";
    message.appendChild(document.createElement('br'));
    message.appendChild(link);

    container.appendChild(message);
  }
});