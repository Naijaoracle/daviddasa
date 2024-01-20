document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('hearingButton');
  button.addEventListener('click', assessHearingLoss);

  // Array to store prompts and actions
  var prompts = [
    {
      prompt: "Do you have hearing loss? (Yes/No)",
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
                  }
                }
              ]
            },
            {
              answer: "no",
              prompt: "Do you have sensorineural hearing loss? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  prompt: "Is it due to a foreign body? (Yes/No)",
                  actions: [
                    {
                      answer: "yes",
                      action: function () {
                        showResult("Foreign Body");
                      }
                    }
                  ]
                },
                {
                  answer: "no",
                  action: function () {
                    showResult("Further assessment needed");
                  }
                }
              ]
            }
          ]
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
                  }
                }
              ]
            },
            {
              answer: "no",
              prompt: "Do you have recent runny nose and/or fevers? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Labrynthitis");
                  }
                }
              ]
            },
            {
              answer: "no",
              prompt: "Do you experience loss of balance? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Meniere's Disease");
                  }
                }
              ]
            },
            {
              answer: "no",
              prompt: "Do you have wax build-up? (Yes/No)",
              actions: [
                {
                  answer: "yes",
                  action: function () {
                    showResult("Wax Build-up");
                  }
                }
              ]
            },
            {
              answer: "no",
              action: function () {
                showResult("Further assessment needed");
              }
            }
          ]
        }
      ]
    }
  ];

  // Function to assess hearing loss
  function assessHearingLoss() {
    var currentPrompt = prompts.shift();
    var answer = prompt(currentPrompt.prompt).toLowerCase();

    var nextAction = currentPrompt.actions.find(function (action) {
      return action.answer === answer;
    });

    if (nextAction) {
      if (nextAction.prompt) {
        assessHearingLoss(nextAction);
      } else if (nextAction.action) {
        nextAction.action();
      }
    } else {
      window.location.href = "https://www.daviddasa.com/earcare-advice";
    }
  }

  // Call the function to start the assessment
  assessHearingLoss();

  function showResult(result) {
    var container = document.querySelector('.container');
    var message = document.createElement('p');
    message.textContent = "You may have " + result + "\nThis is not medical advice, please speak to your doctor.";

    var link = document.createElement('a');
    link.href = "https://www.daviddasa.com/earcare-advice";
    link.textContent = "For general hearing tools and tips, click here";
    message.appendChild(document.createElement('br'));
    message.appendChild(link);

    container.appendChild(message);
  }
});