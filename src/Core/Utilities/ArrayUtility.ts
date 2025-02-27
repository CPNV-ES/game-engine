export class ArrayUtility {
  /**
   * Generate all the possible combinations of a given array
   * @param array
   * @param length: amount of elements in each combination
   */
  static combinations(array, length) {
    const result = [];

    function generateCombinations(start, combo) {
      if (combo.length === length) {
        result.push(combo);
        return;
      }

      for (let i = start; i < array.length; i++) {
        generateCombinations(i + 1, combo.concat(array[i]));
      }
    }

    generateCombinations(0, []);
    return result;
  }

  /**
   * Remove an element from an array
   * @param array
   * @param element
   */
  static removeElement(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
