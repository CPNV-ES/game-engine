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
}
