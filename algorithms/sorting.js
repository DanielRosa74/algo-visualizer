/**
 * Bubble Sort generator.
 * Yields objects of the form:
 *   { type: 'compare', indices: [i, j] }
 *   { type: 'swap', indices: [i, j], array: [current array state] }
 * @param {number[]} arr - Array to sort
 * @yields {{type: string, indices: number[], array?: number[]}}
 */
export function* bubbleSort(arr) {
  const steps = [...arr];
  for (let i = 0; i < steps.length; i++) {
    for (let j = 0; j < steps.length - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] };
      if (steps[j] > steps[j + 1]) {
        [steps[j], steps[j + 1]] = [steps[j + 1], steps[j]];
        yield { type: 'swap', indices: [j, j + 1], array: [...steps] };
      }
    }
  }
}

/**
 * Binary Search generator.
 * Requires a sorted array to work properly.
 * Yields objects of the form:
 *   { type: 'compare', indices: [mid], target: number, found: boolean }
 *   { type: 'range', indices: [left, right], target: number }
 *   { type: 'found', indices: [foundIndex], target: number } (if found)
 *   { type: 'not-found', target: number } (if not found)
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @yields {{type: string, indices: number[], target: number, found?: boolean}}
 */
export function* binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Show current search range
    yield { type: 'range', indices: [left, right], target };

    const mid = Math.floor((left + right) / 2);

    // Show comparison at mid point
    yield { type: 'compare', indices: [mid], target, found: false };

    if (arr[mid] === target) {
      // Found the target
      yield { type: 'found', indices: [mid], target };
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Target not found
  yield { type: 'not-found', target };
  return -1;
}

/**
 * Tree Node class for BFS visualization
 */
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.index = null; // For visualization purposes
  }
}

/**
 * Creates a binary tree from an array (level-order)
 * @param {number[]} arr - Array to convert to tree
 * @returns {TreeNode|null} - Root of the tree
 */
function createBinaryTree(arr) {
  if (!arr || arr.length === 0) return null;

  const root = new TreeNode(arr[0]);
  root.index = 0;
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();

    // Add left child
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i]);
      node.left.index = i;
      queue.push(node.left);
    }
    i++;

    // Add right child
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i]);
      node.right.index = i;
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

/**
 * Breadth-First Search generator for binary tree.
 * Yields objects of the form:
 *   { type: 'visit', index: number, value: number, level: number }
 *   { type: 'queue', indices: number[] } (current queue state)
 *   { type: 'found', index: number, value: number } (if searching for target)
 *   { type: 'complete', traversal: number[] } (final traversal order)
 * @param {number[]} arr - Array representing tree in level-order
 * @param {number} [target] - Optional target value to search for
 * @yields {{type: string, index?: number, indices?: number[], value?: number, level?: number, traversal?: number[], found?: boolean}}
 */
export function* breadthFirstSearch(arr, target = null) {
  if (!arr || arr.length === 0) return;

  const root = createBinaryTree(arr);
  if (!root) return;

  const queue = [{ node: root, level: 0 }];
  const traversal = [];
  let found = false;

  while (queue.length > 0) {
    // Show current queue state
    const queueIndices = queue.map(item => item.node.index);
    yield { type: 'queue', indices: queueIndices };

    const { node, level } = queue.shift();

    // Visit current node
    yield { type: 'visit', index: node.index, value: node.value, level };
    traversal.push(node.value);

    // Check if this is the target we're searching for
    if (target !== null && node.value === target) {
      yield { type: 'found', index: node.index, value: node.value };
      found = true;
    }

    // Add children to queue
    if (node.left) {
      queue.push({ node: node.left, level: level + 1 });
    }
    if (node.right) {
      queue.push({ node: node.right, level: level + 1 });
    }
  }

  // Show final traversal
  yield { type: 'complete', traversal, found: target !== null ? found : undefined };
}