import { describe, it, expect } from "vitest";
import { ArrayUtility } from "../../../src/Core/Utilities/ArrayUtility";

describe("ArrayUtility", (): void => {
  /**
   * Tests if the combinations of a 6 long array by pairs of 2 are correct
   */
  it("should give 15 sub arrays of numbers from a 6 long combinated by pairs of 2", () => {
    // Given
    const array: number[] = [1, 2, 3, 4, 5, 6];
    const expectedRes: number[][] = [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 6],
      [3, 4],
      [3, 5],
      [3, 6],
      [4, 5],
      [4, 6],
      [5, 6],
    ];

    // When
    const res: number[][] = ArrayUtility.combinations(array, 2);

    // Then
    expect(res).toEqual(expectedRes);
  });

  /**
   * Tests if the combinations of a 4 long array by pairs of 3 are correct
   */
  it("should give 4 sub arrays of objects from a 4 long combinated by pairs of 3", () => {
    // Given
    const array: any[] = [
      { porp1: "prop1" },
      { porp2: "prop2" },
      { porp3: "prop3" },
      { porp4: "prop4" },
    ];
    const expectedRes: any[][] = [
      [{ porp1: "prop1" }, { porp2: "prop2" }, { porp3: "prop3" }],
      [{ porp1: "prop1" }, { porp2: "prop2" }, { porp4: "prop4" }],
      [{ porp1: "prop1" }, { porp3: "prop3" }, { porp4: "prop4" }],
      [{ porp2: "prop2" }, { porp3: "prop3" }, { porp4: "prop4" }],
    ];

    // When
    const res: any[][] = ArrayUtility.combinations(array, 3);

    // Then
    expect(res).toEqual(expectedRes);
  });

  /**
   * Tests if the array can remove a specific object from itself
   */
  it("should remove the object from the array", () => {
    // Given
    const objectToRemove = { porp2: "prop2" };
    const array: any[] = [
      { porp1: "prop1" },
      objectToRemove,
      { porp3: "prop3" },
      { porp4: "prop4" },
    ];
    const expectedRes: any[] = [
      { porp1: "prop1" },
      { porp3: "prop3" },
      { porp4: "prop4" },
    ];

    // When
    ArrayUtility.removeElement(array, objectToRemove);

    // Then
    expect(array).toEqual(expectedRes);
  });

  /**
   * Tests if the array only remove first of a specific object from itself
   */
  it("should remove the first given object from the array", () => {
    // Given
    const objectToRemove = { porp2: "prop2" };
    const array: any[] = [
      { porp1: "prop1" },
      objectToRemove,
      { porp3: "prop3" },
      { porp4: "prop4" },
      objectToRemove,
    ];
    const expectedRes: any[] = [
      { porp1: "prop1" },
      { porp3: "prop3" },
      { porp4: "prop4" },
      objectToRemove,
    ];

    // When
    ArrayUtility.removeElement(array, objectToRemove);

    // Then
    expect(array).toEqual(expectedRes);
  });
});
