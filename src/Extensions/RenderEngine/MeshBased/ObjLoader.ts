import { MeshData, Face, triangulate } from "./MeshData.ts";

/**
 * Loads an OBJ file and returns the mesh data.
 */
export class ObjLoader {
  private static readonly _cache = new Map<string, MeshData>();
  private static readonly _objectLoadingPromises = new Map<
    string,
    Promise<MeshData>
  >();

  /**
   * Loads an OBJ file and returns the mesh data.
   * @param url
   */
  public static async load(url: string): Promise<MeshData> {
    if (this._cache.has(url)) {
      return this._cache.get(url)!;
    }
    if (this._objectLoadingPromises.has(url)) {
      return await this._objectLoadingPromises.get(url)!;
    }

    const asyncLoadPromise = (async () => {
      const response = await fetch(url);
      const text = await response.text();
      const meshData = this.parse(text);

      // Process faces and indices
      let finalIndices: number[] = [];

      // If we have faces, triangulate them
      if (meshData.faces && meshData.faces.length > 0) {
        for (const face of meshData.faces) {
          const triangulatedIndices = triangulate(meshData.vertices, face);
          finalIndices.push(...triangulatedIndices);
        }
      }
      // If we have direct indices, use them
      else if (meshData.indices) {
        finalIndices = Array.from(meshData.indices);
      }

      // Ensure we have valid indices
      if (finalIndices.length === 0) {
        console.warn("No faces or indices found in mesh data");
        finalIndices = [0, 0, 0]; // Default triangle to prevent crashes
      }

      // Ensure we have an even number of indices
      if (finalIndices.length % 2 !== 0) {
        finalIndices.push(finalIndices[finalIndices.length - 1]);
      }

      meshData.indices = new Uint16Array(finalIndices);
      return meshData;
    })();

    this._objectLoadingPromises.set(url, asyncLoadPromise);
    const meshData = await asyncLoadPromise;

    this._cache.set(url, meshData);
    return meshData;
  }

  /**
   * Parses the OBJ file text and returns the mesh data.
   * @param objText
   * @private
   */
  private static parse(objText: string): MeshData {
    const rawVertices: number[] = [];
    const rawNormals: number[] = [];
    const rawUvs: number[] = [];
    const faces: Face[] = [];
    const vertexData: number[] = [];
    const processedVertices = new Map<string, number>();

    const lines = objText.split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      switch (parts[0]) {
        case "v":
          rawVertices.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3]),
          );
          break;
        case "vn":
          rawNormals.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3]),
          );
          break;
        case "vt":
          rawUvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
          break;
        case "f":
          const face: Face = {
            vertexIndices: [],
            uvIndices: [],
            normalIndices: [],
          };

          // Process each vertex of the face
          for (let i = 1; i < parts.length; i++) {
            const vertexParts = parts[i].split("/");
            const vertKey = parts[i]; // Use the full vertex definition as key

            let vertexIndex: number;
            if (processedVertices.has(vertKey)) {
              vertexIndex = processedVertices.get(vertKey)!;
            } else {
              const vi = parseInt(vertexParts[0]) - 1;
              const vti = vertexParts[1] ? parseInt(vertexParts[1]) - 1 : -1;
              const vni = vertexParts[2] ? parseInt(vertexParts[2]) - 1 : -1;

              // Add vertex data
              vertexData.push(
                rawVertices[vi * 3],
                rawVertices[vi * 3 + 1],
                rawVertices[vi * 3 + 2],
                vni >= 0 ? rawNormals[vni * 3] : 0,
                vni >= 0 ? rawNormals[vni * 3 + 1] : 0,
                vni >= 0 ? rawNormals[vni * 3 + 2] : 0,
                vti >= 0 ? rawUvs[vti * 2] : 0,
                vti >= 0 ? rawUvs[vti * 2 + 1] : 0,
              );

              vertexIndex = vertexData.length / 8 - 1;
              processedVertices.set(vertKey, vertexIndex);
            }

            face.vertexIndices.push(vertexIndex);
          }

          faces.push(face);
          break;
      }
    }

    return {
      vertices: new Float32Array(vertexData),
      faces: faces,
    };
  }
}
