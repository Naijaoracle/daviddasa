// Array of all questions
const allQuestions = [
    {
        question: "What is Digital Health?",
        options: [
            "The use of digital technologies to monitor health",
            "The use of digital technologies to improve health",
            "The use of digital technologies to replace health"
        ],
        correctAnswer: "The use of digital technologies to improve health"
    },
    {
        question: "What is Artificial Intelligence (AI)?",
        options: [
            "The simulation of human intelligence in machines",
            "The replacement of human intelligence with machines",
            "The removal of human intelligence from machines"
        ],
        correctAnswer: "The simulation of human intelligence in machines"
    },
    {
        question: "How can AI be used in healthcare?",
        options: [
            "To replace doctors",
            "To assist doctors in diagnosing diseases",
            "To make diseases"
        ],
        correctAnswer: "To assist doctors in diagnosing diseases"
    },
    {
        question: "What is the role of blockchain technology in healthcare?",
        options: [
            "To replace traditional health records",
            "To secure and decentralize patient data",
            "To block access to patient data"
        ],
        correctAnswer: "To secure and decentralize patient data"
    },
    {
        question: "What is telemedicine?",
        options: [
            "The delivery of healthcare services through technology",
            "The delivery of healthcare services in person",
            "The delivery of healthcare services through mail"
        ],
        correctAnswer: "The delivery of healthcare services through technology"
    },
    {
        question: "What is a wearable device in digital health?",
        options: [
            "A device that is worn on the body to track health data",
            "A device that is worn on the body to change health data",
            "A device that is worn on the body to hide health data"
        ],
        correctAnswer: "A device that is worn on the body to track health data"
    },

    {
        question: "What is machine learning in the context of AI?",
        options: [
            "The ability of a machine to learn from data",
            "The ability of a machine to learn from humans",
            "The ability of a machine to learn from machines"
        ],
        correctAnswer: "The ability of a machine to learn from data"
    },

    {
        question: "What is the potential of AI in predicting disease outcomes?",
        options: [
            "AI can predict disease outcomes with 100% accuracy",
            "AI can assist in predicting disease outcomes based on data",
            "AI cannot predict disease outcomes"
        ],
        correctAnswer: "AI can assist in predicting disease outcomes based on data"
    },

    {
        question: "What is the role of AI in medical imaging?",
        options: [
            "To replace radiologists",
            "To assist in interpreting medical images",
            "To create medical images"
        ],
        correctAnswer: "To assist in interpreting medical images"
    },

    {
        question: "What is the role of digital health in managing chronic diseases?",
        options: [
            "To cure chronic diseases",
            "To assist in monitoring and managing chronic diseases",
            "To create chronic diseases"
        ],
        correctAnswer: "To assist in monitoring and managing chronic diseases"
    },
    {
        question: "What is the role of AI in drug discovery?",
        options: [
            "To replace pharmacists",
            "To assist in discovering new drugs",
            "To stop the discovery of new drugs"
        ],
        correctAnswer: "To assist in discovering new drugs"
    },
    {
        question: "What is precision medicine?",
        options: [
            "A one-size-fits-all approach to medicine",
            "A personalized approach to medicine based on individual characteristics",
            "A randomized approach to medicine"
        ],
        correctAnswer: "A personalized approach to medicine based on individual characteristics"
    },
    {
        question: "What is the role of AI in precision medicine?",
        options: [
            "To replace doctors in precision medicine",
            "To assist in personalizing medical treatments based on individual characteristics",
            "To generalize medical treatments in precision medicine"
        ],
        correctAnswer: "To assist in personalizing medical treatments based on individual characteristics"
    },
    {
        question: "What is the role of digital health in mental health?",
        options: [
            "To replace therapists",
            "To assist in providing mental health services remotely",
            "To create mental health issues"
        ],
        correctAnswer: "To assist in providing mental health services remotely"
    },
    {
        question: "What is the role of AI in surgery?",
        options: [
            "To replace surgeons",
            "To assist surgeons in performing surgeries",
            "To stop surgeries"
        ],
        correctAnswer: "To assist surgeons in performing surgeries"
    },
    {
        question: "What is a health information exchange (HIE)?",
        options: [
            "The exchange of health information through phone calls",
            "The exchange of health information through mail",
            "The exchange of health information through digital platforms"
        ],
        correctAnswer: "The exchange of health information through digital platforms"
    },
    {
        question: "What is the role of AI in health information exchanges?",
        options: [
            "To stop health information exchanges",
            "To replace health information exchanges",
            "To assist in analyzing and interpreting health data"
        ],
        correctAnswer: "To assist in analyzing and interpreting health data"
    },
    {
        question: "What is the role of digital health in public health?",
        options: [
            "To create public health issues",
            "To replace public health officials",
            "To assist in monitoring and managing public health issues"
        ],
        correctAnswer: "To assist in monitoring and managing public health issues"
    },
    {
        question: "What is the role of AI in genomics?",
        options: [
            "To stop genomics research",
            "To replace geneticists",
            "To assist in analyzing and interpreting genomic data"
        ],
        correctAnswer: "To assist in analyzing and interpreting genomic data"
    },
    {
        question: "What is the role of digital health in patient engagement?",
        options: [
            "To stop patient engagement",
            "To replace patient engagement",
            "To enhance patient engagement through technology"
        ],
        correctAnswer: "To enhance patient engagement through technology"
    },
    {
        question: "What is the role of AI in healthcare administration?",
        options: [
            "To stop healthcare administration",
            "To replace healthcare administrators",
            "To assist in managing healthcare operations"
        ],
        correctAnswer: "To assist in managing healthcare operations"
    },
    {
        question: "What is the role of digital health in health education?",
        options: [
            "To stop health education",
            "To replace health education",
            "To enhance health education through technology"
        ],
        correctAnswer: "To enhance health education through technology"
    },

    {
        question: "What is the role of AI in health research?",
        options: [
            "To stop health research",
            "To replace health researchers",
            "To assist in analyzing and interpreting health research data"
        ],
        correctAnswer: "To assist in analyzing and interpreting health research data"
    },
        
    {
        question: "What is the role of digital health in health promotion?",
        options: [
            "To stop health promotion",
            "To replace health promotion",
            "To enhance health promotion through technology"
        ],
        correctAnswer: "To enhance health promotion through technology"
    },

    {
        question: "What is the role of AI in health policy?",
        options: [
            "To stop health policy",
            "To replace health policy makers",
            "To assist in analyzing and interpreting health policy data"
        ],
        correctAnswer: "To assist in analyzing and interpreting health policy data"
    },

    {
        question: "What are the potential privacy concerns related to AI in healthcare?",
        options: [
            "There are no privacy concerns with AI in healthcare",
            "AI may access and misuse sensitive patient data",
            "Privacy concerns only apply to non-AI healthcare technologies"
        ],
        correctAnswer: "AI may access and misuse sensitive patient data"
    },
    {
        question: "In what ways can AI improve medication adherence for patients?",
        options: [
            "By removing the need for medication adherence",
            "By providing reminders and personalized interventions",
            "By increasing the complexity of medication regimens"    
        ],
        correctAnswer: "By providing reminders and personalized interventions"
    },
    {    
        question: "How can AI-driven chatbots enhance the patient experience?",
        options: [
            "By replacing human interactions with chatbots",
            "By providing instant and personalized responses to patient queries",
            "By limiting communication channels to traditional methods"
        ],
        correctAnswer: "By providing instant and personalized responses to patient queries"
    },
    {    
        question: "What role can AI play in predicting and preventing disease outbreaks?",
        options: [
            "AI has no role in predicting or preventing disease outbreaks",
            "By analyzing data patterns to anticipate and mitigate potential outbreaks",
            "By intentionally spreading diseases for research purposes"
        ],
        correctAnswer: "By analyzing data patterns to anticipate and mitigate potential outbreaks"
    },
    {
        question: "How does remote patient monitoring contribute to digital health?",
        options: [
            "By replacing in-person consultations",
            "By enabling real-time monitoring of patients outside traditional healthcare settings",
            "By restricting patient monitoring to specific locations"
        ],
        correctAnswer: "By enabling real-time monitoring of patients outside traditional healthcare settings"
    },
    {
        question: "What are the potential privacy concerns related to AI in healthcare?",
        options: [
            "There are no privacy concerns with AI in healthcare",
            "AI may access and misuse sensitive patient data",
            "Privacy concerns only apply to non-AI healthcare technologies"
        ],
        correctAnswer: "AI may access and misuse sensitive patient data"
    },
    {
        question: "In what ways can AI improve medication adherence for patients?",
        options: [
            "By removing the need for medication adherence",
            "By providing reminders and personalized interventions",
            "By increasing the complexity of medication regimens"
        ],
        correctAnswer: "By providing reminders and personalized interventions"
    },
    {
        question: "How can AI-driven chatbots enhance the patient experience?",
        options: [
            "By replacing human interactions with chatbots",
            "By providing instant and personalized responses to patient queries",
            "By limiting communication channels to traditional methods"
        ],
        correctAnswer: "By providing instant and personalized responses to patient queries"
    },
    {
        question: "What role can AI play in predicting and preventing disease outbreaks?",
        options: [
            "AI has no role in predicting or preventing disease outbreaks",
            "By analyzing data patterns to anticipate and mitigate potential outbreaks",
            "By intentionally spreading diseases for research purposes"
        ],
        correctAnswer: "By analyzing data patterns to anticipate and mitigate potential outbreaks"
    },
    {
        "question": "What is the role of Big Data in healthcare?",
        "options": [
            "Big Data has no role in healthcare",
            "Big Data helps in storing patient records",
            "Big Data helps in predictive analysis, decision making, and improving patient care"
        ],
        "correctAnswer": "Big Data helps in predictive analysis, decision making, and improving patient care"
    },
    {
        "question": "What is the Internet of Medical Things (IoMT)?",
        "options": [
            "A network of medical devices connected to the internet",
            "A network of medical professionals",
            "A network of medical institutions"
        ],
        "correctAnswer": "A network of medical devices connected to the internet"
    },
    {
        "question": "How does telehealth differ from telemedicine?",
        "options": [
            "Telehealth involves a broader scope of remote healthcare services than telemedicine",
            "Telemedicine involves a broader scope of remote healthcare services than telehealth",
            "There is no difference between telehealth and telemedicine"
        ],
        "correctAnswer": "Telehealth involves a broader scope of remote healthcare services than telemedicine"
    },
    {
        "question": "What is the primary benefit of Electronic Health Records (EHRs)?",
        "options": [
            "EHRs primarily benefit the insurance companies",
            "EHRs enable better and faster decision making by providing accurate patient information",
            "EHRs are primarily used for billing purposes"
        ],
        "correctAnswer": "EHRs enable better and faster decision making by providing accurate patient information"
    },
    {
        "question": "How can blockchain technology benefit healthcare?",
        "options": [
            "Blockchain can ensure secure and tamper-proof storage of patient data",
            "Blockchain can replace the need for doctors",
            "Blockchain can automate patient diagnosis"
        ],
        "correctAnswer": "Blockchain can ensure secure and tamper-proof storage of patient data"
    },
    {
        "question": "What is the role of robotics in healthcare?",
        "options": [
            "Robotics has no role in healthcare",
            "Robotics is used to replace doctors",
            "Robotics assists in surgery, rehabilitation, and patient care"
        ],
        "correctAnswer": "Robotics assists in surgery, rehabilitation, and patient care"
    },    
];

// Function to shuffle an array randomly

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Shuffle all questions randomly
  shuffleArray(allQuestions);
  
  // Select 10 random questions for the quiz session
  const selectedQuestions = allQuestions.slice(0, 10);
  
  let currentQuestionIndex = 0;
  let score = 0;
  
  function loadQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    document.getElementById('question').innerHTML = currentQuestion.question;
  
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
  
    currentQuestion.options.forEach((option, index) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = option;
      input.id = `option${index}`;
  
      const label = document.createElement('label');
      label.className = 'option';
      label.setAttribute('for', `option${index}`);
      label.innerHTML = option;
  
      optionsContainer.appendChild(input);
      optionsContainer.appendChild(label);
    });
      // Start the timer for each question
  startTimer(60, document.getElementById('timer'));
  updateProgressBar(currentQuestionIndex, selectedQuestions.length);

  // Update the progress bar
  }
  
  function checkAnswer(selectedOption) {
      // Provide feedback on the answer
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
  
    provideFeedback(isCorrect);
  
    if (isCorrect) {
      score++;
    }
  
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showResult();
    }
  }
  
  function showResult() {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `Your Score: ${score} out of ${selectedQuestions.length}`;
    document.getElementById('options').innerHTML = '';
    document.querySelector('button').style.display = 'none';
  }
  
  function nextQuestion() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      showResult();
    }
  }
  
  function provideFeedback(isCorrect) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = isCorrect ? 'Correct!' : 'Incorrect!';
    resultContainer.classList.add(isCorrect ? 'correct' : 'incorrect');
  }
  
  function startTimer(duration, displayElement) {
    let timer = duration;
    let minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
  
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
  
      displayElement.textContent = minutes + ':' + seconds;
  
      if (--timer < 0) {
        // Timer has ended, perform necessary actions
        // For example, show result or move to the next question
      }
    }, 1000);
  }
  
  function updateProgressBar(currentQuestionIndex, totalQuestions) {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = progressPercentage + '%';
  }
  document.querySelector('button').addEventListener('click', nextQuestion);
  loadQuestion();