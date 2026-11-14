import { describe, expect, it } from 'vitest';
import { boardPixelSize, cellCenter, fitHexSize, hexCorners } from './layout';

describe('board layout', () => {
  it('fits a 20 x 14 board inside the screen in landscape and portrait', () => {
    for (const [width, height] of [
      [1280, 720],
      [844, 390],
      [390, 844],
    ] as const) {
      const size = fitHexSize(20, 14, width, height);
      const board = boardPixelSize(20, 14, size);
      expect(board.x).toBeLessThanOrEqual(width + 1e-6);
      expect(board.y).toBeLessThanOrEqual(height + 1e-6);
    }
  });

  it('keeps every hex corner inside the board bounds', () => {
    const size = 20;
    const board = boardPixelSize(20, 14, size);
    for (let row = 0; row < 14; row++) {
      for (let col = 0; col < 20; col++) {
        for (const corner of hexCorners(cellCenter(col, row, size), size)) {
          expect(corner.x).toBeGreaterThanOrEqual(-1e-6);
          expect(corner.y).toBeGreaterThanOrEqual(-1e-6);
          expect(corner.x).toBeLessThanOrEqual(board.x + 1e-6);
          expect(corner.y).toBeLessThanOrEqual(board.y + 1e-6);
        }
      }
    }
  });
});
