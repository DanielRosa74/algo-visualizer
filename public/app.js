import { bubbleSort, selectionSort, binarySearch, breadthFirstSearch, depthFirstSearch } from '../algorithms/sorting.js';

/**
 * Shows the appropriate color guide for the given algorithm type
 */
function showColorGuide(algorithmType) {
  // Hide all color guides first
  document.getElementById('sortingGuide').style.display = 'none';
  document.getElementById('searchGuide').style.display = 'none';
  document.getElementById('traversalGuide').style.display = 'none';

  // Show the relevant guide
  const guideElement = document.getElementById(algorithmType + 'Guide');
  if (guideElement) {
    guideElement.style.display = 'block';
  }
}

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
  showColorGuide('sorting'); // Show sorting color guide
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

async function runSelectionSort() {
  showColorGuide('sorting'); // Show sorting color guide
  const input = document.getElementById('input').value;
  const array = input.split(',').map(Number);
  const gen = selectionSort(array);
  let step = gen.next();
  let currentArray = [...array]; // Keep track of the current array state

  while (!step.done) {
    const { type, indices, array: arrSnapshot, minIndex } = step.value;

    if (type === 'sorting') {
      // Highlight the position currently being sorted
      drawBars(currentArray, indices, 'sorting');
    } else if (type === 'compare') {
      // Highlight elements being compared
      drawBars(currentArray, indices, 'active');
    } else if (type === 'newMin') {
      // Highlight new minimum found
      drawBars(currentArray, indices, 'newMin');
    } else if (type === 'swap') {
      currentArray = [...arrSnapshot]; // Update our tracked array
      drawBars(currentArray, indices, 'active');
    } else if (type === 'sorted') {
      // Highlight sorted position
      drawBars(currentArray, indices, 'sorted');
    }

    await new Promise(r => setTimeout(r, 400)); // Slightly slower for better visualization
    step = gen.next();
  }
  drawBars(currentArray, [], 'complete'); // Show final sorted array
}

async function runBinarySearch() {
  showColorGuide('search'); // Show search color guide
  const inputElement = document.getElementById('input');
  const targetElement = document.getElementById('target');

  if (!inputElement || !targetElement) {
    alert('Required elements not found');
    return;
  }

  const input = (inputElement).value;
  const target = parseInt((targetElement).value);
  let array = input.split(',').map(Number);

  // Sort the array first for binary search
  array.sort((a, b) => a - b);
  drawBars(array); // Show sorted array

  await new Promise(r => setTimeout(r, 1000)); // Pause before starting search

  const gen = binarySearch(array, target);
  let step = gen.next();

  while (!step.done) {
    const { type, indices, target: searchTarget } = step.value;

    if (type === 'range' && indices) {
      // Highlight the current search range
      const rangeIndices = [];
      for (let i = indices[0]; i <= indices[1]; i++) {
        rangeIndices.push(i);
      }
      drawBars(array, rangeIndices, 'range');
    } else if (type === 'compare' && indices) {
      // Highlight the middle element being compared
      drawBars(array, indices, 'active');
    } else if (type === 'found' && indices) {
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
  showColorGuide('traversal'); // Show traversal color guide
  const inputElement = document.getElementById('input');
  const targetElement = document.getElementById('bfsTarget');

  if (!inputElement || !targetElement) {
    alert('Required elements not found');
    return;
  }

  const input = (inputElement).value;
  const target = (targetElement).value;
  let array = input.split(',').map(Number);

  // Show initial tree
  drawTree(array);

  await new Promise(r => setTimeout(r, 1000)); // Pause before starting BFS

  const targetNum = target ? parseInt(target) : undefined;
  const gen = breadthFirstSearch(array, targetNum);
  let step = gen.next();

  while (!step.done) {
    const { type, index, indices, value, level, traversal, found } = step.value;

    if (type === 'queue' && indices) {
      // Highlight nodes currently in queue
      drawTree(array, indices, 'queue');
    } else if (type === 'visit' && typeof index === 'number') {
      // Highlight currently visiting node
      drawTree(array, [index], 'active');
    } else if (type === 'found' && typeof index === 'number') {
      // Highlight found target
      drawTree(array, [index], 'found');
      alert(`Found target ${value} at position ${index}!`);
      break;
    } else if (type === 'complete') {
      // Show completion
      drawTree(array);
      const traversalText = `BFS Traversal: ${traversal ? traversal.join(' → ') : ''}`;
      if (targetNum !== undefined && !found) {
        alert(`${traversalText}\nTarget ${targetNum} not found in tree!`);
      } else if (targetNum === undefined) {
        alert(`${traversalText}\nBFS traversal complete!`);
      }
      break;
    }

    await new Promise(r => setTimeout(r, 1000));
    step = gen.next();
  }
}

async function runDFS() {
  showColorGuide('traversal'); // Show traversal color guide
  const inputElement = document.getElementById('input');
  const targetElement = document.getElementById('dfsTarget');
  const orderElement = document.getElementById('dfsOrder');

  if (!inputElement || !targetElement || !orderElement) {
    alert('Required elements not found');
    return;
  }

  const input = (inputElement).value;
  const target = (targetElement).value;
  const order = (orderElement).value || 'preorder';
  let array = input.split(',').map(Number);

  // Show initial tree
  drawTree(array);

  await new Promise(r => setTimeout(r, 1000)); // Pause before starting DFS

  const targetNum = target ? parseInt(target) : undefined;
  const gen = depthFirstSearch(array, targetNum, order);
  let step = gen.next();

  while (!step.done) {
    const { type, index, indices, value, level, traversal, found } = step.value;

    if (type === 'stack' && indices) {
      // Highlight nodes currently in stack (path from root to current)
      drawTree(array, indices, 'stack');
    } else if (type === 'visit' && typeof index === 'number') {
      // Highlight currently visiting node
      drawTree(array, [index], 'active');
    } else if (type === 'found' && typeof index === 'number') {
      // Highlight found target
      drawTree(array, [index], 'found');
      alert(`Found target ${value} at position ${index} using ${order} DFS!`);
      break;
    } else if (type === 'backtrack' && typeof index === 'number') {
      // Show backtracking with a different color
      drawTree(array, [index], 'backtrack');
    } else if (type === 'complete') {
      // Show completion
      drawTree(array);
      const traversalText = `DFS (${order}) Traversal: ${traversal ? traversal.join(' → ') : ''}`;
      if (targetNum !== undefined && !found) {
        alert(`${traversalText}\nTarget ${targetNum} not found in tree!`);
      } else if (targetNum === undefined) {
        alert(`${traversalText}\nDFS traversal complete!`);
      }
      break;
    }

    await new Promise(r => setTimeout(r, 1200)); // Slightly slower for DFS to show backtracking
    step = gen.next();
  }
}

// Make functions available globally - bypass TypeScript by casting to any
window.runSort = runSort;
window.runSelectionSort = runSelectionSort;
window.runBinarySearch = runBinarySearch;
window.runBFS = runBFS;
window.runDFS = runDFS;

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the DOM is fully loaded before running the script
  const runButton = document.getElementById('runButton');
  const selectionSortButton = document.getElementById('selectionSortButton');
  const binarySearchButton = document.getElementById('binarySearchButton');
  const bfsButton = document.getElementById('bfsButton');
  const dfsButton = document.getElementById('dfsButton');

  if (runButton) {
    runButton.addEventListener('click', runSort);
  }

  if (selectionSortButton) {
    selectionSortButton.addEventListener('click', runSelectionSort);
  }

  if (binarySearchButton) {
    binarySearchButton.addEventListener('click', runBinarySearch);
  }

  if (bfsButton) {
    bfsButton.addEventListener('click', runBFS);
  }

  if (dfsButton) {
    dfsButton.addEventListener('click', runDFS);
  }
});