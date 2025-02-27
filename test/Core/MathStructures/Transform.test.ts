import { describe, it, expect } from "vitest";
import { Transform } from "@core/MathStructures/Transform.ts";
import { GameObject } from "@core/GameObject.ts";
import { Vector3 } from "@core/MathStructures/Vector3.ts";
import { Quaternion } from "@core/MathStructures/Quaternion.ts";

describe("Transform", (): void => {
  it("should have default values on instance", () => {
    const gameObject = new GameObject();
    const emptyTransform = new Transform(gameObject);

    expect(emptyTransform.position.x).toBe(0);
    expect(emptyTransform.position.y).toBe(0);
    expect(emptyTransform.position.z).toBe(0);

    expect(emptyTransform.rotation.w).toBe(1); // Identity quaternion
    expect(emptyTransform.rotation.x).toBe(0);
    expect(emptyTransform.rotation.y).toBe(0);
    expect(emptyTransform.rotation.z).toBe(0);

    expect(emptyTransform.scale.x).toBe(1);
    expect(emptyTransform.scale.y).toBe(1);
    expect(emptyTransform.scale.z).toBe(1);
  });

  describe("worldPosition", () => {
    it("should return local position when no parent is set", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      transform.position = new Vector3(1, 2, 3);
      expect(transform.worldPosition).toEqual(new Vector3(1, 2, 3));
    });

    it("should include parent's world position and rotation", () => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's position and rotation
      parentGameObject.transform.position = new Vector3(10, 20, 30);
      parentGameObject.transform.rotation = new Quaternion(0.707, 0, 0.707, 0); // 90° around Y-axis

      // Set child's local position
      childGameObject.transform.position = new Vector3(1, 2, 3);

      // Expected world position:
      // Parent's position + (child's position rotated by parent's rotation)
      const expectedWorldPosition = new Vector3(10, 20, 30).add(
        new Vector3(1, 2, 3).rotate(parentGameObject.transform.rotation),
      );

      expect(childGameObject.transform.worldPosition).toEqual(
        expectedWorldPosition,
      );
    });
  });

  describe("worldRotation", () => {
    it("should return local rotation when no parent is set", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      transform.rotation = new Quaternion(0.707, 0, 0.707, 0); // 90° around Y-axis
      expect(transform.worldRotation).toEqual(
        new Quaternion(0.707, 0, 0.707, 0),
      );
    });

    it("should combine parent's world rotation with local rotation", () => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's rotation
      parentGameObject.transform.rotation = new Quaternion(0.707, 0, 0.707, 0); // 90° around Y-axis

      // Set child's local rotation
      childGameObject.transform.rotation = new Quaternion(0.707, 0.707, 0, 0); // 90° around X-axis

      // Expected world rotation:
      // Parent's rotation * child's rotation
      const expectedWorldRotation = parentGameObject.transform.rotation.rotate(
        childGameObject.transform.rotation,
      );

      expect(childGameObject.transform.worldRotation).toEqual(
        expectedWorldRotation,
      );
    });
  });
});
