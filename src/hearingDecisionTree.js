document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('hearingButton');
  button.addEventListener('click', assessHearingLoss);

// Array to store prompts and actions
var prompts = [
  {
    prompt: "Hearing Loss?",
    actions: [
      {
        answer: "yes",
        actions: [
          {
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
                ],
              },
              {
                answer: "no",
                action: function () {
                  showResult("Wax Build-up");
                },
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
      {
        answer: "no",
        action: function () {
          showResult("nothing wrong with your ears or you may have an ear condition not associated with hearing loss.");
        },
      },
    ],
  },
];

  // Function to generate the HTML elements for the prompt
  function generatePromptElements(promptObj) {
    var container = document.querySelector('.container');
    container.innerHTML = ''; // Clear the container
  
    var promptText = document.createElement('p');
    promptText.textContent = promptObj.prompt;
    container.appendChild(promptText);
  
    var buttonYes = document.createElement('button');
    buttonYes.textContent = 'Yes';
    buttonYes.addEventListener('click', function () {
      handleAnswer('yes', promptObj);
    });
    container.appendChild(buttonYes);
  
    var buttonNo = document.createElement('button');
    buttonNo.textContent = 'No';
    buttonNo.addEventListener('click', function () {
      handleAnswer('no', promptObj);
    });
    container.appendChild(buttonNo);
  }
  
  // Function to handle the user's answer
  function handleAnswer(answer, promptObj) {
    var nextAction = promptObj.actions.find(function (action) {
      return action.answer === answer;
    });
  
    if (nextAction) {
      if (nextAction.prompt) {
        generatePromptElements(nextAction);
      } else if (nextAction.action) {
        nextAction.action();
      } else if (nextAction.result) {
        showResult(nextAction.result);
      }
    } else {
      window.location.href = "https://www.daviddasa.com/earCare-advice";
    }
  }
  
  // Function to assess hearing loss
  function assessHearingLoss() {
    generatePromptElements(prompts[0]);
  }

  // Function to show the result
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