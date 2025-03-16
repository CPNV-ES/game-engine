# 3D Transformations in the Game Engine
## **General Concepts**
A 3D transformation is a mathematical operation that changes the position, rotation, or scale of an object in a 3D space. It allows you to move, rotate, or resize objects relative to their current state or the world space.

### **2. How does the game engine handle 3D transformations?**
The game engine uses a combination of **position**, **rotation**, and **scale** to define the transformation of an object. These properties are represented using:
- **Position**: A `Vector3` object defining the object's location in 3D space.
- **Rotation**: A `Quaternion` object defining the object's orientation.
- **Scale**: A `Vector3` object defining the object's size along the X, Y, and Z axes.

These transformations are applied hierarchically, meaning child objects inherit the transformations of their parent objects.

*Keep in mind that position, rotation and scale are readonly in the transform so the reference cannot change!*
**This implies that you will be using in-place changing methods like .set or .rotateAroundAxis**

![Right-handed coordinate system](technical-in-house/img/coordinate-space.png)

## FAQ

### **Position**

#### **3. How do I set the position of an object in 3D space?**
You can set the position of an object using the `position` property of its `Transform` component. For example:
```typescript
gameObject.transform.position.set(1, 2, 3); // Moves the object to (1, 2, 3)
```

#### **4. How does world position differ from local position?**
- **Local Position**: The position of an object relative to its parent. If the object has no parent, this is the same as the world position.
- **World Position**: The position of an object in the global 3D space, taking into account the transformations of all its parent objects.

You can access the world position using the `worldPosition` property:
```typescript
const worldPos = gameObject.transform.worldPosition;
```

---

### **Rotation**

#### **5. What is a quaternion, and why is it used for rotation?**
A **quaternion** is a mathematical structure used to represent 3D rotations. It avoids issues like **gimbal lock** and provides smooth interpolation between rotations. Quaternions are more efficient and stable for 3D rotations compared to Euler angles.

#### **6. How do I rotate an object?**
You can rotate an object using the `rotation` property of its `Transform` component. For example:
```typescript
gameObject.transform.rotation.setFromEulerAngles(0, Math.PI / 2, 0); // Rotates 90 degrees around the Y-axis
```

#### **7. How do I rotate an object around a specific axis?**
Use the `rotateAroundAxis` method to rotate an object around a specific axis:
```typescript
const axis = new Vector3(1, 0, 0); // X-axis
const angle = Math.PI / 4; // 45 degrees in radians
gameObject.transform.rotation.rotateAroundAxis(axis, angle);
```

#### **8. How do I combine multiple rotations?**
You can combine rotations by multiplying quaternions:
```typescript
const rotation1 = Quaternion.fromEulerAngles(0, Math.PI / 2, 0); // 90° around Y-axis
const rotation2 = Quaternion.fromEulerAngles(Math.PI / 2, 0, 0); // 90° around X-axis
gameObject.transform.rotation = rotation1.multiply(rotation2);
```

---

### **Scale**

#### **9. How do I scale an object?**
You can scale an object using the `scale` property of its `Transform` component:
```typescript
gameObject.transform.scale.set(2, 1, 1); // Scales the object to twice its size along the X-axis
```

#### **10. How does world scale work?**
World scale is the effective scale of an object in the global 3D space, considering the scales of all its parent objects. You can access it using the `worldScale` property:
```typescript
const worldScale = gameObject.transform.worldScale;
```

---

### **Hierarchy and Transformations**

#### **11. How do parent-child transformations work?**
When an object is a child of another object, its transformations are relative to its parent. For example:
- If the parent is moved, the child moves with it.
- If the parent is rotated, the child rotates around the parent's origin.
- If the parent is scaled, the child is scaled accordingly.

#### **12. How do I calculate the world position of a child object?**
The world position of a child object is calculated by applying the parent's transformations to the child's local position. For example:
```typescript
const childWorldPosition = childObject.transform.worldPosition;
```

---

### **Advanced Topics**

#### **13. How do I convert between Euler angles and quaternions?**
- To convert Euler angles to a quaternion:
  ```typescript
  const quaternion = Quaternion.fromEulerAngles(pitch, yaw, roll);
  ```
- To convert a quaternion to Euler angles:
  ```typescript
  const eulerAngles = quaternion.toEulerAngles();
  ```

#### **14. How do I interpolate between two rotations?**
Use the `lerp` method to interpolate between two quaternions:
```typescript
const interpolatedRotation = Quaternion.identity().lerp(startRotation, endRotation, t);
```
Here, `t` is a value between 0 and 1 representing the interpolation factor.

#### **15. How do I handle non-uniform scaling?**
Non-uniform scaling (scaling differently along each axis) is supported. However, it can affect rotations and other transformations. Ensure that your object's local coordinate system aligns with the intended scaling behavior.

---

### **Common Issues**

#### **16. Why is my object not rotating as expected?**
- Ensure you are using quaternions for rotations, as Euler angles can lead to gimbal lock.
- Check if the object is a child of another object, as parent rotations affect child objects.
- Check the eulerangle application order (by default it is ZXY)

#### **17. Why does scaling affect my object's rotation?**
Scaling can distort the local coordinate system of an object, affecting its rotation. To avoid this, ensure that scaling is applied uniformly or adjust the object's pivot point.

#### **18. How do I reset an object's transformations?**
To reset an object's transformations:
```typescript
gameObject.transform.position.set(0, 0, 0);
gameObject.transform.rotation.setFromQuaternion(Quaternion.identity());
gameObject.transform.scale.set(1, 1, 1);
```