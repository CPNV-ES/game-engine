/**
 * Represents a face with N vertices in a mesh
 */
export interface Face {
  vertexIndices: number[]; // Indices of vertices that make up this face
  uvIndices?: number[]; // Optional UV coordinate indices
  normalIndices?: number[]; // Optional normal indices
}

/**
 * MeshData is a data structure that holds the vertices and indices of a mesh.
 * Supports both direct triangle indices and N-gon faces that will be triangulated.
 */
export interface MeshData {
  vertices: Float32Array; // 3 floats for position + 2 floats for UV coordinates
  indices?: Uint16Array; // Optional: Direct triangle indices
  faces?: Face[]; // Optional: N-gon face definitions
  normals?: Float32Array; // Optional: Vertex normals
  uvs?: Float32Array; // Optional: Separate UV coordinates
}

interface Vec2 {
  x: number;
  y: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculate the normal of a face using Newell's method
 */
function calculateFaceNormal(vertices: Float32Array, face: Face): Vec3 {
  let normal = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < face.vertexIndices.length; i++) {
    const current = face.vertexIndices[i];
    const next = face.vertexIndices[(i + 1) % face.vertexIndices.length];
    const v1 = {
      x: vertices[current * 3],
      y: vertices[current * 3 + 1],
      z: vertices[current * 3 + 2],
    };
    const v2 = {
      x: vertices[next * 3],
      y: vertices[next * 3 + 1],
      z: vertices[next * 3 + 2],
    };

    normal.x += (v1.y - v2.y) * (v1.z + v2.z);
    normal.y += (v1.z - v2.z) * (v1.x + v2.x);
    normal.z += (v1.x - v2.x) * (v1.y + v2.y);
  }

  const length = Math.sqrt(
    normal.x * normal.x + normal.y * normal.y + normal.z * normal.z,
  );
  return {
    x: normal.x / length,
    y: normal.y / length,
    z: normal.z / length,
  };
}

/**
 * Project 3D vertices onto 2D plane for triangulation
 */
function projectVerticesToPlane(
  vertices: Float32Array,
  face: Face,
  normal: Vec3,
): Vec2[] {
  // Find the axis with the largest normal component
  const absX = Math.abs(normal.x);
  const absY = Math.abs(normal.y);
  const absZ = Math.abs(normal.z);

  const vertices2D: Vec2[] = [];
  for (const index of face.vertexIndices) {
    const v = {
      x: vertices[index * 3],
      y: vertices[index * 3 + 1],
      z: vertices[index * 3 + 2],
    };

    // Project onto the plane most perpendicular to the normal
    if (absX >= absY && absX >= absZ) {
      // YZ plane
      vertices2D.push({ x: v.y, y: v.z });
    } else if (absY >= absX && absY >= absZ) {
      // XZ plane
      vertices2D.push({ x: v.x, y: v.z });
    } else {
      // XY plane
      vertices2D.push({ x: v.x, y: v.y });
    }
  }

  return vertices2D;
}

/**
 * Helper function to calculate if a point is inside a triangle
 */
function pointInTriangle(point: Vec2, a: Vec2, b: Vec2, c: Vec2): boolean {
  const area =
    0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s =
    (1 / (2 * area)) *
    (a.y * c.x - a.x * c.y + (c.y - a.y) * point.x + (a.x - c.x) * point.y);
  const t =
    (1 / (2 * area)) *
    (a.x * b.y - a.y * b.x + (a.y - b.y) * point.x + (b.x - a.x) * point.y);
  return s >= 0 && t >= 0 && 1 - s - t >= 0;
}

/**
 * Helper function to check if an ear is valid (no other vertices inside it)
 */
function isEar(
  vertices2D: Vec2[],
  i: number,
  remainingIndices: number[],
): boolean {
  const n = remainingIndices.length;
  const prev = (i - 1 + n) % n;
  const next = (i + 1) % n;

  const a = vertices2D[prev];
  const b = vertices2D[i];
  const c = vertices2D[next];

  // Check if triangle is clockwise
  const area = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
  if (area <= 0) return false;

  // Check if any other vertex is inside this triangle
  for (let j = 0; j < vertices2D.length; j++) {
    if (j === prev || j === i || j === next) continue;
    if (pointInTriangle(vertices2D[j], a, b, c)) return false;
  }
  return true;
}

/**
 * Triangulates an N-gon face into triangles using the ear clipping method
 * @param vertices The vertex array containing all mesh vertices
 * @param face The face to triangulate
 * @returns Array of triangle indices
 */
export function triangulate(vertices: Float32Array, face: Face): number[] {
  if (face.vertexIndices.length < 3) return [];
  if (face.vertexIndices.length === 3) return [...face.vertexIndices];

  // Calculate face normal using Newell's method
  const normal = calculateFaceNormal(vertices, face);

  // Project vertices onto best-fit plane
  const vertices2D = projectVerticesToPlane(vertices, face, normal);

  // Create working copy of indices
  const remainingIndices = Array.from(Array(vertices2D.length).keys());
  const triangles: number[] = [];

  // Ear clipping algorithm
  while (remainingIndices.length > 3) {
    let earFound = false;
    for (let i = 0; i < remainingIndices.length; i++) {
      if (isEar(vertices2D, i, remainingIndices)) {
        const n = remainingIndices.length;
        const prev = remainingIndices[(i - 1 + n) % n];
        const curr = remainingIndices[i];
        const next = remainingIndices[(i + 1) % n];

        triangles.push(
          face.vertexIndices[prev],
          face.vertexIndices[curr],
          face.vertexIndices[next],
        );
        remainingIndices.splice(i, 1);
        earFound = true;
        break;
      }
    }

    // Fallback to simple triangulation if no ear is found
    if (!earFound) {
      console.warn("No ear found, falling back to simple triangulation");
      const first = face.vertexIndices[0];
      for (let i = 1; i < face.vertexIndices.length - 1; i++) {
        triangles.push(first, face.vertexIndices[i], face.vertexIndices[i + 1]);
      }
      break;
    }
  }

  // Add final triangle
  if (remainingIndices.length === 3) {
    triangles.push(
      face.vertexIndices[remainingIndices[0]],
      face.vertexIndices[remainingIndices[1]],
      face.vertexIndices[remainingIndices[2]],
    );
  }

  return triangles;
}
