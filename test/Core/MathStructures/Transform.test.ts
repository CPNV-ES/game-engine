import {describe, it, expect, vi, Mock} from 'vitest';
import {Transform} from "../../../src/Core/MathStructures/Transform";

describe('Transform', (): void => {
    it('should have default values on instanciate', () => {
        const emptyTransform = new Transform();

        expect(emptyTransform.position.x).toBe(0);
        expect(emptyTransform.position.y).toBe(0);

        expect(emptyTransform.rotation).toBe(0);

        expect(emptyTransform.scale.x).toBe(1);
        expect(emptyTransform.scale.y).toBe(1);
    });
});
