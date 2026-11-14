/**
 * Hex grid math in axial coordinates (q, r).
 *
 * Reference: https://www.redblobgames.com/grids/hexagons/
 *
 * Everything here is pure and orientation-agnostic except the compass names in
 * DIRECTION_NAMES, which assume pointy-top hexes with r growing downward
 * (provisional — see "Hex orientation" in docs/DECISIONS.md).
 */

export interface Hex {
  readonly q: number;
  readonly r: number;
}

/** A hexside / facing, 0–5, going clockwise from East on a pointy-top grid. */
export type Direction = 0 | 1 | 2 | 3 | 4 | 5;

export const DIRECTIONS: readonly Direction[] = [0, 1, 2, 3, 4, 5];

export const DIRECTION_NAMES = ['E', 'SE', 'SW', 'W', 'NW', 'NE'] as const;

const DIRECTION_VECTORS: readonly Hex[] = [
  { q: 1, r: 0 }, // 0 E
  { q: 0, r: 1 }, // 1 SE
  { q: -1, r: 1 }, // 2 SW
  { q: -1, r: 0 }, // 3 W
  { q: 0, r: -1 }, // 4 NW
  { q: 1, r: -1 }, // 5 NE
];

export function hex(q: number, r: number): Hex {
  return { q, r };
}

export function hexEquals(a: Hex, b: Hex): boolean {
  return a.q === b.q && a.r === b.r;
}

/** Stable string key, for Maps and Sets. */
export function hexKey(h: Hex): string {
  return `${h.q},${h.r}`;
}

export function hexAdd(a: Hex, b: Hex): Hex {
  return { q: a.q + b.q, r: a.r + b.r };
}

export function directionVector(direction: Direction): Hex {
  // The index is always 0–5, so the lookup cannot miss.
  return DIRECTION_VECTORS[direction] as Hex;
}

export function neighbor(h: Hex, direction: Direction): Hex {
  return hexAdd(h, directionVector(direction));
}

export function neighbors(h: Hex): Hex[] {
  return DIRECTIONS.map((d) => neighbor(h, d));
}

/** Number of hex steps between two hexes. */
export function hexDistance(a: Hex, b: Hex): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Direction from `from` to an adjacent hex `to`, or null if they are not adjacent. */
export function directionTo(from: Hex, to: Hex): Direction | null {
  for (const d of DIRECTIONS) {
    if (hexEquals(neighbor(from, d), to)) return d;
  }
  return null;
}

/** Rotate a facing by a number of hexsides (positive = clockwise). */
export function rotate(direction: Direction, steps: number): Direction {
  return ((((direction + steps) % 6) + 6) % 6) as Direction;
}

export function opposite(direction: Direction): Direction {
  return rotate(direction, 3);
}

/**
 * Rectangular maps are stored as (col, row) in "odd-r" offset coordinates:
 * odd rows are shoved half a hex to the right. The engine works in axial.
 */
export interface Offset {
  readonly col: number;
  readonly row: number;
}

export function offsetToAxial(o: Offset): Hex {
  return { q: o.col - (o.row - (o.row & 1)) / 2, r: o.row };
}

export function axialToOffset(h: Hex): Offset {
  return { col: h.q + (h.r - (h.r & 1)) / 2, row: h.r };
}
