import Phaser from 'phaser';
import { EventBus } from './EventBus';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const levelWidth = 4000;

        // 1. IMMERSIVE PARALLAX BACKGROUND
        // Very distant dark void
        this.add.rectangle(0, 0, levelWidth, height, 0x070b19).setOrigin(0).setScrollFactor(0);

        // Distant Starfield (slow scroll)
        const bg1 = this.add.graphics();
        bg1.fillStyle(0x1e3a8a, 0.5);
        for(let i=0; i<300; i++) {
            bg1.fillCircle(Phaser.Math.Between(0, levelWidth), Phaser.Math.Between(0, height), Phaser.Math.FloatBetween(1, 2));
        }
        bg1.setScrollFactor(0.2);

        // Midground Grid (medium scroll)
        const bg2 = this.add.graphics();
        bg2.lineStyle(1, 0x3b82f6, 0.2);
        for(let x = 0; x < levelWidth; x += 100) {
            bg2.moveTo(x, 0);
            bg2.lineTo(x, height);
        }
        for(let y = 0; y < height; y += 100) {
            bg2.moveTo(0, y);
            bg2.lineTo(levelWidth, y);
        }
        bg2.strokePath();
        bg2.setScrollFactor(0.5);

        // 2. PHYSICS GROUPS
        this.platforms = this.physics.add.staticGroup();
        this.terminals = this.physics.add.staticGroup();

        // High-Tech Ground
        for (let i = 0; i < 10; i++) {
            this.createNeonPlatform(i * 400 + 200, 700, 400, 50, 0x0ea5e9);
        }

        // High-Tech Floating Platforms
        this.createNeonPlatform(600, 550, 200, 20, 0x0ea5e9);
        this.createNeonPlatform(1000, 400, 200, 20, 0x0ea5e9);
        this.createNeonPlatform(1600, 500, 200, 20, 0x0ea5e9);

        // 3. NEON TERMINALS & PARTICLES
        const t1 = this.createTerminal(600, 480, 0x10b981, 'ds', 1);
        const t2 = this.createTerminal(1600, 430, 0xeab308, 'oop', 1);

        // 4. THE PLAYER (CYBER-CUBE)
        this.player = this.add.rectangle(100, 600, 40, 60, 0xffffff);
        this.player.setStrokeStyle(4, 0x60a5fa);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(false);

        // Player Particle Trail
        this.trailEmitter = this.add.particles(0, 0, 'flare', {
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: 0x60a5fa,
            lifespan: 400,
            blendMode: 'ADD',
            emitting: false
        });

        // Fallback for particle texture since we don't have images loaded
        // We generate a tiny circle texture on the fly
        const g = this.make.graphics({x:0, y:0, add:false});
        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.generateTexture('flare', 8, 8);


        // Camera
        this.cameras.main.setBounds(0, 0, levelWidth, height);
        this.physics.world.setBounds(0, 0, levelWidth, height);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.terminals, this.hitTerminal, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isQuizActive = false;

        // Resume Physics from React
        EventBus.on('resume-game', () => {
            this.isQuizActive = false;
            this.physics.resume();
            this.player.body.x -= 30; // Push back to avoid instant re-trigger
            
            // Re-enable glowing
            this.tweens.getTweensOf(this.activeTerminal.glow).forEach(t => t.resume());
        });
    }

    createNeonPlatform(x, y, w, h, color) {
        // Base dark platform
        const plat = this.add.rectangle(x, y, w, h, 0x0f172a);
        
        // Glowing Neon Border
        plat.setStrokeStyle(3, color);
        
        // Physics body
        this.physics.add.existing(plat, true);
        this.platforms.add(plat);
    }

    createTerminal(x, y, color, subject, level) {
        // Glowing aura
        const glow = this.add.rectangle(x, y, 50, 70, color, 0.2);
        glow.setBlendMode(Phaser.BlendModes.ADD);

        // Terminal block
        const term = this.add.rectangle(x, y, 30, 50, 0x1e293b);
        term.setStrokeStyle(2, color);
        
        this.physics.add.existing(term, true);
        this.terminals.add(term);

        term.quizSubject = subject;
        term.quizLevel = level;
        term.glow = glow;

        // Pulsing Tween
        this.tweens.add({
            targets: glow,
            alpha: 0.8,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return term;
    }

    update() {
        if (this.isQuizActive) {
            this.trailEmitter.stop();
            return;
        }

        let isMoving = false;

        // Movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-400);
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(400);
            isMoving = true;
        } else {
            this.player.body.setVelocityX(0);
        }

        // Jump
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-700);
        }

        // Particles
        if (isMoving && this.player.body.touching.down) {
            this.trailEmitter.setPosition(this.player.x, this.player.y + 20);
            this.trailEmitter.start();
        } else {
            this.trailEmitter.stop();
        }
    }

    hitTerminal(player, terminal) {
        if (this.isQuizActive) return;

        this.isQuizActive = true;
        this.activeTerminal = terminal;
        this.physics.pause();
        this.trailEmitter.stop();
        player.body.setVelocity(0, 0);

        // Pause terminal animation
        this.tweens.getTweensOf(terminal.glow).forEach(t => t.pause());

        // Trigger React UI Overlay
        EventBus.emit('start-quiz', {
            subject: terminal.quizSubject,
            level: terminal.quizLevel
        });
    }
}
