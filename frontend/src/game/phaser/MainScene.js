import Phaser from 'phaser';
import { EventBus } from './EventBus';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Background
        this.add.rectangle(0, 0, 4000, 768, 0x1e293b).setOrigin(0);
        
        // Physics Groups
        this.platforms = this.physics.add.staticGroup();
        this.terminals = this.physics.add.staticGroup();

        // Build Level Ground (Long corridor)
        for (let i = 0; i < 10; i++) {
            let plat = this.add.rectangle(i * 400 + 200, 700, 400, 50, 0x3b82f6);
            this.platforms.add(plat);
        }

        // Add Floating Platforms
        this.platforms.add(this.add.rectangle(600, 550, 200, 20, 0x60a5fa));
        this.platforms.add(this.add.rectangle(1000, 400, 200, 20, 0x60a5fa));
        this.platforms.add(this.add.rectangle(1600, 500, 200, 20, 0x60a5fa));

        // Add Terminals (Quiz Triggers)
        const t1 = this.add.rectangle(600, 500, 40, 60, 0x10b981);
        this.terminals.add(t1);
        t1.quizSubject = 'ds';
        t1.quizLevel = 1;

        const t2 = this.add.rectangle(1600, 450, 40, 60, 0xeab308);
        this.terminals.add(t2);
        t2.quizSubject = 'oop';
        t2.quizLevel = 1;

        // Player
        this.player = this.add.rectangle(100, 600, 40, 60, 0xffffff);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(false); // We want to run right

        // Camera
        this.cameras.main.setBounds(0, 0, 4000, 768);
        this.physics.world.setBounds(0, 0, 4000, 768);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.terminals, this.hitTerminal, null, this);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // State
        this.isQuizActive = false;

        // Resume Physics from React
        EventBus.on('resume-game', () => {
            this.isQuizActive = false;
            this.physics.resume();
            
            // Push player back slightly so they don't immediately re-trigger
            this.player.body.x -= 20;
        });
    }

    update() {
        if (this.isQuizActive) return;

        // Movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(300);
        } else {
            this.player.body.setVelocityX(0);
        }

        // Jump
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-600);
        }
    }

    hitTerminal(player, terminal) {
        if (this.isQuizActive) return;

        // Pause Game
        this.isQuizActive = true;
        this.physics.pause();
        this.player.body.setVelocity(0, 0);

        // Trigger React UI Overlay
        EventBus.emit('start-quiz', {
            subject: terminal.quizSubject,
            level: terminal.quizLevel
        });
    }
}
