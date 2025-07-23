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
 * Selection Sort generator.
 * Yields objects of the form:
 *   { type: 'compare', indices: [current, min] }
 *   { type: 'newMin', indices: [min], minIndex: number }
 *   { type: 'swap', indices: [i, minIndex], array: [current array state] }
 *   { type: 'sorted', indices: [i] } (when position i is finalized)
 * @param {number[]} arr - Array to sort
 * @yields {{type: string, indices: number[], array?: number[], minIndex?: number}}
 */
export function* selectionSort(arr) {
  const steps = [...arr];

  for (let i = 0; i < steps.length - 1; i++) {
    let minIndex = i;

    // Highlight the current position being filled
    yield { type: 'sorting', indices: [i] };

    // Find minimum element in remaining unsorted array
    for (let j = i + 1; j < steps.length; j++) {
      yield { type: 'compare', indices: [j, minIndex] };

      if (steps[j] < steps[minIndex]) {
        minIndex = j;
        yield { type: 'newMin', indices: [minIndex], minIndex };
      }
    }

    // Swap if minimum is not at current position
    if (minIndex !== i) {
      [steps[i], steps[minIndex]] = [steps[minIndex], steps[i]];
      yield { type: 'swap', indices: [i, minIndex], array: [...steps] };
    }

    // Mark position as sorted
    yield { type: 'sorted', indices: [i] };
  }

  // Mark the last element as sorted too
  yield { type: 'sorted', indices: [steps.length - 1] };
}

/**
 * Insertion Sort generator.
 * Yields objects of the form:
 *   { type: 'current', indices: [current] } - Current element being inserted
 *   { type: 'compare', indices: [j, j+1] } - Comparing elements
 *   { type: 'shift', indices: [j], array: [current array state] } - Shifting element right
 *   { type: 'insert', indices: [position], array: [current array state] } - Inserting element
 *   { type: 'sorted', indices: [0, i] } - Elements 0 to i are sorted
 * @param {number[]} arr - Array to sort
 * @yields {{type: string, indices: number[], array?: number[]}}
 */
export function* insertionSort(arr) {
  const steps = [...arr];

  for (let i = 1; i < steps.length; i++) {
    const current = steps[i];
    let j = i - 1;

    // Highlight the current element being inserted
    yield { type: 'current', indices: [i] };

    // Move elements greater than current one position ahead
    while (j >= 0 && steps[j] > current) {
      // Show comparison
      yield { type: 'compare', indices: [j, j + 1] };

      // Shift element to the right
      steps[j + 1] = steps[j];
      yield { type: 'shift', indices: [j + 1], array: [...steps] };

      j--;
    }

    // Insert the current element at its correct position
    steps[j + 1] = current;
    yield { type: 'insert', indices: [j + 1], array: [...steps] };

    // Show that elements from 0 to i are now sorted
    yield { type: 'sorted', indices: Array.from({ length: i + 1 }, (_, k) => k) };
  }
}

/**
 * Merge Sort generator.
 * Yields objects of the form:
 *   { type: 'divide', indices: [left, right] } - Showing division of array
 *   { type: 'merge', indices: [left, mid, right] } - Starting merge operation
 *   { type: 'compare', indices: [i, j] } - Comparing elements during merge
 *   { type: 'place', indices: [position], array: [current array state] } - Placing element in merged position
 *   { type: 'copy', indices: [position], array: [current array state] } - Copying remaining elements
 *   { type: 'complete', indices: [left, right], array: [current array state] } - Merge complete for this range
 * @param {number[]} arr - Array to sort
 * @yields {{type: string, indices: number[], array?: number[]}}
 */
export function* mergeSort(arr) {
  const steps = [...arr];

  function* mergeSortHelper(left, right) {
    if (left >= right) return;

    // Show division
    yield { type: 'divide', indices: [left, right] };

    const mid = Math.floor((left + right) / 2);

    // Recursively sort left half
    yield* mergeSortHelper(left, mid);

    // Recursively sort right half
    yield* mergeSortHelper(mid + 1, right);

    // Merge the sorted halves
    yield* merge(left, mid, right);
  }

  function* merge(left, mid, right) {
    // Show merge operation starting
    yield { type: 'merge', indices: [left, mid, right] };

    // Create temporary arrays for left and right subarrays
    const leftArr = [];
    const rightArr = [];

    // Copy data to temp arrays
    for (let i = left; i <= mid; i++) {
      leftArr.push(steps[i]);
    }
    for (let j = mid + 1; j <= right; j++) {
      rightArr.push(steps[j]);
    }

    let i = 0; // Initial index of left subarray
    let j = 0; // Initial index of right subarray
    let k = left; // Initial index of merged subarray

    // Merge the temp arrays back into steps[left..right]
    while (i < leftArr.length && j < rightArr.length) {
      // Show comparison
      const leftOriginalIndex = left + i;
      const rightOriginalIndex = mid + 1 + j;
      yield { type: 'compare', indices: [leftOriginalIndex, rightOriginalIndex] };

      if (leftArr[i] <= rightArr[j]) {
        steps[k] = leftArr[i];
        yield { type: 'place', indices: [k], array: [...steps] };
        i++;
      } else {
        steps[k] = rightArr[j];
        yield { type: 'place', indices: [k], array: [...steps] };
        j++;
      }
      k++;
    }

    // Copy remaining elements of leftArr[], if any
    while (i < leftArr.length) {
      steps[k] = leftArr[i];
      yield { type: 'copy', indices: [k], array: [...steps] };
      i++;
      k++;
    }

    // Copy remaining elements of rightArr[], if any
    while (j < rightArr.length) {
      steps[k] = rightArr[j];
      yield { type: 'copy', indices: [k], array: [...steps] };
      j++;
      k++;
    }

    // Show completion of this merge
    yield { type: 'complete', indices: [left, right], array: [...steps] };
  }

  // Start the merge sort process
  yield* mergeSortHelper(0, steps.length - 1);
}
