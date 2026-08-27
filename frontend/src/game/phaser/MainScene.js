import Phaser from 'phaser';
import { EventBus } from './EventBus';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.unlockedTowns = {
      1: true,
      2: false,
      3: false
    };
    this.propsGroup = null;
    this.cloudsGroup = null;
    this.worldGraphics = null;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#0ea5e9'); // Ocean blue

    // Setup Camera
    const cam = this.cameras.main;
    cam.setZoom(0.6);
    cam.centerOn(0, 800);
    
    // Zoom
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      let newZoom = cam.zoom - (deltaY * 0.001);
      newZoom = Phaser.Math.Clamp(newZoom, 0.2, 3);
      cam.setZoom(newZoom);
    });

    // Panning
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
      cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;
    });

    this.worldGraphics = this.add.graphics();
    this.propsGroup = this.add.group();
    this.cloudsGroup = this.add.group();

    this.renderWorld();
    this.createClouds();

    // Listen to React (if needed) to force unlock
    EventBus.on('force:unlock', (data) => {
      if (data.town === 2) this.unlockTownTwo();
    });
  }

  // --- Safe Color Math ---
  applyColorFilter(hexColor, isLocked) {
    if (!isLocked) return hexColor;
    const color = Phaser.Display.Color.IntegerToColor(hexColor);
    const gray = Math.floor(color.red * 0.3 + color.green * 0.59 + color.blue * 0.11);
    return Phaser.Display.Color.GetColor(gray, gray, gray);
  }

  lightenColor(hexColor, amount) {
    const c = Phaser.Display.Color.IntegerToColor(hexColor);
    return Phaser.Display.Color.GetColor(
      Math.min(255, c.red + amount),
      Math.min(255, c.green + amount),
      Math.min(255, c.blue + amount)
    );
  }

  darkenColor(hexColor, amount) {
    const c = Phaser.Display.Color.IntegerToColor(hexColor);
    return Phaser.Display.Color.GetColor(
      Math.max(0, c.red - amount),
      Math.max(0, c.green - amount),
      Math.max(0, c.blue - amount)
    );
  }

  cartesianToIso(col, row, tileW, tileH) {
    const x = (col - row) * (tileW / 2);
    const y = (col + row) * (tileH / 2);
    return { x, y };
  }

  // --- RENDER ENGINE ---
  renderWorld() {
    this.worldGraphics.clear();
    this.propsGroup.clear(true, true); // Destroy old props (tweens included)

    const tileW = 128;
    const tileH = 64;
    const size = 35; // 35x35 map

    // Base Island
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        
        // Define regions
        const isTown1 = (c >= 5 && c <= 15 && r >= 20 && r <= 30);
        const isTown2 = (c >= 20 && c <= 30 && r >= 15 && r <= 25);
        const isTown3 = (c >= 10 && c <= 20 && r >= 5 && r <= 15);
        const isPath = (c === 15 && r >= 15 && r <= 20) || (c >= 15 && c <= 20 && r === 15) || (c === 15 && r >= 5 && r <= 15);

        if (!isTown1 && !isTown2 && !isTown3 && !isPath) continue; // Skip water

        // Determine if this tile is locked based on region
        let locked = false;
        if (isTown2 && !this.unlockedTowns[2]) locked = true;
        if (isTown3 && !this.unlockedTowns[3]) locked = true;
        
        let color = isPath ? 0xd4d4d8 : 0x22c55e;
        color = this.applyColorFilter(color, locked);

        this.drawIsoTile(this.worldGraphics, c, r, tileW, tileH, color);

        // Add random trees on grass
        if (!isPath && Math.random() > 0.9) {
           this.drawTree(c, r, tileW, tileH, locked);
        }
      }
    }

    // --- Buildings ---
    // Town 1 (Always unlocked)
    this.drawBuilding(10, 25, tileW, tileH, 0x3b82f6, 120, false, 1, "Data Structures");
    this.drawBuilding(12, 22, tileW, tileH, 0xf97316, 90, false, 4, "Arrays");
    this.drawPerson(11, 26, tileW, tileH, false);
    this.drawPerson(9, 24, tileW, tileH, false);

    // Town 1 Goal Bubble (Click to unlock Town 2)
    const isoG = this.cartesianToIso(14, 21, tileW, tileH);
    this.createFloatingMarker(isoG.x, isoG.y - 60, "Click to\nUnlock Town 2!", () => this.unlockTownTwo());

    // Town 2 (OOP)
    const locked2 = !this.unlockedTowns[2];
    this.drawBuilding(25, 20, tileW, tileH, 0xef4444, 150, locked2, 2, "OOP");
    this.drawBuilding(28, 18, tileW, tileH, 0x8b5cf6, 100, locked2, 5, "Classes");
    this.drawPerson(24, 21, tileW, tileH, locked2);
    
    // Town 3 (Cryptography)
    const locked3 = !this.unlockedTowns[3];
    this.drawBuilding(15, 10, tileW, tileH, 0xeab308, 180, locked3, 3, "Cryptography");
    this.drawPerson(16, 11, tileW, tileH, locked3);
  }

  // --- DRAW PRIMITIVES ---
  drawIsoTile(g, c, r, w, h, color) {
    const iso = this.cartesianToIso(c, r, w, h);
    g.fillStyle(color, 1);
    g.lineStyle(1, 0x000000, 0.15); // grid lines
    g.beginPath();
    g.moveTo(iso.x, iso.y - h / 2);
    g.lineTo(iso.x + w / 2, iso.y);
    g.lineTo(iso.x, iso.y + h / 2);
    g.lineTo(iso.x - w / 2, iso.y);
    g.closePath();
    g.fillPath();
    g.strokePath();
  }

  drawBuilding(c, r, tileW, tileH, colorHex, height, isLocked, topicId, topicName) {
    const iso = this.cartesianToIso(c, r, tileW, tileH);
    const x = iso.x;
    const y = iso.y;
    
    const color = this.applyColorFilter(colorHex, isLocked);
    const topColor = this.applyColorFilter(this.lightenColor(colorHex, 40), isLocked);
    const rightColor = this.applyColorFilter(this.darkenColor(colorHex, 40), isLocked);

    const g = this.add.graphics();
    this.propsGroup.add(g);

    // Faces
    g.fillStyle(topColor, 1);
    g.lineStyle(2, 0x000000, 0.4);
    g.beginPath();
    g.moveTo(x, y - height - tileH/2);
    g.lineTo(x + tileW/2, y - height);
    g.lineTo(x, y - height + tileH/2);
    g.lineTo(x - tileW/2, y - height);
    g.closePath();
    g.fillPath(); g.strokePath();

    g.fillStyle(rightColor, 1);
    g.beginPath();
    g.moveTo(x + tileW/2, y - height);
    g.lineTo(x, y - height + tileH/2);
    g.lineTo(x, y + tileH/2);
    g.lineTo(x + tileW/2, y);
    g.closePath();
    g.fillPath(); g.strokePath();

    g.fillStyle(color, 1);
    g.beginPath();
    g.moveTo(x - tileW/2, y - height);
    g.lineTo(x, y - height + tileH/2);
    g.lineTo(x, y + tileH/2);
    g.lineTo(x - tileW/2, y);
    g.closePath();
    g.fillPath(); g.strokePath();

    if (!isLocked) {
      this.createFloatingMarker(x, y - height - 50, topicName, () => {
        EventBus.emit('quiz:trigger', { id: topicId, title: topicName });
      });
    }
  }

  drawTree(c, r, tileW, tileH, isLocked) {
    const iso = this.cartesianToIso(c, r, tileW, tileH);
    const g = this.add.graphics();
    this.propsGroup.add(g);

    const trunkColor = this.applyColorFilter(0x78350f, isLocked);
    const leavesColor = this.applyColorFilter(0x15803d, isLocked);

    // Trunk
    g.fillStyle(trunkColor, 1);
    g.fillRect(iso.x - 5, iso.y - 20, 10, 20);

    // Leaves (Cone)
    g.fillStyle(leavesColor, 1);
    g.fillTriangle(iso.x - 20, iso.y - 15, iso.x + 20, iso.y - 15, iso.x, iso.y - 60);
    g.fillTriangle(iso.x - 15, iso.y - 35, iso.x + 15, iso.y - 35, iso.x, iso.y - 80);

    // Sway animation if unlocked
    if (!isLocked) {
      g.setOrigin(0.5, 1);
      g.setPosition(g.x, g.y); // Fix origin offset
      this.tweens.add({
        targets: g,
        angle: Phaser.Math.Between(-3, 3),
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  drawPerson(c, r, tileW, tileH, isLocked) {
    const iso = this.cartesianToIso(c, r, tileW, tileH);
    const g = this.add.graphics();
    this.propsGroup.add(g);

    const headColor = this.applyColorFilter(0xfcd34d, isLocked);
    const bodyColor = this.applyColorFilter(0xec4899, isLocked);

    g.fillStyle(bodyColor, 1);
    g.fillRoundedRect(iso.x - 8, iso.y - 20, 16, 20, 4);
    g.fillStyle(headColor, 1);
    g.fillCircle(iso.x, iso.y - 25, 8);

    if (!isLocked) {
      this.tweens.add({
        targets: g,
        y: '-=10',
        duration: Phaser.Math.Between(300, 600),
        yoyo: true,
        repeat: -1,
        ease: 'Quad.easeOut',
        delay: Phaser.Math.Between(0, 1000)
      });
    }
  }

  createFloatingMarker(x, y, textStr, onClick) {
    const container = this.add.container(x, y);
    this.propsGroup.add(container);

    const bubble = this.add.graphics();
    bubble.fillStyle(0xffffff, 1);
    bubble.lineStyle(3, 0xd1d5db, 1);
    bubble.fillRoundedRect(-50, -25, 100, 50, 16);
    bubble.strokeRoundedRect(-50, -25, 100, 50, 16);
    
    // Bubble tail
    bubble.fillTriangle(-10, 24, 10, 24, 0, 35);
    bubble.strokeTriangle(-10, 24, 10, 24, 0, 35);

    const text = this.add.text(0, 0, textStr, { fontSize: '12px', color: '#000', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);

    container.add([bubble, text]);

    const zone = this.add.zone(0, 0, 100, 60).setInteractive({ cursor: 'pointer' });
    container.add(zone);

    zone.on('pointerdown', onClick);

    this.tweens.add({
      targets: container,
      y: '-=15',
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createClouds() {
    for(let i=0; i<15; i++) {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.4);
      const x = Phaser.Math.Between(-1000, 2000);
      const y = Phaser.Math.Between(-500, 2000);
      
      g.fillCircle(x, y, Phaser.Math.Between(50, 150));
      g.fillCircle(x + 50, y - 30, Phaser.Math.Between(50, 100));
      g.fillCircle(x - 50, y - 20, Phaser.Math.Between(50, 100));

      this.cloudsGroup.add(g);

      this.tweens.add({
        targets: g,
        x: '+=2000',
        duration: Phaser.Math.Between(40000, 80000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  unlockTownTwo() {
    if (this.unlockedTowns[2]) return;
    
    // Add white flash effect
    const flash = this.add.rectangle(0, 0, 5000, 5000, 0xffffff, 1).setOrigin(0.5);
    flash.setScrollFactor(0);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => flash.destroy()
    });

    this.unlockedTowns[2] = true;
    
    // Re-render the world so colors are restored and animations start!
    this.renderWorld();
    
    // Update API visually 
    EventBus.emit('quiz:complete', { success: true, message: 'Town 2 Unlocked!' });
  }
}
