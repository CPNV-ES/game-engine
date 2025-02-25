/**
 * MeshData is a data structure that holds the vertices and indices of a mesh.
 * Vertices are stored as a Float32Array with 3 floats for position and 2 floats for UV coordinates.
 */
export interface MeshData {
  vertices: Float32Array; // 3 floats for position + 2 floats for UV coordinates
  indices: Uint16Array;
}
