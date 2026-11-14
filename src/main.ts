import Phaser from 'phaser';
import { BoardScene } from './render/BoardScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1f2421',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: '100%',
    height: '100%',
  },
  scene: [BoardScene],
});
