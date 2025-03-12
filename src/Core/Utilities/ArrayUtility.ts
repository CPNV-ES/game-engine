export class ArrayUtility {
  /**
   * Generate all the possible combinations of a given array
   * @param array - The input array
   * @param length - Amount of elements in each combination
   * @returns An array of combinations
   */
  static combinations<T>(array: T[], length: number): T[][] {
    const result: T[][] = [];

    function generateCombinations(start: number, combo: T[]) {
      if (combo.length === length) {
        result.push([...combo]);
        return;
      }

      for (let i = start; i < array.length; i++) {
        generateCombinations(i + 1, [...combo, array[i]]);
      }
    }

    generateCombinations(0, []);
    return result;
  }

  /**
   * Remove an element from an array
   * @param array - The input array
   * @param element - The element to remove
   */
  static removeElement<T>(array: T[], element: T): void {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  /**
   * Returns the index of the closest (lower) element in an array sorted in ascending order
   * @param array
   * @param target
   * @param compare
   */
  static binarySearch<T>(
    array: T[],
    target: T,
    compare: (a: T, b: T) => number,
  ): number {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = compare(array[mid], target);

      if (comparison < 0) {
        left = mid + 1;
      } else if (comparison > 0) {
        right = mid - 1;
      } else {
        return mid;
      }
    }

    return left;
  }
}
