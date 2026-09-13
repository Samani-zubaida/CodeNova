import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Phaser from 'phaser';
import VillageScene from './VillageScene';

/**
 * PhaserGame — React wrapper that mounts a Phaser Game instance.
 * 
 * Props:
 *  - onZoneEvent(event) — callback for zone/navigation events
 *  - className — optional CSS class
 * 
 * Ref:
 *  - ref.current.getScene() — access the VillageScene instance (for D-pad input)
 */
const PhaserGame = forwardRef(({ onZoneEvent, className = '' }, ref) => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getScene: () => sceneRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const villageScene = new VillageScene();
    villageScene.onZoneEvent = onZoneEvent;
    sceneRef.current = villageScene;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      pixelArt: true,
      antialias: false,
      backgroundColor: '#0a0f1e',
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
      },
      scene: [villageScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      input: {
        keyboard: true,
        mouse: true,
        touch: true,
      },
      banner: false,
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  // Keep callback reference updated
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.onZoneEvent = onZoneEvent;
    }
  }, [onZoneEvent]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ position: 'absolute', inset: 0 }}
    />
  );
});

PhaserGame.displayName = 'PhaserGame';
export default PhaserGame;
