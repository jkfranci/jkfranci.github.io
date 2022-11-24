const timesTo = 12;
const table = document.querySelector('#answer-table');
const question = document.querySelector('#question');
const message = document.querySelector('#message');
const rightScore = document.querySelector('#right');
const wrongScore = document.querySelector('#wrong');
const time = document.querySelector('#time');
const restart = document.querySelector('#restart');

let timer = null;
let right = 0;
let wrong = 0;
let answer = null;

let startTime;
const endTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const elapsed = () => {
  endTime = performance.now();
  const timeDiff = endTime - startTime;
  const seconds = Math.round(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  time.innerHTML =
    minutes + " minutes " + (seconds % 60) + " seconds";
}

const startTimer = () => {
  endTimer();
  startTime = performance.now();
  timer = setInterval(elapsed, 1000);
};

const printScore = () => {
  rightScore.innerHTML = right;
  wrongScore.innerHTML = wrong;
};

const clickAnswer = (e) => {
  const value = parseInt(e.target.getAttribute('data-value'), 10);

  if (answer === value) {
    question.classList.add('blink_correct');
    setTimeout(() => { question.classList.remove('blink_correct'); }, 500);
    right++;
    askQuestion();
  } else {
    question.classList.add('blink_wrong');
    setTimeout(() => { question.classList.remove('blink_wrong'); }, 500);
    wrong++;
  }

  printScore();
};

const createAnswerBoard = () => {
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement('tr');

    for (let j = 0; j < 10; j++) {
      const td = document.createElement('td');
      const value = i * 10 + j;
      td.classList.add('answer-number');
      td.setAttribute('data-value', value);
      td.innerHTML = value;

      td.addEventListener("click", clickAnswer)

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
};

const askQuestion = () => {
  const i = Math.floor(Math.random() * 10);
  const j = Math.floor(Math.random() * 10);

  answer = i * j;

  question.innerHTML = i + ' X ' + j + ' = ?';
};

const startChallenge = () => {
  right = 0;
  wrong = 0;
  startTimer();
  askQuestion();
  printScore();
};

const main = () => {
  console.log('Challenge');

  createAnswerBoard();

  restart.addEventListener("click", startChallenge);
};
