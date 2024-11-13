import {describe, it, expect, vi, Mock} from 'vitest';
import {Vector2} from '../../../src/Core/MathStructures/Vector2';

describe('Vector2', (): void => {

    it('should instance a vector', () => {
        const vector: Vector2 = new Vector2(1, 2);

        expect(vector.x).toBe(1);
    });

    it('should add two vectors', (): void => {
        const vector1: Vector2 = new Vector2(1, 2);
        const vector2: Vector2 = new Vector2(3, 4);

        vector1.add(vector2);

        expect(vector1.x).toBe(4);
        expect(vector1.y).toBe(6);
    });

    it('should subtract two vectors', (): void => {
        const vector1: Vector2 = new Vector2(1, 2);
        const vector2: Vector2 = new Vector2(3, 4);

        vector1.sub(vector2);

        expect(vector1.x).toBe(-2);
        expect(vector1.y).toBe(-2);
    });

    it('should rotate a vector (90 deg)', (): void => {
        const vector: Vector2 = new Vector2(1, 0);

        vector.rotate(Math.PI / 2);

        expect(vector.x).toBeCloseTo(0);
        expect(vector.y).toBeCloseTo(1);
    });

    it('should rotate a vector (180 deg)', (): void => {
        const vector: Vector2 = new Vector2(1, 0);

        vector.rotate(Math.PI);

        expect(vector.x).toBeCloseTo(-1);
        expect(vector.y).toBeCloseTo(0);
    });

    it('should rotate a vector (283 deg)', () => {
        const vector: Vector2 = new Vector2(1, 0);

        vector.rotate(283 * Math.PI / 180);

        expect(vector.x).toBeCloseTo(0.224951054343865);
        expect(vector.y).toBeCloseTo(-0.974370064785235);
    });

    it('should scale a vector', (): void => {
        const vector: Vector2 = new Vector2(1, 2);

        vector.scale(2);

        expect(vector.x).toBe(2);
        expect(vector.y).toBe(4);
    });

    it('should normalize a vector', (): void => {
        const vector: Vector2 = new Vector2(3, 4);

        vector.normalize();

        expect(vector.length).toBeCloseTo(1);
        expect(vector.x).toBe(0.6);
        expect(vector.y).toBe(0.8);
    });
});
