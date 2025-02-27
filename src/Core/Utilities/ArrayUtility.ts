export class ArrayUtility {
  /**
   * Generate all the possible combinations of a given array
   * @param array
   * @param length: amount of elements in each combination
   */
  static combinations(array, length) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        result.push([array[i], array[j]]);
      }
    }
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
