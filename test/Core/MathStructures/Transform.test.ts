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

  describe("forward, right, and top vectors", () => {
    it("should return default forward vector when no rotation is applied", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Default forward vector is (0, 0, 1)
      expect(transform.forward).toEqual(new Vector3(0, 0, 1));
    });

    it("should return default right vector when no rotation is applied", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Default right vector is (1, 0, 0)
      expect(transform.right).toEqual(new Vector3(1, 0, 0));
    });

    it("should return default top vector when no rotation is applied", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Default top vector is (0, 1, 0)
      expect(transform.top).toEqual(new Vector3(0, 1, 0));
    });

    it("should create correct quaternion for 90° Y-axis rotation", () => {
      const quaternion = Quaternion.fromEulerAngles(
        new Vector3(0, Math.PI / 2, 0),
      );
      expect(quaternion.w).toBeCloseTo(Math.sqrt(2) / 2);
      expect(quaternion.x).toBeCloseTo(0);
      expect(quaternion.y).toBeCloseTo(Math.sqrt(2) / 2);
      expect(quaternion.z).toBeCloseTo(0);
    });

    it("should rotate forward vector correctly with 90° Y-axis rotation", () => {
      const quaternion = Quaternion.fromEulerAngles(
        new Vector3(0, Math.PI / 2, 0),
      );
      const forward = new Vector3(0, 0, 1);
      const rotatedForward = forward.rotate(quaternion);

      expect(rotatedForward.x).toBeCloseTo(1);
      expect(rotatedForward.y).toBeCloseTo(0);
      expect(rotatedForward.z).toBeCloseTo(0);
    });

    it("should compute forward vector correctly after rotation", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Rotate 90 degrees around Y-axis (yaw)
      transform.rotation = Quaternion.fromEulerAngles(
        new Vector3(0, Math.PI / 2, 0),
      );

      // Expected forward vector after 90° Y-axis rotation: (1, 0, 0)
      expect(transform.forward.x).toBeCloseTo(1);
      expect(transform.forward.y).toBeCloseTo(0);
      expect(transform.forward.z).toBeCloseTo(0);
    });

    it("should compute right vector correctly after rotation", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Rotate 90 degrees around Y-axis (yaw)
      transform.rotation = Quaternion.fromEulerAngles(
        new Vector3(0, Math.PI / 2, 0),
      );

      // Expected right vector after 90° Y-axis rotation: (0, 0, -1)
      expect(transform.right.x).toBeCloseTo(0);
      expect(transform.right.y).toBeCloseTo(0);
      expect(transform.right.z).toBeCloseTo(-1);
    });

    it("should compute top vector correctly after rotation", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Rotate 90 degrees around X-axis (pitch)
      transform.rotation = Quaternion.fromEulerAngles(
        new Vector3(Math.PI / 2, 0, 0),
      );

      // Expected top vector after 90° X-axis rotation: (0, 0, 1)
      expect(transform.top.x).toBeCloseTo(0);
      expect(transform.top.y).toBeCloseTo(0);
      expect(transform.top.z).toBeCloseTo(1);
    });

    it("should compute forward vector correctly with parent rotation", () => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's rotation (90° around Y-axis)
      parentGameObject.transform.rotation = Quaternion.fromEulerAngles(
        new Vector3(0, Math.PI / 2, 0),
      );

      // Set child's local rotation (90° around X-axis)
      childGameObject.transform.rotation = Quaternion.fromEulerAngles(
        new Vector3(Math.PI / 2, 0, 0),
      );

      // Expected forward vector after combined rotation: (0, 1, 0)
      expect(childGameObject.transform.forward.x).toBeCloseTo(0);
      expect(childGameObject.transform.forward.y).toBeCloseTo(1);
      expect(childGameObject.transform.forward.z).toBeCloseTo(0);
    });
  });
});
