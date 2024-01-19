document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('hearingButton');
    button.addEventListener('click', askAboutHearingLoss);
  
    function askAboutHearingLoss() {
      var container = document.querySelector('.container');
      container.innerHTML = '';
  
      var symptoms = [
        'Difficulty hearing other people clearly and misunderstanding what they say, especially in noisy places',
        'Asking people to repeat themselves',
        'Listening to music or watching TV with the volume higher than other people need',
        'Difficulty hearing on the phone'
      ];
  
      symptoms.forEach(function (symptom) {
        var button = document.createElement('button');
        button.textContent = symptom;
        button.addEventListener('click', function () {
          checkHearingLoss(symptom);
        });
        container.appendChild(button);
      });
    }
  
    function checkHearingLoss(symptom) {
      var container = document.querySelector('.container');
      container.innerHTML = '';
  
      var nextOptions;
  
      switch (symptom) {
        case 'Difficulty hearing other people clearly and misunderstanding what they say, especially in noisy places':
          nextOptions = ['Option 1 for this symptom', 'Option 2 for this symptom', 'Option 3 for this symptom'];
          break;
        case 'Asking people to repeat themselves':
          nextOptions = ['Option 1 for this symptom', 'Option 2 for this symptom', 'Option 3 for this symptom'];
          break;
        case 'Listening to music or watching TV with the volume higher than other people need':
          nextOptions = ['Option 1 for this symptom', 'Option 2 for this symptom', 'Option 3 for this symptom'];
          break;
        case 'Difficulty hearing on the phone':
          nextOptions = ['Option 1 for this symptom', 'Option 2 for this symptom', 'Option 3 for this symptom'];
          break;
        // Add more cases for each symptom as needed
  
        default:
          break;
      }
  
      nextOptions.forEach(function (option) {
        var button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', function () {
          // Call the next function or show the result based on the selected option
          showResult('You may have Hearing Loss.'); // Modify this line accordingly
        });
        container.appendChild(button);
      });
    }
  
    function showResult(result) {
      var container = document.querySelector('.container');
      var message = document.createElement('p');
      message.textContent = result;
      container.appendChild(message);
    }
  });
  