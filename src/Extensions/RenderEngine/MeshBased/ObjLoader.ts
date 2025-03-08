import { MeshData, Face } from "./MeshData.ts";

/**
 * Loads an OBJ file and returns the mesh data.
 */
export class ObjLoader {
  /**
   * Loads an OBJ file and returns the mesh data.
   * @param url
   */
  public static async load(url: string): Promise<MeshData> {
    const response = await fetch(url);
    const text = await response.text();
    return this.parse(text);
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
