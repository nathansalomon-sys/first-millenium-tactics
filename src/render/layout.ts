/**
 * Hex <-> pixel layout for pointy-top hexes. Pure math, no Phaser, so it can be
 * unit-tested. `size` is the distance from a hex's center to a corner.
 */
import { type Hex, offsetToAxial } from '../engine/hex';

export interface Point {
  readonly x: number;
  readonly y: number;
}

const SQRT3 = Math.sqrt(3);

/** Pixel center of a hex, relative to the center of hex (0, 0). */
export function hexToPixel(h: Hex, size: number): Point {
  return { x: size * SQRT3 * (h.q + h.r / 2), y: size * 1.5 * h.r };
}

/** The six corners of a hex, clockwise from the top-right. */
export function hexCorners(center: Point, size: number): Point[] {
  const corners: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    corners.push({ x: center.x + size * Math.cos(angle), y: center.y + size * Math.sin(angle) });
  }
  return corners;
}

/** Pixel size of a cols x rows board stored in odd-r offset coordinates. */
export function boardPixelSize(cols: number, rows: number, size: number): Point {
  return { x: SQRT3 * size * (cols + 0.5), y: size * (1.5 * rows + 0.5) };
}

/** Largest hex size that fits a cols x rows board inside the given area. */
export function fitHexSize(cols: number, rows: number, width: number, height: number): number {
  return Math.min(width / (SQRT3 * (cols + 0.5)), height / (1.5 * rows + 0.5));
}

/** Pixel center of an offset cell, with the board's top-left corner at (0, 0). */
export function cellCenter(col: number, row: number, size: number): Point {
  const p = hexToPixel(offsetToAxial({ col, row }), size);
  return { x: p.x + (SQRT3 * size) / 2, y: p.y + size };
}
