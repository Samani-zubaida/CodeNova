import Phaser from 'phaser';
import MainScene from './MainScene';

export const GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [MainScene]
};
