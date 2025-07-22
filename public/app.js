import { bubbleSort } from '../algorithms/sorting.js';

function drawBars(data, highlight = []) {
  const container = document.getElementById('visualizer');
  container.innerHTML = '';
  data.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = value * 3 + 'px';
    bar.textContent = value;
    if (highlight.includes(i)) bar.classList.add('active');
    container.appendChild(bar);
  });
}

async function runSort() {
  const input = document.getElementById('input').value;
  const array = input.split(',').map(Number);
  const gen = bubbleSort(array);
  let step = gen.next();

  while (!step.done) {
    const { type, indices, array: arrSnapshot } = step.value;

    if (type === 'compare') drawBars(array, indices);
    else if (type === 'swap') drawBars(arrSnapshot, indices);

    await new Promise(r => setTimeout(r, 300));
    step = gen.next();
  }
  drawBars(array);
}

window.runSort = runSort;

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the DOM is fully loaded before running the script
  const runButton = document.getElementById('runButton');
  if (runButton) {
    runButton.addEventListener('click', runSort);
  }
});