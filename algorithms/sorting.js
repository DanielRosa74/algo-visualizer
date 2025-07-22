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