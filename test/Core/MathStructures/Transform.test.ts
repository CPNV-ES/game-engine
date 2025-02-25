import { describe, it, expect } from "vitest";
import { Transform } from "@core/MathStructures/Transform.ts";

describe("Transform", (): void => {
  it("should have default values on instanciate", () => {
    const emptyTransform = new Transform();

    expect(emptyTransform.position.x).toBe(0);
    expect(emptyTransform.position.y).toBe(0);

    expect(emptyTransform.rotation).toBe(0);

    expect(emptyTransform.scale.x).toBe(1);
    expect(emptyTransform.scale.y).toBe(1);
  });
});
