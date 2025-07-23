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
 * Linear Search generator.
 * Yields objects of the form:
 *   { type: 'compare', indices: [i], target: number, found: boolean }
 *   { type: 'found', indices: [i], target: number } (if found)
 *   { type: 'not-found', target: number } (if not found)
 * @param {number[]} arr - Array to search in
 * @param {number} target - Value to search for
 * @yields {{type: string, indices: number[], target: number, found?: boolean}}
 */
export function* linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    yield { type: 'compare', indices: [i], target, found: false };
    if (arr[i] === target) {
      yield { type: 'found', indices: [i], target };
      return i;
    }
  }
  yield { type: 'not-found', target };
  return -1;
}

/**
 * Jump Search generator.
 * Works on sorted arrays.
 * Yields objects of the form:
 *   { type: 'compare', indices: [i], target: number, found: boolean }
 *   { type: 'found', indices: [i], target: number } (if found)
 *   { type: 'not-found', target: number } (if not found)
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @yields {{type: string, indices: number[], target: number, found?: boolean}}
 */
export function* jumpSearch(arr, target) {
  // Check if array is sorted
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      alert('Jump Search requires a sorted array. Please sort the array first.');
      yield { type: 'error', message: 'Array must be sorted for Jump Search.' };
      return -1;
    }
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    yield { type: 'error', message: 'Array must not be empty.' };
    return -1;
  }

  const n = arr.length;
  const stepSize = Math.floor(Math.sqrt(n));
  let prev = 0;
  let step = stepSize;

  // Find the block where the target may be present
  while (prev < n && arr[Math.min(step, n) - 1] < target) {
    yield { type: 'compare', indices: [Math.min(step, n) - 1], target, found: false };
    prev = step;
    step += stepSize;
    if (prev >= n) {
      yield { type: 'not-found', target };
      return -1;
    }
  }

  // Linear search within the block
  for (let i = prev; i < Math.min(step, n); i++) {
    yield { type: 'compare', indices: [i], target, found: false };
    if (arr[i] === target) {
      yield { type: 'found', indices: [i], target };
      return i;
    }
  }

  yield { type: 'not-found', target };
  return -1;
}

/**
 * Interpolation Search generator.
 * Works on sorted and uniformly distributed arrays.
 * Yields objects of the form:
 *   { type: 'compare', indices: [pos], target: number, found: boolean }
 *   { type: 'found', indices: [pos], target: number } (if found)
 *   { type: 'not-found', target: number } (if not found)
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @yields {{type: string, indices: number[], target: number, found?: boolean}}
 */
export function* interpolationSearch(arr, target) {
  // Check if array is sorted
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      alert('Interpolation Search requires a sorted array. Please sort the array first.');
      yield { type: 'error', message: 'Array must be sorted for Interpolation Search.' };
      return -1;
    }
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    yield { type: 'error', message: 'Array must not be empty.' };
    return -1;
  }

  let low = 0;
  let high = arr.length - 1;
  let lastPos = -1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (arr[high] === arr[low]) {
      if (arr[low] === target) {
        yield { type: 'found', indices: [low], target };
        return low;
      } else {
        yield { type: 'not-found', target };
        return -1;
      }
    }

    const pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));

    // Prevent infinite loop if pos does not change
    if (pos === lastPos) {
      yield { type: 'not-found', target };
      return -1;
    }
    lastPos = pos;

    if (pos < low || pos > high) {
      yield { type: 'not-found', target };
      return -1;
    }

    yield { type: 'compare', indices: [pos], target, found: false };

    if (arr[pos] === target) {
      yield { type: 'found', indices: [pos], target };
      return pos;
    }

    if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }

  yield { type: 'not-found', target };
  return -1;
}

/**
 * Exponential Search generator.
 * Works on sorted arrays.
 * Yields objects of the form:
 *   { type: 'compare', indices: [i], target: number, found: boolean }
 *   { type: 'found', indices: [i], target: number } (if found)
 *   { type: 'not-found', target: number } (if not found)
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @yields {{type: string, indices: number[], target: number, found?: boolean}}
 */
export function* exponentialSearch(arr, target) {
  // Check if array is sorted
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      alert('Exponential Search requires a sorted array. Please sort the array first.');
      yield { type: 'error', message: 'Array must be sorted for Exponential Search.' };
      return -1;
    }
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    yield { type: 'error', message: 'Array must not be empty.' };
    return -1;
  }

  if (arr[0] === target) {
    yield { type: 'found', indices: [0], target };
    return 0;
  }

  let i = 1;
  // Find range for binary search by repeated doubling
  while (i < arr.length && arr[i] < target) {
    yield { type: 'compare', indices: [i], target, found: false };
    i *= 2;
  }

  const low = Math.floor(i / 2);
  const high = Math.min(i, arr.length - 1);

  for (let j = low; j <= high; j++) {
    yield { type: 'compare', indices: [j], target, found: false };
    if (arr[j] === target) {
      yield { type: 'found', indices: [j], target };
      return j;
    }
  }

  yield { type: 'not-found', target };
  return -1;
}
