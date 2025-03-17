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

      transform.position.set(1, 2, 3);
      expect(transform.worldPosition).toEqual(new Vector3(1, 2, 3));
    });

    it("should include parent's world position and rotation", () => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's position and rotation
      parentGameObject.transform.position.set(10, 20, 30);
      parentGameObject.transform.rotation.set(0.707, 0, 0.707, 0); // 90° around Y-axis

      // Set child's local position
      childGameObject.transform.position.set(1, 2, 3);

      // Expected world position:
      // Parent's position + (child's position rotated by parent's rotation)
      const expectedWorldPosition = new Vector3(10, 20, 30).add(
        new Vector3(1, 2, 3).rotate(parentGameObject.transform.rotation),
      );

      expect(childGameObject.transform.worldPosition).toEqual(
        expectedWorldPosition,
      );
    });

    it("should compute world position correctly in a nested hierarchy with rotation and scaling", () => {
      const grandparent = new GameObject();
      const parent = new GameObject();
      const child = new GameObject();

      grandparent.addChild(parent);
      parent.addChild(child);

      // Set grandparent's position, rotation, and scale
      grandparent.transform.position.set(10, 20, 30);
      grandparent.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0); // 90° around Y-axis
      grandparent.transform.scale.set(2, 1, 1); // Scale only along X-axis

      // Set parent's local position, rotation, and scale
      parent.transform.position.set(1, 2, 3);
      parent.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0); // 90° around X-axis
      parent.transform.scale.set(1, 2, 1); // Scale only along Y-axis

      // Set child's local position
      child.transform.position.set(0.5, 0.5, 0.5);

      // Expected world position:
      // grandparent's position + (parent's position rotated and scaled by grandparent) + (child's position rotated and scaled by parent and grandparent)
      const parentWorldPosition = grandparent.transform.worldPosition.clone();
      const parentWorldRotation = grandparent.transform.worldRotation.clone();
      const parentWorldScale = grandparent.transform.worldScale.clone();

      const parentTransformedPosition = parent.transform.position
        .clone()
        .scaleAxis(parentWorldScale)
        .rotate(parentWorldRotation)
        .add(parentWorldPosition);

      const childWorldPosition = parentTransformedPosition.add(
        child.transform.position
          .clone()
          .scaleAxis(parent.transform.worldScale)
          .rotate(parent.transform.worldRotation),
      );

      expect(child.transform.worldPosition).toEqual(childWorldPosition);
    });
  });

  describe("worldRotation", () => {
    it("should return local rotation when no parent is set", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      transform.rotation.set(0.707, 0, 0.707, 0); // 90° around Y-axis
      expect(transform.worldRotation).toEqual(
        new Quaternion(0.707, 0, 0.707, 0),
      );
    });

    it("should combine parent's world rotation with local rotation", () => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's rotation
      parentGameObject.transform.rotation.set(0.707, 0, 0.707, 0); // 90° around Y-axis

      // Set child's local rotation
      childGameObject.transform.rotation.set(0.707, 0.707, 0, 0); // 90° around X-axis

      // Expected world rotation:
      // Parent's rotation * child's rotation
      const expectedWorldRotation = parentGameObject.transform.rotation
        .clone()
        .rotate(childGameObject.transform.rotation);

      expect(childGameObject.transform.worldRotation).toEqual(
        expectedWorldRotation,
      );
    });

    it("should combine parent's world rotation with local rotation in a nested hierarchy", () => {
      const grandparent = new GameObject();
      const parent = new GameObject();
      const child = new GameObject();

      grandparent.addChild(parent);
      parent.addChild(child);

      // Set grandparent's rotation (90° around Y-axis)
      grandparent.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);

      // Set parent's local rotation (90° around X-axis)
      parent.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);

      // Set child's local rotation (90° around Z-axis)
      child.transform.rotation.setFromEulerAngles(0, 0, Math.PI / 2);

      // Expected world rotation:
      // grandparent's rotation * parent's rotation * child's rotation
      const expectedWorldRotation = grandparent.transform.rotation
        .clone()
        .rotate(parent.transform.rotation)
        .rotate(child.transform.rotation);

      expect(child.transform.worldRotation).toEqual(expectedWorldRotation);
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

    it("should rotate forward vector correctly with 90° Y-axis rotation", () => {
      const quaternion = Quaternion.fromEulerAngles(0, Math.PI / 2, 0);
      const forward = new Vector3(0, 0, 1);
      const rotatedForward = forward.rotate(quaternion);

      expect(rotatedForward.x).toBeCloseTo(1);
      expect(rotatedForward.y).toBeCloseTo(0);
      expect(rotatedForward.z).toBeCloseTo(0);
    });

    it("should rotate forward vector correctly with 90° yaw rotation then 45° pitch", () => {
      const quaternion = Quaternion.identity();
      quaternion.rotateAroundAxis(Vector3.up(), Math.PI / 2);
      quaternion.rotateAroundAxis(Vector3.right(), Math.PI / 4);
      const forward = new Vector3(0, 0, 1);
      const rotatedForward = forward.rotate(quaternion);

      console.log(rotatedForward);
      expect(rotatedForward.x).toBeCloseTo(1 / Math.sqrt(2));
      expect(rotatedForward.y).toBeCloseTo(-(1 / Math.sqrt(2)));
      expect(rotatedForward.z).toBeCloseTo(0);
    });

    it("should compute forward vector correctly after rotation", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Rotate 90 degrees around Y-axis (yaw)
      transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);

      // Expected forward vector after 90° Y-axis rotation: (1, 0, 0)
      expect(transform.forward.x).toBeCloseTo(1);
      expect(transform.forward.y).toBeCloseTo(0);
      expect(transform.forward.z).toBeCloseTo(0);
    });

    it("should compute right vector correctly after rotation", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Rotate 90 degrees around Y-axis (yaw)
      transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);

      // Expected right vector after 90° Y-axis rotation: (0, 0, -1)
      expect(transform.right.x).toBeCloseTo(0);
      expect(transform.right.y).toBeCloseTo(0);
      expect(transform.right.z).toBeCloseTo(-1);
    });

    it("should compute top vector correctly after rotation", () => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      // Rotate 90 degrees around X-axis (pitch)
      transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);

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
      parentGameObject.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);

      // Set child's local rotation (90° around X-axis)
      childGameObject.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);

      expect(childGameObject.transform.forward.x).toBeCloseTo(0);
      expect(childGameObject.transform.forward.y).toBeCloseTo(-1);
      expect(childGameObject.transform.forward.z).toBeCloseTo(0);
    });
  });

  describe("worldToLocalPosition", (): void => {
    it("should return the same position when no parent is set", (): void => {
      const gameObject = new GameObject();
      const transform = new Transform(gameObject);

      const worldPosition = new Vector3(10, 20, 30);
      const localPosition = transform.worldToLocalPosition(worldPosition);

      // When there's no parent, world and local positions are the same
      expect(localPosition).toEqual(worldPosition);
    });

    it("should subtract parent's world position when no rotation or scale is applied", (): void => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's position
      parentGameObject.transform.position.set(10, 20, 30);

      // World position to convert
      const worldPosition = new Vector3(15, 25, 35);

      // Expected local position: worldPosition - parent's position
      const expectedLocalPosition = new Vector3(5, 5, 5);

      const localPosition =
        childGameObject.transform.worldToLocalPosition(worldPosition);

      expect(localPosition).toEqual(expectedLocalPosition);
    });

    it("should apply inverse parent rotation when no scaling is applied", (): void => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's rotation (90° around Y-axis)
      parentGameObject.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);

      // World position to convert
      const worldPosition = new Vector3(1, 2, 3);

      // Expected local position: worldPosition rotated by inverse parent rotation
      const expectedLocalPosition = new Vector3(-3, 2, 1);

      const localPosition =
        childGameObject.transform.worldToLocalPosition(worldPosition);

      expect(localPosition.x).toBeCloseTo(expectedLocalPosition.x);
      expect(localPosition.y).toBeCloseTo(expectedLocalPosition.y);
      expect(localPosition.z).toBeCloseTo(expectedLocalPosition.z);
    });

    it("should apply inverse parent scaling when no rotation is applied", (): void => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's scale
      parentGameObject.transform.scale.set(2, 3, 4);

      // World position to convert
      const worldPosition = new Vector3(4, 9, 16);

      // Expected local position: worldPosition divided by parent's scale
      const expectedLocalPosition = new Vector3(2, 3, 4);

      const localPosition =
        childGameObject.transform.worldToLocalPosition(worldPosition);

      expect(localPosition).toEqual(expectedLocalPosition);
    });

    it("should apply inverse parent rotation and scaling", (): void => {
      const parentGameObject = new GameObject();
      const childGameObject = new GameObject();

      parentGameObject.addChild(childGameObject);

      // Set parent's rotation (90° around Y-axis) and scale
      parentGameObject.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);
      parentGameObject.transform.scale.set(2, 1, 1);

      // World position to convert
      const worldPosition = new Vector3(2, 3, 4);

      // Expected local position:
      // 1. Subtract parent's position (0, 0, 0 in this case)
      // 2. Rotate by inverse parent rotation
      // 3. Scale by inverse parent scale
      const expectedLocalPosition = new Vector3(-4, 3, 1);

      const localPosition =
        childGameObject.transform.worldToLocalPosition(worldPosition);

      expect(localPosition.x).toBeCloseTo(expectedLocalPosition.x);
      expect(localPosition.y).toBeCloseTo(expectedLocalPosition.y);
      expect(localPosition.z).toBeCloseTo(expectedLocalPosition.z);
    });

    it("should handle nested hierarchy with rotation and scaling", (): void => {
      const grandparent = new GameObject();
      const parent = new GameObject();
      const object = new GameObject();
      const validationChild = new GameObject();

      grandparent.addChild(parent);
      parent.addChild(object);
      object.addChild(validationChild);

      // Set grandparent's transformation
      grandparent.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0);
      grandparent.transform.position.set(10, 0, 0);
      grandparent.transform.scale.set(1, 1, 1);

      // Set parent's transformation
      parent.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);
      parent.transform.scale.set(1, 1, 1);

      // World position to convert
      const expectedLocalPosition = new Vector3(0.5, 1, 1);
      validationChild.transform.position.setFromVector3(expectedLocalPosition);
      const worldPosition = validationChild.transform.worldPosition;

      const localPosition =
        object.transform.worldToLocalPosition(worldPosition);

      expect(localPosition.x).toBeCloseTo(expectedLocalPosition.x);
      expect(localPosition.y).toBeCloseTo(expectedLocalPosition.y);
      expect(localPosition.z).toBeCloseTo(expectedLocalPosition.z);
    });
  });

  it("should compute world position correctly in a nested hierarchy", () => {
    const grandparent = new GameObject();
    const parent = new GameObject();
    const child = new GameObject();

    grandparent.addChild(parent);
    parent.addChild(child);

    grandparent.transform.position.set(10, 20, 30);
    parent.transform.position.set(1, 2, 3);
    child.transform.position.set(0.5, 0.5, 0.5);

    const expectedWorldPosition = new Vector3(
      10 + 1 + 0.5,
      20 + 2 + 0.5,
      30 + 3 + 0.5,
    );
    expect(child.transform.worldPosition).toEqual(expectedWorldPosition);
  });

  it("should apply non-uniform scaling correctly", () => {
    const parent = new GameObject();
    const child = new GameObject();

    parent.addChild(child);

    parent.transform.scale.set(2, 1, 1); // Scale only along X-axis
    child.transform.position.set(1, 0, 0);

    const expectedWorldPosition = new Vector3(2, 0, 0); // Scaled X position
    expect(child.transform.worldPosition).toEqual(expectedWorldPosition);
  });

  it("should combine rotation and scaling correctly", () => {
    const parent = new GameObject();
    const child = new GameObject();

    parent.addChild(child);

    parent.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0); // 90° around Y-axis
    parent.transform.scale.set(2, 1, 1); // Scale only along X-axis
    child.transform.position.set(1, 0, 0);

    // Expected world position: (0, 0, -2)
    expect(child.transform.worldPosition.x).toBeCloseTo(0);
    expect(child.transform.worldPosition.y).toBeCloseTo(0);
    expect(child.transform.worldPosition.z).toBeCloseTo(-2);
  });

  it("should handle zero scaling correctly", () => {
    const parent = new GameObject();
    const child = new GameObject();

    parent.addChild(child);

    parent.transform.scale.set(0, 1, 1); // Zero scale along X-axis
    child.transform.position.set(1, 0, 0);

    const expectedWorldPosition = new Vector3(0, 0, 0); // X position scaled to zero
    expect(child.transform.worldPosition).toEqual(expectedWorldPosition);
  });

  it("should handle negative scaling correctly", () => {
    const parent = new GameObject();
    const child = new GameObject();

    parent.addChild(child);

    parent.transform.scale.set(-1, 1, 1); // Negative scale along X-axis
    child.transform.position.set(1, 0, 0);

    const expectedWorldPosition = new Vector3(-1, 0, 0); // X position inverted
    expect(child.transform.worldPosition).toEqual(expectedWorldPosition);
  });

  it("should normalize quaternions after operations", () => {
    const quaternion = new Quaternion(1, 2, 3, 4);
    quaternion.normalize();

    const length = Math.sqrt(
      quaternion.w * quaternion.w +
        quaternion.x * quaternion.x +
        quaternion.y * quaternion.y +
        quaternion.z * quaternion.z,
    );

    expect(length).toBeCloseTo(1); // Length should be 1
  });

  it("should multiply quaternions in the correct order", () => {
    const q1 = new Quaternion(0.707, 0, 0.707, 0); // 90° around Y-axis
    const q2 = new Quaternion(0.707, 0.707, 0, 0); // 90° around X-axis

    const result = q1.multiply(q2);

    // Expected result of q1 * q2
    const expected = new Quaternion(0.5, 0.5, 0.5, -0.5);
    expect(result.w).toBeCloseTo(expected.w);
    expect(result.x).toBeCloseTo(expected.x);
    expect(result.y).toBeCloseTo(expected.y);
    expect(result.z).toBeCloseTo(expected.z);
  });
});
