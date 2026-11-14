/**
 * Placeholder board: draws an empty 20 x 14 hex grid that always fits the
 * screen. It proves the toolchain works on PC and phone; the real board
 * (terrain, units, camera) is built by the tickets in docs/BACKLOG.md.
 */
import Phaser from 'phaser';
import { rules } from '../data';
import { boardPixelSize, cellCenter, fitHexSize, hexCorners } from './layout';

const COLORS = {
  background: 0x1f2421,
  hexFill: 0xa7b88a,
  hexFillAlt: 0x9fb082,
  hexLine: 0x4b5a3c,
  text: '#e8e6d9',
};

const MARGIN = 16;
const HEADER = 36;

export class BoardScene extends Phaser.Scene {
  private board!: Phaser.GameObjects.Graphics;
  private title!: Phaser.GameObjects.Text;

  constructor() {
    super('board');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.board = this.add.graphics();
    this.title = this.add.text(MARGIN, 8, 'FMT — board placeholder', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: COLORS.text,
    });

    this.draw();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.draw, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.draw, this);
    });
  }

  private draw(): void {
    const cols = rules.board.suggestedWidth;
    const rows = rules.board.suggestedHeight;
    const { width, height } = this.scale;

    const size = fitHexSize(cols, rows, width - 2 * MARGIN, height - HEADER - MARGIN);
    const boardSize = boardPixelSize(cols, rows, size);
    const originX = (width - boardSize.x) / 2;
    const originY = HEADER + (height - HEADER - MARGIN - boardSize.y) / 2;

    this.board.clear();
    this.board.lineStyle(Math.max(1, size * 0.06), COLORS.hexLine, 1);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const center = cellCenter(col, row, size);
        const corners = hexCorners({ x: originX + center.x, y: originY + center.y }, size);
        this.board.fillStyle((col + row) % 2 === 0 ? COLORS.hexFill : COLORS.hexFillAlt, 1);
        this.board.beginPath();
        corners.forEach((corner, i) => {
          if (i === 0) this.board.moveTo(corner.x, corner.y);
          else this.board.lineTo(corner.x, corner.y);
        });
        this.board.closePath();
        this.board.fillPath();
        this.board.strokePath();
      }
    }

    this.title.setText(`FMT — board placeholder (${cols} × ${rows})`);
  }
}
