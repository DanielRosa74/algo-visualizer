import { bubbleSort, binarySearch } from '../algorithms/sorting.js';

/**
 * Draws bars for the given data array.
 * @param {number[]} data - Array of numbers to visualize.
 * @param {number[]} [highlight=[]] - Indices to highlight.
 * @param {string} [highlightType='active'] - Type of highlight ('active', 'range', 'found').
 */
function drawBars(data, highlight = [], highlightType = 'active') {
  const container = document.getElementById('visualizer');
  container.innerHTML = '';
  if (!Array.isArray(data)) return; // Prevent TypeError if data is undefined
  data.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = value * 3 + 'px';
    bar.textContent = value;
    if (highlight.includes(i)) {
      bar.classList.add(highlightType);
    }
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

async function runBinarySearch() {
  const input = document.getElementById('input').value;
  const target = parseInt(document.getElementById('target').value);
  let array = input.split(',').map(Number);

  // Sort the array first for binary search
  array.sort((a, b) => a - b);
  drawBars(array); // Show sorted array

  await new Promise(r => setTimeout(r, 1000)); // Pause before starting search

  const gen = binarySearch(array, target);
  let step = gen.next();

  while (!step.done) {
    const { type, indices, target: searchTarget } = step.value;

    if (type === 'range') {
      // Highlight the current search range
      const rangeIndices = [];
      for (let i = indices[0]; i <= indices[1]; i++) {
        rangeIndices.push(i);
      }
      drawBars(array, rangeIndices, 'range');
    } else if (type === 'compare') {
      // Highlight the middle element being compared
      drawBars(array, indices, 'active');
    } else if (type === 'found') {
      // Highlight the found element in green
      drawBars(array, indices, 'found');
      break;
    } else if (type === 'not-found') {
      // Clear highlighting
      drawBars(array);
      alert(`Target ${searchTarget} not found in the array!`);
      break;
    }

    await new Promise(r => setTimeout(r, 800));
    step = gen.next();
  }
}

window.runSort = runSort;
window.runBinarySearch = runBinarySearch;

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the DOM is fully loaded before running the script
  const runButton = document.getElementById('runButton');
  const binarySearchButton = document.getElementById('binarySearchButton');

  if (runButton) {
    runButton.addEventListener('click', runSort);
  }

  if (binarySearchButton) {
    binarySearchButton.addEventListener('click', runBinarySearch);
  }
});