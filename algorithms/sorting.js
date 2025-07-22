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