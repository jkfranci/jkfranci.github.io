const timesTo = 12;
const tt = document.querySelector('#times-table');
const numpad = document.querySelector('#numpad');
const answer = document.querySelector('#answer');
const question = document.querySelector('#question');
const message = document.querySelector('#message');
const time = document.querySelector('#time');

let matrix = [];
let timer = null;
let testI = 0;
let testJ = 0;

const setActiveTest = (i) => {
  const atds = tt.querySelectorAll(`td[testing=true]`);
  for (const td of atds) {
    td.removeAttribute('testing');
  }

  const tds = tt.querySelectorAll(
     `td[data-row="${i}"],td[data-col="${i}"]`);
  for (const td of tds) {
    td.setAttribute('testing', 'true');
  }
};

const setActiveCell = (i, j) => {
  const atds = tt.querySelectorAll(`td[testing-active=true]`);
  for (const td of atds) {
    td.removeAttribute('testing-active');
  }

  const tds = tt.querySelectorAll(
     `td[data-row="${i}"][data-col="${j}"],` +
     `td[data-row="${j}"][data-col="${i}"]`);

  for (const td of tds) {
    td.setAttribute('testing-active', 'true');
  }
};

const getVal = (i, j) => {
  return i * j;
}

const setVal = (i, j) => {
  const td = tt.querySelector(
      `[data-row="${i}"][data-col="${j}"]`
  );
  td.innerHTML = getVal(i, j);
}

const resetVals = () => {
  for (let i = 1; i <= timesTo; i++) {
    for (let j = 1; j <= timesTo; j++) {
      setVal(i, j);
    }
  }
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
};

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

const keyHandleClick = (e) => {
  const num = e.target.getAttribute('data-val');
  if (answer.textContent.length >= 3) {
    return;
  }

  answer.innerHTML += num;
}

const corHandleClick = (e) => {
  if (answer.textContent.length == 0) {
    return;
  }

  answer.innerHTML = answer.textContent.slice(0, -1);
}

const renderTest = () => {
  for (let i = 1; i <= timesTo; i++) {
    matrix[i - 1][testI - 1].innerHTML = '?';
    matrix[testI - 1][i - 1].innerHTML = '?';
  }

  for (let i = 1; i < testJ; i++) {
    matrix[i - 1][testI - 1].innerHTML = i * testI;
    matrix[testI - 1][i - 1].innerHTML = i * testI;
  }

  setActiveCell(testI, testJ);

  question.innerHTML = `${testI} X ${testJ} = ?`;
};

const nextQuestion = () => {
  if (testJ == timesTo) {
    endTimer();
    matrix[testJ - 1][testI - 1].innerHTML = testJ * testI;
    matrix[testI - 1][testJ - 1].innerHTML = testJ * testI;
    message.innerHTML = `DONE`
    question.innerHTML = `DONE ${testI}!`
    return;
  }

  testJ += 1;

  renderTest();
};

const startTest = (e) => {
  const test = e.target.getAttribute('data-start');

  testI = test;
  testJ = 2;

  resetVals();
  setActiveTest(testI);
  renderTest();

  startTimer();
};

const okHandleClick = (e) => {
  const a = getAnswer();

  console.log('Checking', a, 'with', testI, testJ);
  if (a == 0) {
    return;
  }

  if (!testI || !testJ) {
    return;
  }

  const ans = testI * testJ;

  if (ans != a) {
    message.innerHTML = a + ' is not correct!';
    clearAnswer();
    return;
  }

  message.innerHTML = a + ' correct!';
  clearAnswer();

  nextQuestion();
}

const getAnswer = () => {
  if (answer.textContent == '') {
    return 0;
  }

  return parseInt(answer.textContent, 10);
}

const clearAnswer = () => {
  answer.innerHTML = '';
}

const main = () => {
  console.log('Times Table');


  for (let i = 1; i <= timesTo; i++) {
    const tr = document.createElement('tr');
    let row = [];

    if (i >= 2) {
      const start = document.createElement('td');
      start.setAttribute('data-start', i);
      start.innerHTML = 'start';
      tr.appendChild(start);
      start.addEventListener('click', startTest);
    } else {
      const nada = document.createElement('td');
      tr.appendChild(nada);
    }

    for (let j = 1; j <= timesTo; j++) {
      const td = document.createElement('td');
      td.setAttribute('data-row', i);
      td.setAttribute('data-col', j);

      row.push(td);
      tr.appendChild(td);
    }

    matrix.push(row);
    tt.appendChild(tr);
  }

  const bs = numpad.querySelectorAll('button[data-val]');
  for (const b of bs) {
    b.addEventListener('click', keyHandleClick);
  }

  const cor = numpad.querySelector('button#COR');
    cor.addEventListener('click', corHandleClick);

  const ok = numpad.querySelector('button#OK');
    ok.addEventListener('click', okHandleClick);

  resetVals();
};
