import Phaser from 'phaser';

/**
 * VillageScene — Code Nova's explorable village homepage.
 * 
 * - Camera locked on player at all times (person is ALWAYS in frame and centered)
 * - The site/world smoothly moves along with the person
 * - Realistic, familiar 8-direction walking with feet-based collision and wall sliding
 * - Natural idle standing poses when stopping
 * - Exact door coordinates located at the main front doors of each house
 * - Emits 'burn' event when stepping into the main entrance of any building
 */
export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.onZoneEvent = null;
    this.currentZone = null;
    this.SPEED = 180;
    this.isDoorTransition = false;
    this.facing = 'down'; // 'down', 'up', 'left', 'right'
    this.externalInput = { up: false, down: false, left: false, right: false };
  }

  preload() {
    this.load.image('village_bg', '/village/village_bg.jpg');
    this.load.spritesheet('player', '/village/character.jpg', {
      frameWidth: 256,
      frameHeight: 256,
    });
  }

  create() {
    // ── Background ──
    const bg = this.add.image(0, 0, 'village_bg').setOrigin(0, 0);
    const texW = bg.width;
    const texH = bg.height;
    const screenW = this.scale.width;
    const screenH = this.scale.height;

    // Scale background generously to ensure no black edges
    const bgScale = Math.max(
      (screenW * 2.2) / texW,
      (screenH * 2.2) / texH,
      1.75
    );
    bg.setScale(bgScale);
    const worldW = bg.displayWidth;
    const worldH = bg.displayHeight;
    this.worldW = worldW;
    this.worldH = worldH;

    // ── BLOCKED OBSTACLE AREAS (Building bodies & Fountain) ──
    // Doors are kept fully open so player walks straight in without collision.
    this.blockedAreas = [
      // Observatory: main building body (door at x: 0.50, y: 0.415 is completely open)
      { x: worldW * 0.38, y: worldH * 0.06, w: worldW * 0.24, h: worldH * 0.33 },

      // The Workshop: main wooden structure (door at x: 0.236, y: 0.755 is open)
      { x: worldW * 0.12, y: worldH * 0.48, w: worldW * 0.22, h: worldH * 0.24 },

      // The Arena: colosseum structure (door at x: 0.778, y: 0.768 is open)
      { x: worldW * 0.67, y: worldH * 0.49, w: worldW * 0.21, h: worldH * 0.24 },

      // Fountain in the center plaza
      { x: worldW * 0.47, y: worldH * 0.59, w: worldW * 0.06, h: worldH * 0.08 },
    ];

    // Map boundary margins
    this.walkMargin = {
      left: worldW * 0.06,
      right: worldW * 0.94,
      top: worldH * 0.10,
      bottom: worldH * 0.88
    };

    // ── Spawn Player in Central Plaza (Crossroads) ──
    this.player = this.add.sprite(worldW * 0.50, worldH * 0.74, 'player');
    this.player.setScale(0.20);
    this.player.setDepth(10);
    this.player.setFrame(0); // Natural idle pose facing forward

    // ── Walking Animations ──
    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 9,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 9,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 9,
      repeat: -1
    });
    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 9,
      repeat: -1
    });

    // ── Keyboard Controls (WASD + Arrows) ──
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // ── Click / Tap to Walk ──
    this.moveTarget = null;
    this.input.on('pointerdown', (pointer) => {
      // If left click, set target point for player to walk to
      if (pointer.leftButtonDown() && !this.isDoorTransition) {
        this.moveTarget = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
      }
    });

    // ── Camera: STRICTLY FOLLOWS PLAYER (Always centered and in frame) ──
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    // Smooth lerp (0.1, 0.1) keeps player dead-center while walking
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Zoom setup: comfortable view, guaranteed no black borders
    const minZoomX = screenW / worldW;
    const minZoomY = screenH / worldH;
    this.minZoom = Math.max(minZoomX, minZoomY, 0.4);
    this.cameras.main.setZoom(Math.max(1.35, this.minZoom));

    // Optional zoom with mouse wheel (maintains player center)
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      const cam = this.cameras.main;
      const newZoom = Phaser.Math.Clamp(cam.zoom - deltaY * 0.0015, this.minZoom, 2.5);
      cam.setZoom(newZoom);
    });

    // Prevent default right-click menu
    this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // ── EXACT MAIN DOORS OF EACH BUILDING ──
    // Located right at the front thresholds depicted in the village art
    this.zones = {
      observatory: {
        id: 'observatory',
        label: 'The Observatory',
        route: '/visualizer',
        // Main double blue doors at the front of the observatory
        x: worldW * 0.50,
        y: worldH * 0.415,
        radiusProximity: 85,
        radiusDoor: 32
      },
      workshop: {
        id: 'workshop',
        label: 'The Workshop',
        route: '/sandbox',
        // Main teal front door under "The Workshop" sign facing south
        x: worldW * 0.236,
        y: worldH * 0.755,
        radiusProximity: 80,
        radiusDoor: 32
      },
      arena: {
        id: 'arena',
        label: 'The Arena',
        route: '/game',
        // Arched entrance under "The Arena" sign facing south
        x: worldW * 0.778,
        y: worldH * 0.768,
        radiusProximity: 80,
        radiusDoor: 32
      }
    };

    // ── Zone Visual Indicators (Glowing Door Markers & Labels) ──
    Object.values(this.zones).forEach(zone => {
      // Golden glowing entrance circle on ground
      const aura = this.add.circle(zone.x, zone.y, 16, 0xffaa00, 0.25);
      aura.setDepth(4);
      this.tweens.add({
        targets: aura,
        scaleX: 1.8,
        scaleY: 1.8,
        alpha: 0.05,
        duration: 1800,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Center bright beacon
      const beacon = this.add.circle(zone.x, zone.y, 5, 0xffe680, 0.9);
      beacon.setDepth(5);

      // Floating label above door
      const label = this.add.text(zone.x, zone.y - 48, zone.label, {
        fontFamily: '"Inter", sans-serif',
        fontSize: '13px',
        fontWeight: '700',
        color: '#fffae6',
        stroke: '#110500',
        strokeThickness: 4,
        align: 'center'
      }).setOrigin(0.5).setDepth(15).setAlpha(0);
      zone.labelText = label;
    });

    // Notify React that the scene is loaded and ready
    if (this.onZoneEvent) {
      this.onZoneEvent({ type: 'scene:ready' });
    }

    // Window resize handler
    this.scale.on('resize', (gameSize) => {
      const mx = gameSize.width / this.worldW;
      const my = gameSize.height / this.worldH;
      this.minZoom = Math.max(mx, my, 0.4);
      if (this.cameras.main.zoom < this.minZoom) {
        this.cameras.main.setZoom(this.minZoom);
      }
    });
  }

  // ── FEET-BASED COLLISION CHECK ──
  // Checks if the player's feet touch any blocked building structure
  isBlocked(px, py) {
    const feetX = px;
    const feetY = py + 18; // Feet offset from sprite center

    // Check village boundary
    if (
      feetX < this.walkMargin.left ||
      feetX > this.walkMargin.right ||
      feetY < this.walkMargin.top ||
      feetY > this.walkMargin.bottom
    ) {
      return true;
    }

    // Check blocked building bodies (radius buffer of 8px)
    for (const b of this.blockedAreas) {
      if (
        feetX + 8 >= b.x &&
        feetX - 8 <= b.x + b.w &&
        feetY + 6 >= b.y &&
        feetY - 6 <= b.y + b.h
      ) {
        return true;
      }
    }

    return false;
  }

  update() {
    if (!this.player || this.isDoorTransition) return;

    const speed = this.SPEED;
    const dt = this.game.loop.delta / 1000;
    let vx = 0;
    let vy = 0;
    let isMoving = false;

    // ── 1. Keyboard & D-pad Input ──
    const ext = this.externalInput;
    const left = this.cursors.left.isDown || this.wasd.a.isDown || ext.left;
    const right = this.cursors.right.isDown || this.wasd.d.isDown || ext.right;
    const up = this.cursors.up.isDown || this.wasd.w.isDown || ext.up;
    const down = this.cursors.down.isDown || this.wasd.s.isDown || ext.down;

    if (left || right || up || down) {
      this.moveTarget = null; // Keyboard cancels click-to-move
    }

    if (left) { vx = -speed; this.facing = 'left'; isMoving = true; }
    else if (right) { vx = speed; this.facing = 'right'; isMoving = true; }

    if (up) { vy = -speed; this.facing = 'up'; isMoving = true; }
    else if (down) { vy = speed; this.facing = 'down'; isMoving = true; }

    // Normalize diagonal movement speed
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    // ── 2. Click / Tap to Move ──
    if (this.moveTarget && !isMoving) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.moveTarget.x, this.moveTarget.y
      );

      if (dist > 8) {
        const angle = Phaser.Math.Angle.Between(
          this.player.x, this.player.y,
          this.moveTarget.x, this.moveTarget.y
        );
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        isMoving = true;

        // Choose facing based on dominant direction
        if (Math.abs(vx) > Math.abs(vy)) {
          this.facing = vx < 0 ? 'left' : 'right';
        } else {
          this.facing = vy < 0 ? 'up' : 'down';
        }
      } else {
        this.moveTarget = null;
      }
    }

    // ── 3. Movement with Wall-Sliding ──
    if (isMoving) {
      const targetX = this.player.x + vx * dt;
      const targetY = this.player.y + vy * dt;

      // Try full move
      if (!this.isBlocked(targetX, targetY)) {
        this.player.x = targetX;
        this.player.y = targetY;
      } else if (!this.isBlocked(targetX, this.player.y)) {
        // Slide horizontally along obstacle
        this.player.x = targetX;
      } else if (!this.isBlocked(this.player.x, targetY)) {
        // Slide vertically along obstacle
        this.player.y = targetY;
      } else {
        // Completely blocked in this vector
        if (this.moveTarget) this.moveTarget = null;
      }

      // Play corresponding walking animation
      this.player.anims.play(`walk_${this.facing}`, true);
    } else {
      // ── Natural Idle Standing Frame ──
      this.player.anims.stop();
      switch (this.facing) {
        case 'down':  this.player.setFrame(0); break;
        case 'left':  this.player.setFrame(4); break;
        case 'right': this.player.setFrame(8); break;
        case 'up':    this.player.setFrame(12); break;
      }
    }

    // ── 4. Proximity & Door Trigger Checks ──
    this.checkZones();
  }

  checkZones() {
    let nearestZone = null;
    let nearestDist = Infinity;
    let enteredDoor = false;

    Object.values(this.zones).forEach(zone => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        zone.x, zone.y
      );

      if (dist < zone.radiusProximity && dist < nearestDist) {
        nearestZone = zone;
        nearestDist = dist;
        enteredDoor = dist < zone.radiusDoor;
      }

      // Smoothly fade in zone label when approaching
      if (zone.labelText) {
        const targetAlpha = dist < zone.radiusProximity * 1.15 ? 0.95 : 0;
        zone.labelText.setAlpha(Phaser.Math.Linear(zone.labelText.alpha, targetAlpha, 0.1));
      }
    });

    const newZoneId = nearestZone ? nearestZone.id : null;

    if (newZoneId !== this.currentZone) {
      if (this.currentZone && this.onZoneEvent) {
        this.onZoneEvent({ type: 'zone:exit', zoneId: this.currentZone });
      }
      if (newZoneId && this.onZoneEvent) {
        this.onZoneEvent({
          type: 'zone:enter',
          zoneId: newZoneId,
          zone: nearestZone,
          inDoor: enteredDoor
        });
      }
      this.currentZone = newZoneId;
    }

    // ── MAIN DOOR ENTERED → TRIGGER BLACK HOLE COSMIC PORTAL ──
    if (enteredDoor && nearestZone && !this.isDoorTransition) {
      this.isDoorTransition = true;

      // Stop player in their tracks
      this.player.anims.stop();
      switch (this.facing) {
        case 'down':  this.player.setFrame(0); break;
        case 'left':  this.player.setFrame(4); break;
        case 'right': this.player.setFrame(8); break;
        case 'up':    this.player.setFrame(12); break;
      }

      // Dramatic camera plunge into the entrance
      this.tweens.add({
        targets: this.cameras.main,
        zoom: this.cameras.main.zoom * 1.6,
        duration: 900,
        ease: 'Cubic.easeIn'
      });

      // Emit portal event to React to trigger the black hole and particle warp
      if (this.onZoneEvent) {
        this.onZoneEvent({
          type: 'portal',
          route: nearestZone.route,
          zoneId: nearestZone.id
        });
      }
    }
  }
}
