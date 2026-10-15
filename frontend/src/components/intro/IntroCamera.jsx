import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * IntroCamera — Frame-perfect synchronized camera controller.
 *
 * SPECIFICATION:
 * - WAYPOINTS match exact shader transition ranges:
 *   - Hold 1 (Ring): 0.00 -> 0.14
 *   - Transition 1 (Ring -> Column): 0.14 -> 0.28
 *   - Hold 2 (Column): 0.28 -> 0.46 (frozen in place while reading cards)
 *   - Transition 2 (Column -> Wave): 0.46 -> 0.58
 *   - Hold 3 (Wave Ridge): 0.58 -> 0.72 (crest line stably anchored at bottom 40%)
 *   - Transition 3 (Wave -> Galaxy): 0.72 -> 0.86
 *   - Hold 4 (Galaxy): 0.86 -> 1.00
 * - Reads the unified smoothed progress value, guaranteeing zero lag against particles.
 */

const WP_RING   = { pos: new THREE.Vector3(0.0, 0.0, 7.2),  look: new THREE.Vector3(0.0, 0.0, 0.0)  };
const WP_COLUMN = { pos: new THREE.Vector3(0.0, 0.0, 5.4),  look: new THREE.Vector3(0.0, 0.0, 0.0)  };
const WP_WAVE   = { pos: new THREE.Vector3(0.0, 1.1, 7.6),  look: new THREE.Vector3(0.0, -1.3, 0.0) };
const WP_VORTEX = { pos: new THREE.Vector3(0.0, 0.0, 6.4),  look: new THREE.Vector3(0.0, 0.0, 0.0)  };
const WP_GALAXY = { pos: new THREE.Vector3(0.0, 0.8, 8.6),  look: new THREE.Vector3(0.0, -0.65, 0.0) };

const tempPos = new THREE.Vector3();
const tempLook = new THREE.Vector3();

// Smooth Hermite interpolation: zero velocity at boundaries for seamless transitions
function hermite(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export default function IntroCamera({ scrollRef }) {
  useFrame((state) => {
    const p = scrollRef.current || 0;
    const cam = state.camera;

    let fromPos, toPos, fromLook, toLook, factor;

    if (p < 0.26) {
      // Stage 1 Hold (p <= 0.16) and Transition 1: Ring -> Column (0.16 -> 0.26)
      fromPos = WP_RING.pos;
      toPos = WP_COLUMN.pos;
      fromLook = WP_RING.look;
      toLook = WP_COLUMN.look;
      factor = hermite(0.16, 0.26, p);
    } else if (p < 0.58) {
      // Stage 2 Hold (0.26 <= p <= 0.46) and Transition 2: Column -> Wave (0.46 -> 0.58)
      fromPos = WP_COLUMN.pos;
      toPos = WP_WAVE.pos;
      fromLook = WP_COLUMN.look;
      toLook = WP_WAVE.look;
      factor = hermite(0.46, 0.58, p);
    } else if (p < 0.83) {
      // Stage 3 Hold (0.58 <= p <= 0.68) and Transition 3A: Wave -> Vortex (0.68 -> 0.78) and Vortex Hold (0.78 -> 0.83)
      fromPos = WP_WAVE.pos;
      toPos = WP_VORTEX.pos;
      fromLook = WP_WAVE.look;
      toLook = WP_VORTEX.look;
      factor = hermite(0.68, 0.78, p);
    } else {
      // Detonation & Galaxy Climax: Vortex -> Galaxy (0.855 -> 0.92) and Climax Hold (>= 0.92)
      fromPos = WP_VORTEX.pos;
      toPos = WP_GALAXY.pos;
      fromLook = WP_VORTEX.look;
      toLook = WP_GALAXY.look;
      factor = hermite(0.855, 0.92, p);
    }

    tempPos.lerpVectors(fromPos, toPos, factor);
    tempLook.lerpVectors(fromLook, toLook, factor);

    cam.position.copy(tempPos);
    cam.lookAt(tempLook);
  });

  return null;
}

