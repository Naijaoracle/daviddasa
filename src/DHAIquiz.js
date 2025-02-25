// Array of all questions
const allQuestions = [
    {
        question: "What is the most comprehensive definition of Digital Health?",
        options: [
            "The use of digital technologies to improve health outcomes and healthcare delivery",
            "The exclusive use of wearable devices to track health metrics",
            "The replacement of traditional healthcare with online services"
        ],
        correctAnswer: "The use of digital technologies to improve health outcomes and healthcare delivery"
    },
    {
        question: "Which statement best describes Artificial Intelligence (AI) in healthcare?",
        options: [
            "Technology that simulates human intelligence to assist with medical decisions and processes",
            "Technology that exclusively replaces human clinicians with automated systems",
            "A theoretical concept that has not yet been implemented in healthcare settings"
        ],
        correctAnswer: "Technology that simulates human intelligence to assist with medical decisions and processes"
    },
    {
        question: "What distinguishes machine learning from traditional computer programming in healthcare applications?",
        options: [
            "Machine learning systems can improve performance through experience without explicit reprogramming",
            "Machine learning requires less computational power than traditional programming",
            "Machine learning always provides more accurate results than traditional programming"
        ],
        correctAnswer: "Machine learning systems can improve performance through experience without explicit reprogramming"
    },
    {
        question: "How does blockchain technology primarily benefit healthcare data management?",
        options: [
            "By creating immutable, transparent records while allowing selective and secure sharing of sensitive information",
            "By completely replacing traditional electronic health record systems",
            "By eliminating the need for data security measures in healthcare institutions"
        ],
        correctAnswer: "By creating immutable, transparent records while allowing selective and secure sharing of sensitive information"
    },
    {
        question: "What is the most accurate definition of telemedicine?",
        options: [
            "The remote delivery of clinical healthcare services using telecommunications technology",
            "Any digital health service delivered outside a hospital setting",
            "The use of social media platforms to discuss health concerns with physicians"
        ],
        correctAnswer: "The remote delivery of clinical healthcare services using telecommunications technology"
    },
    {
        question: "Which feature best characterizes wearable devices in digital health?",
        options: [
            "They continuously or periodically collect physiological data to monitor health status or activity",
            "They are exclusively used in hospital settings for critical care monitoring",
            "They primarily function to administer medications automatically"
        ],
        correctAnswer: "They continuously or periodically collect physiological data to monitor health status or activity"
    },
    {
        question: "How does deep learning differ from basic machine learning in healthcare applications?",
        options: [
            "Deep learning uses neural networks with multiple layers that can identify complex patterns in large datasets",
            "Deep learning requires less data than basic machine learning to achieve accurate results",
            "Deep learning is identical to basic machine learning but with a different marketing name"
        ],
        correctAnswer: "Deep learning uses neural networks with multiple layers that can identify complex patterns in large datasets"
    },
    {
        question: "What is the primary limitation of AI in predicting disease outcomes?",
        options: [
            "AI predictions are limited by the quality, diversity, and representativeness of training data",
            "AI cannot be used for predicting disease outcomes under any circumstances",
            "AI can predict disease outcomes with 100% accuracy if programmed correctly"
        ],
        correctAnswer: "AI predictions are limited by the quality, diversity, and representativeness of training data"
    },
    {
        question: "In medical imaging, how does AI most effectively complement radiologists' work?",
        options: [
            "By pre-screening images to flag potential abnormalities and providing quantitative analysis to support interpretation",
            "By completely automating the diagnostic process without human verification",
            "By generating medical images synthetically rather than requiring actual patient scans"
        ],
        correctAnswer: "By pre-screening images to flag potential abnormalities and providing quantitative analysis to support interpretation"
    },
    {
        question: "Which approach best describes the role of digital health in chronic disease management?",
        options: [
            "Enabling continuous monitoring, personalized interventions, and improved adherence to treatment plans",
            "Completely replacing in-person care with automated digital solutions",
            "Restricting patients' access to their own health data to prevent anxiety"
        ],
        correctAnswer: "Enabling continuous monitoring, personalized interventions, and improved adherence to treatment plans"
    },
    {
        question: "How does AI primarily contribute to drug discovery?",
        options: [
            "By analyzing molecular structures and predicting potential drug candidates more efficiently than traditional methods",
            "By synthesizing new chemical compounds without laboratory validation",
            "By replacing pharmacological research entirely with computational models"
        ],
        correctAnswer: "By analyzing molecular structures and predicting potential drug candidates more efficiently than traditional methods"
    },
    {
        question: "What is the core principle of precision medicine?",
        options: [
            "Tailoring medical treatments to individual characteristics including genetics, environment, and lifestyle",
            "Using the most expensive treatments available regardless of patient characteristics",
            "Applying standardized protocols to all patients with similar diagnoses"
        ],
        correctAnswer: "Tailoring medical treatments to individual characteristics including genetics, environment, and lifestyle"
    },
    {
        question: "How does AI specifically enable precision medicine?",
        options: [
            "By analyzing complex multivariate data to identify patterns that can inform personalized treatment decisions",
            "By removing the need for physicians to interpret genetic information",
            "By standardizing treatments across all patients with similar conditions"
        ],
        correctAnswer: "By analyzing complex multivariate data to identify patterns that can inform personalized treatment decisions"
    },
    {
        question: "What is the most significant contribution of digital health to mental healthcare?",
        options: [
            "Improving accessibility through teletherapy and digital interventions while monitoring symptoms remotely",
            "Replacing human therapists with fully automated AI counselors",
            "Eliminating the stigma associated with mental health conditions"
        ],
        correctAnswer: "Improving accessibility through teletherapy and digital interventions while monitoring symptoms remotely"
    },
    {
        question: "How are surgical robots most commonly integrated into modern healthcare?",
        options: [
            "As surgeon-controlled instruments that enhance precision, stability, and visualization during procedures",
            "As autonomous systems that perform surgeries without human supervision",
            "As training simulators that have no role in actual surgical procedures"
        ],
        correctAnswer: "As surgeon-controlled instruments that enhance precision, stability, and visualization during procedures"
    },
    {
        question: "What is the primary purpose of Health Information Exchange (HIE) systems?",
        options: [
            "To enable secure, efficient sharing of clinical information across different healthcare organizations and IT systems",
            "To centralize all healthcare data under government control",
            "To replace traditional medical record systems with blockchain technology"
        ],
        correctAnswer: "To enable secure, efficient sharing of clinical information across different healthcare organizations and IT systems"
    },
    {
        question: "How does AI contribute to health information exchange systems?",
        options: [
            "By identifying patterns across distributed datasets and facilitating interoperability between different data standards",
            "By eliminating the need for data governance frameworks in healthcare",
            "By restricting access to patient information to prevent privacy breaches"
        ],
        correctAnswer: "By identifying patterns across distributed datasets and facilitating interoperability between different data standards"
    },
    {
        question: "How does digital health contribute to public health surveillance?",
        options: [
            "By enabling real-time data collection, early outbreak detection, and more efficient resource allocation",
            "By tracking individual citizens without consent for public safety",
            "By replacing traditional epidemiological methods entirely"
        ],
        correctAnswer: "By enabling real-time data collection, early outbreak detection, and more efficient resource allocation"
    },
    {
        question: "What is the primary application of AI in genomics?",
        options: [
            "Analyzing and interpreting complex genomic data to identify disease markers and potential therapeutic targets",
            "Creating artificial genetic sequences to replace human DNA",
            "Determining which genetic data should be hidden from patients"
        ],
        correctAnswer: "Analyzing and interpreting complex genomic data to identify disease markers and potential therapeutic targets"
    },
    {
        question: "How do patient portals enhance patient engagement in digital health?",
        options: [
            "By providing secure access to personal health information, test results, and communication with providers",
            "By restricting information to prevent patients from becoming anxious about their health",
            "By automating all patient-provider interactions to eliminate human communication"
        ],
        correctAnswer: "By providing secure access to personal health information, test results, and communication with providers"
    },
    {
        question: "What is the primary benefit of AI in healthcare administration?",
        options: [
            "Automating routine tasks, optimizing resource allocation, and improving operational efficiency",
            "Eliminating the need for human administrators entirely",
            "Decreasing the importance of patient satisfaction metrics"
        ],
        correctAnswer: "Automating routine tasks, optimizing resource allocation, and improving operational efficiency"
    },
    {
        question: "How does digital health technology primarily enhance health education?",
        options: [
            "By providing interactive, personalized learning experiences and improved access to reliable information",
            "By replacing traditional medical education with virtual reality simulations",
            "By eliminating the need for evidence-based health information"
        ],
        correctAnswer: "By providing interactive, personalized learning experiences and improved access to reliable information"
    },
    {
        question: "What is the primary contribution of AI to health research?",
        options: [
            "Accelerating data analysis, identifying novel patterns, and generating hypotheses from complex datasets",
            "Eliminating the need for human researchers in designing studies",
            "Fabricating research data to support predetermined conclusions"
        ],
        correctAnswer: "Accelerating data analysis, identifying novel patterns, and generating hypotheses from complex datasets"
    },
    {
        question: "How does digital health technology promote preventive healthcare?",
        options: [
            "By enabling personalized risk assessments, habit tracking, and timely interventions before disease progression",
            "By restricting unhealthy behaviors through digital surveillance",
            "By making preventive services more expensive and exclusive"
        ],
        correctAnswer: "By enabling personalized risk assessments, habit tracking, and timely interventions before disease progression"
    },
    {
        question: "How can AI best inform health policy decisions?",
        options: [
            "By analyzing population-level data to predict outcomes of different policy approaches and identify disparities",
            "By replacing human judgment in all policy decisions with algorithmic determination",
            "By prioritizing cost-cutting measures over health outcomes"
        ],
        correctAnswer: "By analyzing population-level data to predict outcomes of different policy approaches and identify disparities"
    },
    {
        question: "What is the most significant privacy concern related to AI in healthcare?",
        options: [
            "The potential for unauthorized access, re-identification of anonymized data, and algorithmic bias",
            "Patient data privacy is not a significant concern when using AI",
            "The possibility that AI might become sentient and intentionally leak patient information"
        ],
        correctAnswer: "The potential for unauthorized access, re-identification of anonymized data, and algorithmic bias"
    },
    {
        question: "How can digital health technologies most effectively improve medication adherence?",
        options: [
            "Through smart pill dispensers, personalized reminders, and real-time monitoring with feedback loops",
            "By restricting medication access until patients demonstrate compliance",
            "By removing patient autonomy from medication decisions"
        ],
        correctAnswer: "Through smart pill dispensers, personalized reminders, and real-time monitoring with feedback loops"
    },
    {
        question: "What is the most effective implementation of AI-driven healthcare chatbots?",
        options: [
            "As supplementary tools that provide information, triage, and support while clearly indicating their limitations",
            "As complete replacements for human clinicians in all patient interactions",
            "As systems that diagnose conditions without physician oversight"
        ],
        correctAnswer: "As supplementary tools that provide information, triage, and support while clearly indicating their limitations"
    },
    {
        question: "How does AI contribute to epidemic surveillance and management?",
        options: [
            "By analyzing diverse data sources to detect anomalies, predict spread patterns, and optimize resource allocation",
            "By implementing surveillance measures that override individual privacy rights",
            "By making autonomous decisions about quarantine and isolation without human oversight"
        ],
        correctAnswer: "By analyzing diverse data sources to detect anomalies, predict spread patterns, and optimize resource allocation"
    },
    {
        question: "What is the primary advantage of remote patient monitoring in healthcare delivery?",
        options: [
            "Enabling earlier interventions by continuously tracking health parameters outside clinical settings",
            "Reducing the need for any in-person healthcare visits",
            "Collecting data without patient awareness or consent"
        ],
        correctAnswer: "Enabling earlier interventions by continuously tracking health parameters outside clinical settings"
    },
    {
        question: "What constitutes big data in healthcare?",
        options: [
            "Extremely large, diverse datasets from multiple sources that require advanced analytics for meaningful interpretation",
            "Any electronic health record system regardless of size or complexity",
            "Government-mandated centralized databases of patient information"
        ],
        correctAnswer: "Extremely large, diverse datasets from multiple sources that require advanced analytics for meaningful interpretation"
    },
    {
        question: "What defines the Internet of Medical Things (IoMT)?",
        options: [
            "An interconnected system of medical devices, software applications, and health systems that collect and exchange data",
            "A theoretical concept with no current practical applications in healthcare",
            "The use of internet searches to self-diagnose medical conditions"
        ],
        correctAnswer: "An interconnected system of medical devices, software applications, and health systems that collect and exchange data"
    },
    {
        question: "What is the key distinction between telehealth and telemedicine?",
        options: [
            "Telehealth encompasses a broader range of remote services including education and administration, while telemedicine focuses specifically on clinical services",
            "Telehealth is exclusively used for mental health services, while telemedicine is for physical health",
            "Telehealth is only available in hospitals, while telemedicine is for home use"
        ],
        correctAnswer: "Telehealth encompasses a broader range of remote services including education and administration, while telemedicine focuses specifically on clinical services"
    },
    {
        question: "What is the most significant advantage of Electronic Health Records (EHRs)?",
        options: [
            "Providing comprehensive, accessible patient information at the point of care while enabling data analysis and coordination across providers",
            "Eliminating the need for patient-provider communication about medical history",
            "Creating revenue through increased billing efficiency regardless of patient outcomes"
        ],
        correctAnswer: "Providing comprehensive, accessible patient information at the point of care while enabling data analysis and coordination across providers"
    },
    {
        question: "How does natural language processing (NLP) contribute to healthcare?",
        options: [
            "By extracting meaningful information from unstructured clinical notes and enabling voice-based documentation",
            "By eliminating the need for clinicians to document patient encounters",
            "By translating medical terminology into simpler language regardless of accuracy"
        ],
        correctAnswer: "By extracting meaningful information from unstructured clinical notes and enabling voice-based documentation"
    },
    {
        question: "What is the primary purpose of clinical decision support systems (CDSS)?",
        options: [
            "To provide clinicians with knowledge and patient-specific information to enhance decision-making at appropriate times",
            "To replace clinical judgment entirely with automated decisions",
            "To justify billing for more expensive procedures regardless of medical necessity"
        ],
        correctAnswer: "To provide clinicians with knowledge and patient-specific information to enhance decision-making at appropriate times"
    },
    {
        question: "How does computer vision technology primarily benefit healthcare?",
        options: [
            "By analyzing medical images, monitoring patient activities, and enabling touchless interfaces in sterile environments",
            "By replacing human vision entirely in all medical contexts",
            "By surveilling patients without their knowledge or consent"
        ],
        correctAnswer: "By analyzing medical images, monitoring patient activities, and enabling touchless interfaces in sterile environments"
    },
    {
        question: "What is the most accurate description of a digital therapeutic (DTx)?",
        options: [
            "Evidence-based software interventions that prevent, manage, or treat medical disorders or diseases",
            "Any health-related mobile application regardless of clinical validation",
            "Virtual reality games designed purely for entertainment in healthcare settings"
        ],
        correctAnswer: "Evidence-based software interventions that prevent, manage, or treat medical disorders or diseases"
    },
    {
        question: "How do social determinants of health (SDOH) data enhance digital health initiatives?",
        options: [
            "By providing context about non-clinical factors that significantly influence health outcomes and treatment effectiveness",
            "By enabling discrimination against patients from disadvantaged backgrounds",
            "By eliminating the need for clinical data in healthcare decision-making"
        ],
        correctAnswer: "By providing context about non-clinical factors that significantly influence health outcomes and treatment effectiveness"
    },
    {
        question: "What is the primary purpose of predictive analytics in healthcare?",
        options: [
            "To identify patients at risk for deterioration or readmission and enable proactive interventions",
            "To predict which patients will be most profitable for healthcare systems",
            "To eliminate the need for preventive care by accurately predicting all possible outcomes"
        ],
        correctAnswer: "To identify patients at risk for deterioration or readmission and enable proactive interventions"
    },
    {
        question: "How does augmented reality (AR) primarily benefit healthcare?",
        options: [
            "By overlaying digital information onto the physical world to enhance surgical navigation and medical training",
            "By creating entirely virtual environments that replace real-world medical settings",
            "By providing entertainment for patients regardless of clinical benefit"
        ],
        correctAnswer: "By overlaying digital information onto the physical world to enhance surgical navigation and medical training"
    },
    {
        question: "What is the primary challenge of implementing AI in rural or underserved healthcare settings?",
        options: [
            "Limited infrastructure, connectivity issues, and potential exacerbation of existing healthcare disparities",
            "Rural patients' unwillingness to use technology under any circumstances",
            "The inherent inability of AI to address health concerns outside urban settings"
        ],
        correctAnswer: "Limited infrastructure, connectivity issues, and potential exacerbation of existing healthcare disparities"
    },
    {
        question: "How does federated learning address privacy concerns in healthcare AI?",
        options: [
            "By training algorithms across multiple decentralized devices without exchanging the underlying patient data",
            "By centralizing all healthcare data in a single secure location",
            "By eliminating the need for patient consent in AI development"
        ],
        correctAnswer: "By training algorithms across multiple decentralized devices without exchanging the underlying patient data"
    },
    {
        question: "What is the primary ethical consideration when implementing AI in clinical care?",
        options: [
            "Ensuring transparency, explicability, and human oversight while mitigating algorithmic bias",
            "Maximizing efficiency regardless of impact on patient-provider relationships",
            "Implementing AI solutions without informing patients to avoid resistance"
        ],
        correctAnswer: "Ensuring transparency, explicability, and human oversight while mitigating algorithmic bias"
    },
    {
        question: "How do digital twins contribute to healthcare advancement?",
        options: [
            "By creating virtual replicas of patients or organs to simulate treatment responses and optimize care",
            "By cloning patients genetically to test treatments without consent",
            "By replacing the need for clinical trials with completely virtual patients"
        ],
        correctAnswer: "By creating virtual replicas of patients or organs to simulate treatment responses and optimize care"
    },
    {
        question: "What is the most accurate description of healthcare interoperability?",
        options: [
            "The ability of different information systems, devices, and applications to access, exchange, and cooperatively use data across organizational boundaries",
            "The standardization of all healthcare systems under a single proprietary platform",
            "The elimination of specialized health IT systems in favor of general-purpose solutions"
        ],
        correctAnswer: "The ability of different information systems, devices, and applications to access, exchange, and cooperatively use data across organizational boundaries"
    },
    {
        question: "How does digital health technology impact health equity?",
        options: [
            "It can either reduce or exacerbate disparities depending on implementation, accessibility, and cultural appropriateness",
            "Digital health inherently eliminates all healthcare disparities without additional effort",
            "Digital health technologies are irrelevant to health equity considerations"
        ],
        correctAnswer: "It can either reduce or exacerbate disparities depending on implementation, accessibility, and cultural appropriateness"
    },
    {
        question: "What is the primary function of a FHIR (Fast Healthcare Interoperability Resources) standard?",
        options: [
            "To provide a standardized framework for exchanging healthcare information electronically",
            "To accelerate the physical delivery of medical supplies between facilities",
            "To restrict access to patient information in emergency situations"
        ],
        correctAnswer: "To provide a standardized framework for exchanging healthcare information electronically"
    },
    {
        question: "How do digital biomarkers differ from traditional biomarkers?",
        options: [
            "Digital biomarkers are collected through connected digital tools rather than conventional laboratory or imaging procedures",
            "Digital biomarkers are always less accurate than traditional biomarkers",
            "Digital biomarkers require surgical implantation of sensors to collect data"
        ],
        correctAnswer: "Digital biomarkers are collected through connected digital tools rather than conventional laboratory or imaging procedures"
    },
    {
        question: "What is the most significant regulatory challenge for digital health innovations?",
        options: [
            "Balancing patient safety and innovation while addressing privacy, security, and efficacy requirements across rapidly evolving technologies",
            "Ensuring that all digital health products are classified as medical devices regardless of function",
            "Preventing any regulation of digital health products to maximize market growth"
        ],
        correctAnswer: "Balancing patient safety and innovation while addressing privacy, security, and efficacy requirements across rapidly evolving technologies"
    },
    {
        question: "How does quantum computing potentially transform healthcare AI?",
        options: [
            "By enabling exponentially faster analysis of complex biological systems and drug interactions",
            "By generating conscious AI systems that can replace all healthcare workers",
            "By eliminating the need for clinical validation of AI systems"
        ],
        correctAnswer: "By enabling exponentially faster analysis of complex biological systems and drug interactions"
    },
    {
        question: "What is the primary purpose of digital phenotyping in healthcare?",
        options: [
            "To collect and analyze data from smartphones and wearables to infer behavioral and cognitive states relevant to health",
            "To permanently categorize patients based on their technology usage patterns",
            "To restrict healthcare access based on digital literacy levels"
        ],
        correctAnswer: "To collect and analyze data from smartphones and wearables to infer behavioral and cognitive states relevant to health"
    }
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

// Select 5 random questions for the quiz session (instead of 10 - for a quicker quiz)
const selectedQuestions = allQuestions.slice(0, 5);

let currentQuestionIndex = 0;
let score = 0;
let intervalId;

let startTime; // Variable to store the start time of the timer
let requestId; // Variable to store the requestAnimationFrame ID
let endTime; // Variable to store the end time of the timer

// Start the timer at the beginning of the quiz
startTimer(300); // Start the timer with a duration of 5 minutes

function loadQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const totalQuestions = selectedQuestions.length; // This will be 5 since we sliced 5 questions
    
    document.getElementById('question').textContent = currentQuestion.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const optionContainer = document.createElement('div');
        optionContainer.className = 'option';
        optionContainer.textContent = option;

        optionContainer.addEventListener('click', () => {
            checkAnswer(option);
        });

        optionsContainer.appendChild(optionContainer);
    });

    updateProgressBar(currentQuestionIndex, totalQuestions);
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
        stopTimer();
    }
}

function provideFeedback(isCorrect, score) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = isCorrect ? 'Your previous answer was: Correct!' : 'Your previous answer was: Incorrect!';
    resultContainer.classList.add(isCorrect ? 'correct' : 'incorrect');
    resultContainer.style.color = isCorrect ? '#4caf50' : '#f44336';
}

function startTimer(duration, timerElement) {
    startTime = Date.now(); // Store the current time as the start time
    endTime = startTime + duration * 1000; // Calculate the end time

    updateTimer(); // Call the updateTimer function to start the timer updates
}

function updateTimer() {
    const currentTime = Date.now(); // Get the current time
    const remainingTime = endTime - currentTime; // Calculate the remaining time

    if (remainingTime <= 0) { // If the remaining time is less than or equal to 0
        stopTimer(); // Stop the timer
        window.location.href = "https://www.daviddasa.com/DHAIquiz"; // Reload the page
        return;
    }

    // Convert the remaining time to minutes and seconds
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    // Format the minutes and seconds with leading zeros if necessary
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    document.getElementById('timer').textContent = formattedTime; // Update the timer display

    requestId = requestAnimationFrame(updateTimer); // Call updateTimer again on the next frame
}

function stopTimer() {
    cancelAnimationFrame(requestId); // Cancel the requestAnimationFrame loop
}

function nextQuestion() {
    clearInterval(intervalId);
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(intervalId);
    stopTimer(); // Stop the timer at the end of the quiz
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `Your Score: ${score} out of ${selectedQuestions.length}`;
    document.getElementById('options').innerHTML = '';
    document.querySelector('button').style.display = 'none';
    document.getElementById('timer').classList.add('hidden'); // Add the 'hidden' class to hide the timer at the end of the quiz
    document.getElementById('question').classList.add('hidden'); // Add the 'hidden' class to hide the question at the end of the quiz
}

function updateProgressBar(currentQuestionIndex, totalQuestions) {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
    progressBar.style.width = progressPercentage + '%';
}

// Update the result element
const resultElement = document.getElementById('result');
resultElement.textContent = `Your Score: ${score} out of ${selectedQuestions.length}`;

// Update the question element
const questionElement = document.getElementById('question');
questionElement.textContent = allQuestions[currentQuestionIndex].question;

// Update the options element
const optionsElement = document.getElementById('options');
optionsElement.innerHTML = '';
allQuestions[currentQuestionIndex].options.forEach((option, index) => {
    const inputElement = document.createElement('input');
    inputElement.type = 'radio';
    inputElement.name = 'option';
    inputElement.value = `option${index + 1}`;

    const labelElement = document.createElement('label');
    labelElement.htmlFor = `option${index + 1}`;
    labelElement.textContent = option;

    optionsElement.appendChild(inputElement);
    optionsElement.appendChild(labelElement);
    optionsElement.appendChild(document.createElement('br'));
});

// Update the timer element
const timerElement = document.getElementById('timer');
timerElement.textContent = "00:00";

// Update the progress bar element
const progressBarElement = document.getElementById('progress-bar');
progressBarElement.style.width = "50%";

// Update the next button element
const nextButtonElement = document.querySelector('button');
nextButtonElement.disabled = false;

document.querySelector('button').addEventListener('click', nextQuestion);
loadQuestion();
