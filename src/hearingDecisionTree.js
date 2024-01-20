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
    var promptElement = document.createElement('p');
    promptElement.textContent = prompt.prompt;
    container.appendChild(promptElement);

    var yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.addEventListener('click', function () {
      handleAnswer(prompt, 'yes');
    });
    container.appendChild(yesButton);

    var noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.addEventListener('click', function () {
      handleAnswer(prompt, 'no');
    });
    container.appendChild(noButton);
  }

  // Function to handle user's answer
  function handleAnswer(prompt, answer) {
    var nextAction = prompt.actions.find(function (action) {
      return action.answer === answer;
    });

    if (nextAction) {
      if (nextAction.prompt) {
        generatePromptElements(nextAction);
      } else if (nextAction.action) {
        nextAction.action();
      }
    }
  }

  // Function to display the result
  function showResult(result) {
    var container = document.querySelector('.container');
    var message = document.createElement('p');
    message.textContent = "You may have " + result + "\nThis is not medical advice, please speak to your doctor. For general hearing tools and tips, click the link below.";

    var link = document.createElement('a');
    link.href = "https://www.daviddasa.com/earCare-advice";
    link.textContent = "Click here";
    message.appendChild(document.createElement('br'));
    message.appendChild(link);

    container.appendChild(message);
  }
});