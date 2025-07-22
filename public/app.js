import { bubbleSort } from '../algorithms/sorting.js';

/**
 * Draws bars for the given data array.
 * @param {number[]} data - Array of numbers to visualize.
 * @param {number[]} [highlight=[]] - Indices to highlight.
 */
function drawBars(data, highlight = []) {
  const container = document.getElementById('visualizer');
  container.innerHTML = '';
  if (!Array.isArray(data)) return; // Prevent TypeError if data is undefined
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
  let currentArray = [...array]; // Keep track of the current array state

  while (!step.done) {
    const { type, indices, array: arrSnapshot } = step.value;

    if (type === 'compare') {
      drawBars(currentArray, indices);
    } else if (type === 'swap') {
      currentArray = [...arrSnapshot]; // Update our tracked array
      drawBars(currentArray, indices);
    }

    await new Promise(r => setTimeout(r, 300));
    step = gen.next();
  }
  drawBars(currentArray); // Use the final state we've been tracking
}

window.runSort = runSort;

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the DOM is fully loaded before running the script
  const runButton = document.getElementById('runButton');
  if (runButton) {
    runButton.addEventListener('click', runSort);
  }
});