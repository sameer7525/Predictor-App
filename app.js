const periodEl = document.getElementById('period');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const resultPeriodEl = document.getElementById('resultPeriod');
const historyEl = document.getElementById('history');
const playBtn = document.getElementById('playBtn');

let running = false;
let lastPeriod = null;
let loopId = null;
let history = [];

const BASE_OFFSET = 9672;
const FIX_CODE = "1000";

function getPeriodNumber(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  const datePart = `${y}${m}${d}`;

  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  const serial = minuteOfDay + BASE_OFFSET;
  const serialPart = String(serial).padStart(5, '0');

  return `${datePart}${FIX_CODE}${serialPart}`;
}


function shortPeriod(period) {
  return '...' + period.slice(-5);
}


function getSecondsLeft(date) {
  return 59 - date.getSeconds();
}

function updateTimer(secondsLeft) {
  timerEl.textContent = secondsLeft;
  timerEl.classList.toggle('danger', secondsLeft <= 10);
}

function getRandomResult(periodNumber) {
  let seed = 0;
  for (let ch of periodNumber) seed += ch.charCodeAt(0);
  const random = Math.random() + (seed % 10) / 10;
  return random > 0.6 ? 'BIG' : 'SMALL';
}



function showResult(period, result) {
  resultPeriodEl.textContent = shortPeriod(period);
  resultEl.textContent = result;
  resultEl.classList.remove('big', 'small');
  resultEl.classList.add(result.toLowerCase());

  history.unshift({ period, result });
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  historyEl.innerHTML = history
    .map(entry => `
      <span class="history-item ${entry.result.toLowerCase()}">
        <span class="h-period">${shortPeriod(entry.period)}</span>
        <span class="h-result">${entry.result}</span>
      </span>
    `)
    .join('');
}


function tick() {
  if (!running) return;

  const now = new Date();
  const period = getPeriodNumber(now);
  const secondsLeft = getSecondsLeft(now);
  updateTimer(secondsLeft);

  if (lastPeriod === null) {
    
    periodEl.textContent = period;
    lastPeriod = period;
  } else if (period !== lastPeriod) {
    
    const result = getRandomResult(lastPeriod);
    showResult(lastPeriod, result);
    periodEl.textContent = period;
    lastPeriod = period;
  } else {
    periodEl.textContent = period;
  }

  loopId = setTimeout(tick, 200);
}

playBtn.addEventListener('click', () => {
  if (!running) {
    running = true;
    playBtn.textContent = 'Stop';
    tick();
  } else {
    running = false;
    playBtn.textContent = 'Play';
    clearTimeout(loopId);
  }
});