function askAboutHearingLoss() {
    var container = document.getElementById('tree-container');
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
      button.onclick = function () {
        checkHearingLoss(symptom);
      };
      container.appendChild(button);
    });
  }
  
  function checkHearingLoss(symptom) {
    var container = document.getElementById('tree-container');
    container.innerHTML = '';
  
    if (confirm('Do you also experience ' + symptom + '?')) {
      showResult('You may have Hearing Loss.');
    } else {
      showResult('Let\'s explore other possibilities.');
    }
  }
  
  function showResult(result) {
    var container = document.getElementById('tree-container');
    var message = document.createElement('p');
    message.textContent = result;
    container.appendChild(message);
  }
  