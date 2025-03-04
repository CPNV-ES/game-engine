import { MeshData } from "./MeshData.ts";

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
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const vertexData: number[] = [];

    const lines = objText.split("\n");
    for (const line of lines) {
      const parts = line.trim().split(" ");
      if (parts[0] === "v") {
        vertices.push(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3]),
        );
      } else if (parts[0] === "vn") {
        normals.push(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3]),
        );
      } else if (parts[0] === "vt") {
        uvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
      } else if (parts[0] === "f") {
        for (let i = 1; i <= 3; i++) {
          const vertexParts = parts[i].split("/");
          const vertexIndex = parseInt(vertexParts[0]) - 1;
          const uvIndex = parseInt(vertexParts[1]) - 1;
          const normalIndex = parseInt(vertexParts[2]) - 1;

          vertexData.push(
            vertices[vertexIndex * 3],
            vertices[vertexIndex * 3 + 1],
            vertices[vertexIndex * 3 + 2],
            normals[normalIndex * 3],
            normals[normalIndex * 3 + 1],
            normals[normalIndex * 3 + 2],
            uvs[uvIndex * 2],
            uvs[uvIndex * 2 + 1],
          );
          indices.push(indices.length);
        }
      }
    }

    if (indices.length % 2 !== 0) {
      indices.push(0);
    }

    return {
      vertices: new Float32Array(vertexData),
      indices: new Uint16Array(indices),
    };
  }
}
