import { bubbleSort, binarySearch, breadthFirstSearch } from '../algorithms/sorting.js';

/**
 * Draws bars for the given data array.
 * @param {number[]} data - Array of numbers to visualize.
 * @param {number[]} [highlight=[]] - Indices to highlight.
 * @param {string} [highlightType='active'] - Type of highlight ('active', 'range', 'found').
 */
function drawBars(data, highlight = [], highlightType = 'active') {
  const container = document.getElementById('visualizer');
  container.innerHTML = '';
  container.className = 'bars-mode';
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

/**
 * Draws a binary tree visualization.
 * @param {number[]} data - Array representing tree in level-order.
 * @param {number[]} [highlight=[]] - Indices to highlight.
 * @param {string} [highlightType='active'] - Type of highlight.
 */
function drawTree(data, highlight = [], highlightType = 'active') {
  const container = document.getElementById('visualizer');
  container.innerHTML = '';
  container.className = 'tree-mode';

  if (!Array.isArray(data) || data.length === 0) return;

  // Calculate tree levels
  const levels = Math.ceil(Math.log2(data.length + 1));
  const treeDiv = document.createElement('div');
  treeDiv.className = 'tree';

  for (let level = 0; level < levels; level++) {
    const levelDiv = document.createElement('div');
    levelDiv.className = 'tree-level';
    levelDiv.style.marginBottom = '40px';

    const startIndex = Math.pow(2, level) - 1;
    const endIndex = Math.min(startIndex + Math.pow(2, level), data.length);

    for (let i = startIndex; i < endIndex; i++) {
      if (data[i] !== null && data[i] !== undefined) {
        const node = document.createElement('div');
        node.className = 'tree-node';
        node.textContent = data[i];
        node.setAttribute('data-index', i);

        if (highlight.includes(i)) {
          node.classList.add(highlightType);
        }

        levelDiv.appendChild(node);
      } else {
        // Empty placeholder for null nodes
        const placeholder = document.createElement('div');
        placeholder.className = 'tree-node empty';
        levelDiv.appendChild(placeholder);
      }
    }

    treeDiv.appendChild(levelDiv);
  }

  container.appendChild(treeDiv);
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

async function runBFS() {
  const input = document.getElementById('input').value;
  const target = document.getElementById('bfsTarget').value;
  let array = input.split(',').map(Number);

  // Show initial tree
  drawTree(array);

  await new Promise(r => setTimeout(r, 1000)); // Pause before starting BFS

  const targetNum = target ? parseInt(target) : null;
  const gen = breadthFirstSearch(array, targetNum);
  let step = gen.next();

  while (!step.done) {
    const { type, index, indices, value, level, traversal, found } = step.value;

    if (type === 'queue') {
      // Highlight nodes currently in queue
      drawTree(array, indices, 'queue');
    } else if (type === 'visit') {
      // Highlight currently visiting node
      drawTree(array, [index], 'active');
    } else if (type === 'found') {
      // Highlight found target
      drawTree(array, [index], 'found');
      alert(`Found target ${value} at position ${index}!`);
      break;
    } else if (type === 'complete') {
      // Show completion
      drawTree(array);
      const traversalText = `BFS Traversal: ${traversal.join(' → ')}`;
      if (targetNum !== null && !found) {
        alert(`${traversalText}\nTarget ${targetNum} not found in tree!`);
      } else if (targetNum === null) {
        alert(`${traversalText}\nBFS traversal complete!`);
      }
      break;
    }

    await new Promise(r => setTimeout(r, 1000));
    step = gen.next();
  }
}

window.runSort = runSort;
window.runBinarySearch = runBinarySearch;
window.runBFS = runBFS;

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the DOM is fully loaded before running the script
  const runButton = document.getElementById('runButton');
  const binarySearchButton = document.getElementById('binarySearchButton');
  const bfsButton = document.getElementById('bfsButton');

  if (runButton) {
    runButton.addEventListener('click', runSort);
  }

  if (binarySearchButton) {
    binarySearchButton.addEventListener('click', runBinarySearch);
  }

  if (bfsButton) {
    bfsButton.addEventListener('click', runBFS);
  }
});