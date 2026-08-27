import Phaser from 'phaser';
import { EventBus } from './EventBus';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // We don't need external tilesets for this prototype!
    // We will draw everything using Phaser Graphics.
  }

  create() {
    this.cameras.main.setBackgroundColor('#4ade80'); // Green base ground

    // Setup Camera for Drag and Zoom
    const cam = this.cameras.main;
    cam.setZoom(1);
    cam.centerOn(0, 0);
    
    // Zoom with scroll wheel
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      let newZoom = cam.zoom - (deltaY * 0.001);
      newZoom = Phaser.Math.Clamp(newZoom, 0.5, 3);
      cam.setZoom(newZoom);
    });

    // Drag to pan
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
      cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;
    });

    // Render the Isometric City
    this.createIsometricWorld();
  }

  // Helper to convert 2D Cartesian grid (col, row) to Isometric (x, y)
  cartesianToIso(col, row, tileWidth, tileHeight) {
    const x = (col - row) * (tileWidth / 2);
    const y = (col + row) * (tileHeight / 2);
    return { x, y };
  }

  createIsometricWorld() {
    const tileW = 128;
    const tileH = 64;
    const cols = 15;
    const rows = 15;

    // 1. Draw Grid / Ground (Grass and Paths)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const iso = this.cartesianToIso(c, r, tileW, tileH);
        
        // Make a simple path down the middle
        const isPath = (c === 7 || r === 7);
        const color = isPath ? 0xd4d4d8 : 0x22c55e; // Grey path, green grass

        this.drawIsoTile(iso.x, iso.y, tileW, tileH, color);
      }
    }

    // 2. Draw Buildings (Isometric Cubes)
    // We'll place a few buildings at specific grid coordinates
    this.createBuilding(5, 5, tileW, tileH, 0x3b82f6, 100, 1, "Data Structures"); // Blue building
    this.createBuilding(10, 3, tileW, tileH, 0xef4444, 150, 2, "OOP"); // Red building
    this.createBuilding(3, 10, tileW, tileH, 0xeab308, 120, 3, "Cryptography"); // Yellow building
  }

  drawIsoTile(x, y, w, h, color) {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.lineStyle(1, 0x000000, 0.1); // subtle grid line

    graphics.beginPath();
    graphics.moveTo(x, y - h / 2); // Top
    graphics.lineTo(x + w / 2, y); // Right
    graphics.lineTo(x, y + h / 2); // Bottom
    graphics.lineTo(x - w / 2, y); // Left
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
  }

  createBuilding(col, row, tileW, tileH, color, height, topicId, topicName) {
    const iso = this.cartesianToIso(col, row, tileW, tileH);
    const x = iso.x;
    const y = iso.y;
    
    const graphics = this.add.graphics();
    
    // Top face (lighter)
    const topColor = Phaser.Display.Color.IntegerToColor(color).lighten(20).color;
    graphics.fillStyle(topColor, 1);
    graphics.lineStyle(1, 0x000000, 0.5);
    graphics.beginPath();
    graphics.moveTo(x, y - height - tileH/2);
    graphics.lineTo(x + tileW/2, y - height);
    graphics.lineTo(x, y - height + tileH/2);
    graphics.lineTo(x - tileW/2, y - height);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Right face (darker)
    const rightColor = Phaser.Display.Color.IntegerToColor(color).darken(20).color;
    graphics.fillStyle(rightColor, 1);
    graphics.beginPath();
    graphics.moveTo(x + tileW/2, y - height);
    graphics.lineTo(x, y - height + tileH/2);
    graphics.lineTo(x, y + tileH/2);
    graphics.lineTo(x + tileW/2, y);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Left face (base color)
    graphics.fillStyle(color, 1);
    graphics.beginPath();
    graphics.moveTo(x - tileW/2, y - height);
    graphics.lineTo(x, y - height + tileH/2);
    graphics.lineTo(x, y + tileH/2);
    graphics.lineTo(x - tileW/2, y);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // 3. Add Floating Interactive Marker (Bubble) above the building
    this.createFloatingMarker(x, y - height - 40, topicId, topicName);
  }

  createFloatingMarker(x, y, topicId, topicName) {
    // The bubble
    const bubble = this.add.graphics();
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(3, 0xd1d5db, 1);
    bubble.fillCircle(x, y, 25);
    bubble.strokeCircle(x, y, 25);

    // Give it a shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.2);
    shadow.fillEllipse(x, y + 40, 30, 10);

    // Make it interactive by placing an invisible Zone over it
    const zone = this.add.zone(x, y, 50, 50).setInteractive({ cursor: 'pointer' });

    zone.on('pointerdown', () => {
      console.log(`Clicked building: ${topicName}`);
      EventBus.emit('quiz:trigger', { id: topicId, title: topicName });
    });

    // Add Bobbing Tween
    this.tweens.add({
      targets: [bubble, zone],
      y: '+=10',
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Fade shadow with bounce
    this.tweens.add({
      targets: shadow,
      alpha: 0.5,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
