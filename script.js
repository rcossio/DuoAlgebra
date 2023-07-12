document.addEventListener('DOMContentLoaded', function () {
  const questionContainer = document.getElementById('question-container');
  const questionElement = document.getElementById('question');
  const optionsContainer = document.getElementById('options-container');
  const submitButton = document.getElementById('submit-answer');
  const popoverContainer = document.getElementById('popover-container');
  const nextQuestionButton = document.getElementById('next-question');

  let questions = [];
  let currentQuestionIndex = 0;
  let attemptCount = 0;

  // Load questions from JSON file
  axios.get('questions.json')
    .then(function (response) {
      questions = response.data;
      showQuestion();
    })
    .catch(function (error) {
      console.error(error);
    });

  // Display the current question
  function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    // Generate options
    for (const option of currentQuestion.options) {
      const optionElement = document.createElement('div');
      optionElement.className = 'form-check';
      optionElement.innerHTML = `
        <input class="form-check-input" type="radio" name="answer" value="${option.letter}">
        <label class="form-check-label">
          ${option.letter}) ${option.text}
        </label>
      `;
      optionsContainer.appendChild(optionElement);
    }
  }

  // Show explanation popover
  function showExplanation(explanation, isCorrect) {
    popoverContainer.innerHTML = `
      <h3 class="${isCorrect ? 'text-success' : 'text-danger'}">${isCorrect ? 'Correct!' : 'Incorrect!'}</h3>
      <p>${explanation}</p>
      <button id="continue-button" class="btn btn-primary btn-sm">Continue</button>
    `;
    popoverContainer.classList.add('show');

    const continueButton = document.getElementById('continue-button');
    continueButton.addEventListener('click', function () {
      popoverContainer.classList.remove('show');
      nextQuestion();
    });

    if (isCorrect) {
      questionContainer.classList.add('confetti');
      setTimeout(function () {
        questionContainer.classList.remove('confetti');
      }, 3000);
    }
  }

  // Validate the selected answer
  submitButton.addEventListener('click', function () {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (selectedOption) {
      const selectedAnswer = selectedOption.value;
      const currentQuestion = questions[currentQuestionIndex];

      if (selectedAnswer === currentQuestion.answer) {
        showExplanation(currentQuestion.explanation, true);
        submitButton.classList.add('btn-lg');
      } else {
        showExplanation(currentQuestion.explanation, false);
        submitButton.disabled = true;
        nextQuestionButton.classList.add('btn-lg');
      }
      attemptCount++;
    } else {
      alert('Please select an answer.');
    }
  });

  // Load the next question
  function nextQuestion() {
    currentQuestionIndex++;
    attemptCount = 0;

    if (currentQuestionIndex < questions.length) {
      showQuestion();
      submitButton.disabled = false;
      submitButton.classList.remove('btn-lg');
      nextQuestionButton.classList.remove('btn-lg');
    } else {
      questionContainer.style.display = 'none';
      nextQuestionButton.style.display = 'none';
      alert('Quiz completed!');
    }
  }

  nextQuestionButton.addEventListener('click', nextQuestion);
});
