
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer, correctScore = count = 0, totalQuestion = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListener();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
})

//event listener
function eventListener() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

async function loadQuestion() {

    const APIurl = 'https://opentdb.com/api.php?amount=1&type=multiple&difficulty=easy';
    const result = await fetch(`${APIurl}`);
    const data = await result.json();
    // console.log(data.results[0]);
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// display the question
function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;

    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    // inserting the correct answer randomly into four options in the option list
    _question.innerHTML = `${data.question} <br> <span class = "category">${data.category} </span>`;
    _options.innerHTML = ` 
          ${optionsList.map(mapping).join('')}
     `;

    selectOption();
}
function mapping(option, index) {
    return `<li> ${index + 1}. <span>${option}</span></li>`;
}

// selecting a option
function selectOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if (_options.querySelector('.selected')) {
                const active = _options.querySelector('.selected');
                active.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
    console.log(correctAnswer);
}

// answer checking
function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAns = _options.querySelector('.selected span').textContent;
        if (selectedAns == HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p> <i class = "fas fa-check"></i>Correct Answer! </p>`;
        }
        else {
            _result.innerHTML = `<p> <i class = "fas fa-times"></i> Incorrect Answer! <small><b>Correct Answer: </b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    }
    else{
          _result.innerHTML = `<p><i class = "fas fa-question"></i> Please select an option! </p>`;
          _checkBtn.disabled = false;        
    }
}

// to convert html entities into normal text of correct answer if any
function HTMLDecode(textstring) {
    let doc = new DOMParser().parseFromString(textstring, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    count++;
    setCount();
    if (count == totalQuestion) {
        _result.innerHTML = `<p> Your Score is ${correctScore}. </p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}
function restartQuiz(){
    correctScore = count = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}