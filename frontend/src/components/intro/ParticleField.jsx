import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders/particleShader';

const PARTICLE_COUNT = 20000;
const PARTICLES_PER_STRAND = PARTICLE_COUNT / 2; // 10,000
const NUM_WARP_THREADS = 50; // 50 parallel warp thread lines per strand (100 total)
const STEPS_PER_THREAD = PARTICLES_PER_STRAND / NUM_WARP_THREADS; // 200 longitudinal steps

/**
 * Pre-compute 4 target-position Float32Arrays.
 *
 * MESH ARCHITECTURE:
 * Both the Ring and the Column share the exact same 2x50=100 warp threads.
 * - Strand 0 (10,000 pts): Left half of the ring -> Left ribbon of the hourglass column
 * - Strand 1 (10,000 pts): Right half of the ring -> Right ribbon of the hourglass column
 *
 * Crucially, both shapes share identical vertical orientation:
 * - v = +1 is top of the ring and top of the column
 * - v = 0 is waist/equator of the ring and waist of the column
 * - v = -1 is bottom of the ring and bottom of the column
 *
 * During scroll transition, the ring unfurls physically like fabric on a loom,
 * stretching vertically and drawing inward at the waist to form an hourglass double-helix mesh
 * with parallel vertical striations!
 */
function computeGeometries() {
  const ring = new Float32Array(PARTICLE_COUNT * 3);
  const helix = new Float32Array(PARTICLE_COUNT * 3);
  const wave = new Float32Array(PARTICLE_COUNT * 3);
  const galaxy = new Float32Array(PARTICLE_COUNT * 3);
  const galaxyRadii = new Float32Array(PARTICLE_COUNT);
  const indices = new Float32Array(PARTICLE_COUNT);
  const randoms = new Float32Array(PARTICLE_COUNT);
  const cores = new Float32Array(PARTICLE_COUNT);
  const crests = new Float32Array(PARTICLE_COUNT);

  const R_RING = 3.32;
  const R_WAIST = 0.90;
  const R_TOP = 2.85;
  const R_BOTTOM = 2.45;

  let pIdx = 0;

  for (let strand = 0; strand < 2; strand++) {
    for (let thread = 0; thread < NUM_WARP_THREADS; thread++) {
      // u: lateral ribbon coordinate [-1, 1] across the 50 warp threads
      const u = (thread / (NUM_WARP_THREADS - 1) - 0.5) * 2.0;
      // Stagger phase across threads to eliminate radial comb/spoke artifacts
      const phase = (thread * 0.6180339887) % 1.0;

      for (let step = 0; step < STEPS_PER_THREAD; step++) {
        const i3 = pIdx * 3;
        indices[pIdx] = pIdx;
        const rand = Math.random();
        randoms[pIdx] = rand;

        // v: longitudinal coordinate [-1, 1] from bottom (-1) through equator (0) to top (+1)
        const v = ((step + phase) / STEPS_PER_THREAD - 0.5) * 2.0;

        // ── 1. RING (Thin, silky band of 50 parallel woven threads) ──
        // Ribbon breadth: 0.16 units total width
        const ringRadius = R_RING + u * 0.14;
        let ringTheta;
        if (strand === 0) {
          // Left half: v=-1 is bottom (theta=3pi/2), v=0 is equator (theta=pi), v=+1 is top (theta=pi/2)
          ringTheta = Math.PI - v * (Math.PI * 0.495);
        } else {
          // Right half: v=-1 is bottom (theta=-pi/2), v=0 is equator (theta=0), v=+1 is top (theta=+pi/2)
          ringTheta = 0.0 + v * (Math.PI * 0.495);
        }

        // Tangential subtle wave along the thread
        const ringZ = Math.sin(thread * 1.5 + step * 0.25) * 0.04;
        ring[i3]     = ringRadius * Math.cos(ringTheta);
        ring[i3 + 1] = ringRadius * Math.sin(ringTheta);
        ring[i3 + 2] = ringZ;

        // ── 2. HOURGLASS DNA COLUMN (Unfurls directly from the warp threads) ──
        // Y coordinate runs full height [-4.6, 4.6]
        const colY = v * 4.6;
        const s = Math.abs(v);

        // Hourglass radius profile: wide top, pinched waist (~1/3 width), wide bottom
        const flareR = v >= 0 ? R_TOP : R_BOTTOM;
        const colR = R_WAIST + (flareR - R_WAIST) * Math.pow(s, 1.5);

        // Continuous double-helix twist (2 full turns along the height)
        const twist = v * (Math.PI * 2.0);
        const strandOffset = strand === 0 ? 0.0 : Math.PI;

        // Ribbon breadth: slightly wider at flared ends
        const ribbonWidth = 0.44 + 0.20 * s;
        const dPhi = (u * ribbonWidth) / (2.0 * colR);
        const colPhi = twist + strandOffset + dPhi;

        // Ribbon normal depth (wound cord feel)
        const cordDepth = u * 0.04 + Math.sin(u * Math.PI) * 0.02;
        let r = colR + cordDepth;

        // Frayed sparkle edges: individual particles floating just outside main contour
        let frayR = 0.0;
        let frayZ = 0.0;
        if (Math.abs(u) > 0.72 && pIdx % 4 === 0) {
          frayR = (rand - 0.5) * 0.22;
          frayZ = (Math.random() - 0.5) * 0.22;
        }

        const finalR = r + frayR;
        helix[i3]     = finalR * Math.sin(colPhi);
        helix[i3 + 1] = colY + (Math.random() - 0.5) * 0.03;
        helix[i3 + 2] = finalR * Math.cos(colPhi) + frayZ;

        pIdx++;
      }
    }
  }

  const vortex = new Float32Array(PARTICLE_COUNT * 3);
  const rimGlows = new Float32Array(PARTICLE_COUNT);

  // ── 3. WAVE RIDGE, 4. VORTEX SINKHOLE & 5. GALAXY ──
  // Wave ridge hugs bottom ~40% of viewport (Y <= -1.6)
  // Vortex accretion rim forms a tight circular void at center (radius 1.05, ~35% viewport height)
  const R_VOID = 1.05;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    let wx, wy, wz;
    const rand = Math.random();

    if (i < 8000) {
      // 1. Dense Crest Line (8,000 pts): peak density, continuous glowing edge
      const t = i / 8000;
      wx = (t - 0.5) * 28.0;
      const dz = (Math.random() - 0.5) * 0.55;
      wz = 0.5 + 0.55 * Math.sin(wx * 0.22) + dz;
      const yCrest = -2.15 + 0.35 * Math.sin(wx * 0.25 + 0.3) + 0.12 * Math.cos(wx * 0.55);
      wy = yCrest - 0.14 * Math.pow(Math.abs(dz), 1.5) + (Math.random() - 0.5) * 0.035;
      crests[i] = 1.0;
    } else if (i < 12500) {
      // 2. Upper Haze (4,500 pts): bleeding softly up into the black dead space
      const t = (i - 8000) / 4500;
      wx = (t - 0.5) * 26.0 + (Math.random() - 0.5) * 1.8;
      const dz = 0.25 + Math.random() * 3.6;
      wz = 0.5 + 0.55 * Math.sin(wx * 0.22) + dz;
      const yCrest = -2.15 + 0.35 * Math.sin(wx * 0.25 + 0.3) + 0.12 * Math.cos(wx * 0.55);
      wy = yCrest + Math.pow(Math.random(), 2.2) * 0.28 - dz * 0.11;
      crests[i] = 0.35;
    } else {
      // 3. Lower Dunes (7,500 pts): falling away and fading to nothing below
      const t = (i - 12500) / 7500;
      wx = (t - 0.5) * 30.0 + (Math.random() - 0.5) * 1.5;
      const dz = -Math.random() * 2.8;
      wz = 0.5 + 0.55 * Math.sin(wx * 0.22) + dz;
      const yCrest = -2.15 + 0.35 * Math.sin(wx * 0.25 + 0.3) + 0.12 * Math.cos(wx * 0.55);
      wy = yCrest - 0.42 * Math.pow(Math.abs(dz), 1.25) + 0.07 * Math.sin(wx * 0.6 + dz * 1.5);
      crests[i] = 0.0;
    }

    wave[i3]     = wx;
    wave[i3 + 1] = wy;
    wave[i3 + 2] = wz;

    // ── VORTEX ACCRETION RIM & FUNNEL ──
    // Tighter, crisp circular void (radius 1.05) occupying a well-proportioned ~35% of viewport height
    let rVortex;
    if (i % 10 < 8) {
      // 80% tightly compressed into brilliant, razor-sharp glowing rim
      rVortex = R_VOID + Math.pow(rand, 3.5) * 0.24;
      rimGlows[i] = Math.max(0.0, 1.0 - (rVortex - R_VOID) / 0.16);
    } else {
      // 20% outer subtle halo scatter
      rVortex = R_VOID + 0.22 + Math.pow(rand, 1.6) * 1.35;
      rimGlows[i] = 0.0;
    }

    // Continuous 360-degree angle mapping without any gaps:
    // Left blue wing (wx < 0) -> Lower-Left arc [-0.5*pi, -1.5*pi] (blue-violet)
    // Right red wing (wx >= 0) -> Upper-Right arc [-0.5*pi, +0.5*pi] (red-orange)
    // Meeting continuously at top (+0.5*pi) and bottom (-0.5*pi) through magenta
    let thetaVortex;
    const normX = Math.max(-1.0, Math.min(1.0, wx / 14.0));
    if (normX >= 0) {
      // Right wing: smoothly sweeps from bottom (-pi/2) through right (0) to top (+pi/2)
      thetaVortex = -Math.PI * 0.5 + normX * Math.PI + (Math.random() - 0.5) * 0.04;
    } else {
      // Left wing: smoothly sweeps from bottom (-pi/2) through left (-pi) to top (-3pi/2)
      thetaVortex = -Math.PI * 0.5 + normX * Math.PI + (Math.random() - 0.5) * 0.04;
    }

    // Inward funnel sinkhole depth: graceful dip near inner rim
    const funnelZ = -0.38 * Math.exp(-(rVortex - R_VOID) * 3.8) + (Math.random() - 0.5) * 0.03;

    vortex[i3]     = rVortex * Math.cos(thetaVortex);
    vortex[i3 + 1] = rVortex * Math.sin(thetaVortex);
    vortex[i3 + 2] = funnelZ;

    // ── 5. GALAXY: Glowing Core + Tighter Inner Orbital Ring + Wider Outer Orbital Ring + Fine Sparse Dust ──
    // All coordinates generated in the untilted disc plane (X, Y=thickness, Z).
    // The shader will apply Keplerian orbital rotation, tilt (18 deg), and low-and-center placement (Y = -1.65).
    if (i < 3500) {
      // 1. Dense glowing core at exact center (3,500 pts)
      cores[i] = 1.0;
      const r = 0.42 * Math.pow(Math.random(), 2.2);
      const theta = Math.random() * Math.PI * 2.0;
      const yScatter = (Math.random() - 0.5) * 0.14 * (1.0 - r / 0.42);
      galaxyRadii[i] = r;
      galaxy[i3]     = r * Math.cos(theta);
      galaxy[i3 + 1] = yScatter;
      galaxy[i3 + 2] = r * Math.sin(theta);
    } else if (i < 10500) {
      // 2. Tighter inner orbital ring (7,000 pts) — mean radius 2.20, thin compressed band
      cores[i] = 0.0;
      const t = (i - 3500) / 7000.0;
      const r = 2.20 + (Math.random() - 0.5) * 0.22;
      const theta = t * Math.PI * 2.0 + (Math.random() - 0.5) * 0.02;
      const yScatter = (Math.random() - 0.5) * 0.04;
      galaxyRadii[i] = r;
      galaxy[i3]     = r * Math.cos(theta);
      galaxy[i3 + 1] = yScatter;
      galaxy[i3 + 2] = r * Math.sin(theta);
    } else if (i < 16800) {
      // 3. Wider outer orbital ring (6,300 pts) — mean radius 4.45, wide thin elliptical band
      cores[i] = 0.0;
      const t = (i - 10500) / 6300.0;
      const r = 4.45 + (Math.random() - 0.5) * 0.32;
      const theta = t * Math.PI * 2.0 + (Math.random() - 0.5) * 0.02;
      const yScatter = (Math.random() - 0.5) * 0.05;
      galaxyRadii[i] = r;
      galaxy[i3]     = r * Math.cos(theta);
      galaxy[i3 + 1] = yScatter;
      galaxy[i3 + 2] = r * Math.sin(theta);
    } else {
      // 4. Fine sparse dust between and around the rings, fading outward towards edges (3,200 pts)
      cores[i] = 0.0;
      const u = (i - 16800) / 3200.0;
      let r;
      if (u < 0.35) {
        r = 0.45 + Math.random() * 1.60; // dust between core and inner ring
      } else if (u < 0.75) {
        r = 2.35 + Math.random() * 1.95; // dust between inner and outer ring
      } else {
        r = 4.65 + Math.pow(Math.random(), 1.8) * 2.55; // sparse dust fading outward towards edges
      }
      const theta = Math.random() * Math.PI * 2.0;
      const yScatter = (Math.random() - 0.5) * 0.12;
      galaxyRadii[i] = r;
      galaxy[i3]     = r * Math.cos(theta);
      galaxy[i3 + 1] = yScatter;
      galaxy[i3 + 2] = r * Math.sin(theta);
    }
  }

  return { ring, helix, wave, vortex, galaxy, indices, randoms, cores, crests, rimGlows, galaxyRadii };
}

export default function ParticleField({ scrollRef }) {
  const materialRef = useRef();

  const { ring, helix, wave, vortex, galaxy, indices, randoms, cores, crests, rimGlows, galaxyRadii } = useMemo(
    () => computeGeometries(),
    []
  );

  const uniforms = useMemo(
    () => ({
      uProgress:   { value: 0.0 },
      uTime:       { value: 0.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = scrollRef.current || 0;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={ring} itemSize={3} />
        <bufferAttribute attach="attributes-aRingPos" count={PARTICLE_COUNT} array={ring} itemSize={3} />
        <bufferAttribute attach="attributes-aHelixPos" count={PARTICLE_COUNT} array={helix} itemSize={3} />
        <bufferAttribute attach="attributes-aWavePos" count={PARTICLE_COUNT} array={wave} itemSize={3} />
        <bufferAttribute attach="attributes-aVortexPos" count={PARTICLE_COUNT} array={vortex} itemSize={3} />
        <bufferAttribute attach="attributes-aGalaxyPos" count={PARTICLE_COUNT} array={galaxy} itemSize={3} />
        <bufferAttribute attach="attributes-aGalaxyRadius" count={PARTICLE_COUNT} array={galaxyRadii} itemSize={1} />
        <bufferAttribute attach="attributes-aIndex" count={PARTICLE_COUNT} array={indices} itemSize={1} />
        <bufferAttribute attach="attributes-aRandom" count={PARTICLE_COUNT} array={randoms} itemSize={1} />
        <bufferAttribute attach="attributes-aCore" count={PARTICLE_COUNT} array={cores} itemSize={1} />
        <bufferAttribute attach="attributes-aCrest" count={PARTICLE_COUNT} array={crests} itemSize={1} />
        <bufferAttribute attach="attributes-aRimGlow" count={PARTICLE_COUNT} array={rimGlows} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

