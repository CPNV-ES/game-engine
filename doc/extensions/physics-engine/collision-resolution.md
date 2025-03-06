# Collision Resolution in 2D Physics Engine

This document explains the collision resolution process implemented in the 2D physics engine, specifically focusing on the **Separating Axis Theorem (SAT)** and how it is used to resolve collisions between convex polygons.

---

## Overview

The collision resolution process involves two main steps:

1. **[Collision Detection](./What%20is%20SAT.md)**: Using the SAT algorithm to detect if two polygons are intersecting.
2. **Collision Resolution**: Determining the minimum translation vector (MTV) to resolve the collision by moving the polygons apart.

This document focuses on the **collision resolution** part, assuming that the SAT algorithm has already detected a collision.

---

## Key Concepts

### 1. Projection on Axes
To resolve collisions, we project the vertices of both polygons onto the axes perpendicular to their edges. This projection helps us determine the **overlap** between the polygons along each axis.

![Figure 7: Two intersecting convex shapes](https://dyn4j.org/assets/posts/2010-01-01-sat-separating-axis-theorem/sat-ex-3.png)  

- **Projection**: The process of mapping the vertices of a polygon onto an axis to find the minimum and maximum scalar values along that axis.
- **Overlap**: The distance by which the projections of the two polygons overlap on a given axis.

### 2. Minimum Translation Vector (MTV)
The MTV is the smallest vector required to move the polygons apart so that they no longer intersect. It consists of two components:
- **Normal**: The direction in which the polygons should be moved apart.
- **Depth**: The distance by which the polygons need to be moved along the normal.

The MTV is calculated by finding the axis with the smallest overlap (depth) and using that axis as the normal.

---

## Collision Resolution Process

### Step 1: Project Vertices onto Axes
For each axis (perpendicular to the edges of both polygons), we project the vertices of both polygons onto the axis. This gives us the minimum and maximum scalar values for each polygon along that axis.

```typescript
private projectVertices(vertices: Vector2[], axis: Vector2): { min: number; max: number } {
  const projections: number[] = vertices.map(vertex => axis.dotProduct(vertex));
  return { min: Math.min(...projections), max: Math.max(...projections) };
}
```

### Step 2: Check for Overlap
For each axis, we check if the projections of the two polygons overlap. If there is no overlap on any axis, the polygons are not colliding. If there is overlap on all axes, we proceed to calculate the MTV.

```typescript
if (projectionA.max < projectionB.min || projectionB.max < projectionA.min) {
  return; // No collision
}
```

### Step 3: Calculate Depth and Normal
For each axis where there is an overlap, we calculate the depth of the overlap. The depth is the smallest distance required to separate the polygons along that axis. We keep track of the smallest depth and the corresponding axis (normal).

```typescript
const axisDepth = Math.min(projectionA.max, projectionB.max) - Math.max(projectionA.min, projectionB.min);

if (depth === undefined || axisDepth < depth) {
  depth = axisDepth;
  normal = axis;
}
```

### Step 4: Normalize the MTV
Once we have the smallest depth and the corresponding normal, we normalize the normal vector to ensure it has a magnitude of 1. This ensures that the depth value is accurate for resolving the collision.

```typescript
depth /= normal.length;
normal = normal.normalize();
```

### Step 5: Adjust Normal Direction
To ensure the normal points in the correct direction (from polygon A to polygon B), we calculate the vector from the center of polygon A to the center of polygon B. If the dot product of this vector and the normal is negative, we reverse the normal.

```typescript
const worldCenterA = a.getGravitationCenter().add(a.gameObject.transform.worldPosition);
const worldCenterB = b.getGravitationCenter().add(b.gameObject.transform.worldPosition);

if (worldCenterB.sub(worldCenterA).dotProduct(normal) < 0) {
  normal = normal.scale(-1);
}
```

### Step 6: Resolve the Collision
Finally, we use the MTV to move the polygons apart. Each polygon is moved by half of the depth along the normal (or inversely, depending on their masses).

```typescript
this.gameObject.transform.position.sub(
  collision.normal.clone().scale(collision.getMassByDepthRatio()),
);
```

---

## Why Projection on Axes?

Projection on axes is a fundamental part of the SAT algorithm. It allows us to:
- Determine if two polygons are intersecting by checking for overlaps on all axes.
- Find the minimum translation vector (MTV) to resolve the collision by identifying the axis with the smallest overlap.

By projecting the vertices onto the axes, we simplify the problem of collision detection and resolution into a series of 1D comparisons, making it computationally efficient.

---

## Summary

The collision resolution process involves:
1. Projecting the vertices of both polygons onto the axes.
2. Checking for overlaps on each axis.
3. Calculating the minimum translation vector (MTV) using the smallest overlap.
4. Normalizing the MTV and adjusting the normal direction.
5. Resolving the collision by moving the polygons apart based on the MTV.

This approach ensures that collisions are resolved accurately and efficiently, providing realistic physics interactions in the game engine.
