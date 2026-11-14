import { describe, expect, it } from 'vitest';
import {
  DIRECTIONS,
  axialToOffset,
  directionTo,
  hex,
  hexDistance,
  hexEquals,
  hexKey,
  neighbor,
  neighbors,
  offsetToAxial,
  opposite,
  rotate,
} from './hex';

describe('hex neighbors', () => {
  it('has six distinct neighbors, each one step away', () => {
    const origin = hex(3, -2);
    const around = neighbors(origin);
    expect(new Set(around.map(hexKey)).size).toBe(6);
    for (const n of around) expect(hexDistance(origin, n)).toBe(1);
  });

  it('stepping out and back in the opposite direction returns to the start', () => {
    const origin = hex(0, 0);
    for (const d of DIRECTIONS) {
      const back = neighbor(neighbor(origin, d), opposite(d));
      expect(hexEquals(back, origin)).toBe(true);
    }
  });
});

describe('hexDistance', () => {
  it('is zero for the same hex and symmetric', () => {
    expect(hexDistance(hex(2, 5), hex(2, 5))).toBe(0);
    expect(hexDistance(hex(0, 0), hex(3, -1))).toBe(hexDistance(hex(3, -1), hex(0, 0)));
  });

  it('counts steps along a straight line and across axes', () => {
    expect(hexDistance(hex(0, 0), hex(4, 0))).toBe(4);
    expect(hexDistance(hex(0, 0), hex(0, 4))).toBe(4);
    expect(hexDistance(hex(0, 0), hex(2, -4))).toBe(4);
    expect(hexDistance(hex(0, 0), hex(2, 2))).toBe(4);
  });
});

describe('directions', () => {
  it('finds the direction to an adjacent hex, and null otherwise', () => {
    const origin = hex(1, 1);
    for (const d of DIRECTIONS) expect(directionTo(origin, neighbor(origin, d))).toBe(d);
    expect(directionTo(origin, hex(3, 1))).toBeNull();
    expect(directionTo(origin, origin)).toBeNull();
  });

  it('rotates clockwise and counter-clockwise with wrap-around', () => {
    expect(rotate(0, 1)).toBe(1);
    expect(rotate(5, 1)).toBe(0);
    expect(rotate(0, -1)).toBe(5);
    expect(rotate(2, 6)).toBe(2);
    expect(rotate(2, -14)).toBe(0);
  });
});

describe('offset <-> axial', () => {
  it('round-trips every cell of a 20 x 14 map', () => {
    for (let row = 0; row < 14; row++) {
      for (let col = 0; col < 20; col++) {
        expect(axialToOffset(offsetToAxial({ col, row }))).toEqual({ col, row });
      }
    }
  });

  it('keeps horizontally adjacent cells one step apart on even and odd rows', () => {
    for (const row of [0, 1, 6, 7]) {
      const a = offsetToAxial({ col: 4, row });
      const b = offsetToAxial({ col: 5, row });
      expect(hexDistance(a, b)).toBe(1);
    }
  });

  it('keeps vertically touching cells one step apart', () => {
    // Odd rows are shoved right, so (col, odd row) touches (col, row - 1) and (col + 1, row - 1).
    const odd = offsetToAxial({ col: 4, row: 3 });
    expect(hexDistance(odd, offsetToAxial({ col: 4, row: 2 }))).toBe(1);
    expect(hexDistance(odd, offsetToAxial({ col: 5, row: 2 }))).toBe(1);
    expect(hexDistance(odd, offsetToAxial({ col: 3, row: 2 }))).toBe(2);
  });
});
