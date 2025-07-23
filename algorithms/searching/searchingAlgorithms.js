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
  // Pre-sort the array and keep track of original indices
  const arrWithIndex = arr.map((value, idx) => ({ value, idx }));
  arrWithIndex.sort((a, b) => a.value - b.value);
  const sortedArr = arrWithIndex.map(obj => obj.value);
  if (!Array.isArray(arr) || arr.length === 0) {
    yield { type: 'error', message: 'Array must not be empty.' };
    return -1;
  }

  const n = sortedArr.length;
  const stepSize = Math.floor(Math.sqrt(n));
  let prev = 0;
  let step = stepSize;

  // Find the block where the target may be present
  while (prev < n && sortedArr[Math.min(step, n) - 1] < target) {
    yield { type: 'compare', indices: [arrWithIndex[Math.min(step, n) - 1].idx], target, found: false };
    prev = step;
    step += stepSize;
    if (prev >= n) {
      yield { type: 'not-found', target };
      return -1;
    }
  }

  // Linear search within the block
  for (let i = prev; i < Math.min(step, n); i++) {
    yield { type: 'compare', indices: [arrWithIndex[i].idx], target, found: false };
    if (sortedArr[i] === target) {
      yield { type: 'found', indices: [arrWithIndex[i].idx], target };
      return arrWithIndex[i].idx;
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
  // Pre-sort the array and keep track of original indices
  const arrWithIndex = arr.map((value, idx) => ({ value, idx }));
  arrWithIndex.sort((a, b) => a.value - b.value);
  const sortedArr = arrWithIndex.map(obj => obj.value);
  if (!Array.isArray(arr) || arr.length === 0) {
    yield { type: 'error', message: 'Array must not be empty.' };
    return -1;
  }

  let low = 0;
  let high = sortedArr.length - 1;
  let lastPos = -1;

  while (low <= high && target >= sortedArr[low] && target <= sortedArr[high]) {
    if (sortedArr[high] === sortedArr[low]) {
      if (sortedArr[low] === target) {
        yield { type: 'found', indices: [arrWithIndex[low].idx], target };
        return arrWithIndex[low].idx;
      } else {
        yield { type: 'not-found', target };
        return -1;
      }
    }

    const pos = low + Math.floor(((high - low) / (sortedArr[high] - sortedArr[low])) * (target - sortedArr[low]));

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

    yield { type: 'compare', indices: [arrWithIndex[pos].idx], target, found: false };

    if (sortedArr[pos] === target) {
      yield { type: 'found', indices: [arrWithIndex[pos].idx], target };
      return arrWithIndex[pos].idx;
    }

    if (sortedArr[pos] < target) {
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
  // Pre-sort the array and keep track of original indices
  const arrWithIndex = arr.map((value, idx) => ({ value, idx }));
  arrWithIndex.sort((a, b) => a.value - b.value);
  const sortedArr = arrWithIndex.map(obj => obj.value);
  if (!Array.isArray(arr) || arr.length === 0) {
    yield { type: 'error', message: 'Array must not be empty.' };
    return -1;
  }

  if (sortedArr[0] === target) {
    yield { type: 'found', indices: [arrWithIndex[0].idx], target };
    return arrWithIndex[0].idx;
  }

  let i = 1;
  // Find range for binary search by repeated doubling
  while (i < sortedArr.length && sortedArr[i] < target) {
    yield { type: 'compare', indices: [arrWithIndex[i].idx], target, found: false };
    i *= 2;
  }

  const low = Math.floor(i / 2);
  const high = Math.min(i, sortedArr.length - 1);

  for (let j = low; j <= high; j++) {
    yield { type: 'compare', indices: [arrWithIndex[j].idx], target, found: false };
    if (sortedArr[j] === target) {
      yield { type: 'found', indices: [arrWithIndex[j].idx], target };
      return arrWithIndex[j].idx;
    }
  }

  yield { type: 'not-found', target };
  return -1;
}
