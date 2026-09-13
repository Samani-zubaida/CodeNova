/**
 * particleShader.js — Continuous gradient particle morphing with tactile thread noise, column twist, and rolling wave ridge.
 *
 * SPECIFICATION:
 * - Ring: circular continuous gradient (top hot red-orange, sides violet, bottom blue-violet)
 * - Column: horizontal strand-independent gradient (left blue-violet, pinch point magenta, right red-orange)
 * - Column: slow constant 3D twist resolves only as column forms, creating constant color churn
 * - Wave: horizontal landscape duotone (left third blue-violet, middle violet, right third red-orange)
 * - Wave: continuous undulating ripple motion along the crest line
 * - Wave: luminous crest line glow with soft haze falloff
 */

const simplexNoise3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p) {
  float e = 0.08;
  float n1 = snoise(p + vec3(0.0, e, 0.0));
  float n2 = snoise(p - vec3(0.0, e, 0.0));
  float cx = (n1 - n2) / (2.0 * e);
  n1 = snoise(p + vec3(0.0, 0.0, e));
  n2 = snoise(p - vec3(0.0, 0.0, e));
  float cy = (n1 - n2) / (2.0 * e);
  n1 = snoise(p + vec3(e, 0.0, 0.0));
  n2 = snoise(p - vec3(e, 0.0, 0.0));
  float cz = (n1 - n2) / (2.0 * e);
  return vec3(cx, cy, cz);
}
`;

export const vertexShader = /* glsl */ `
${simplexNoise3D}

attribute vec3 aRingPos;
attribute vec3 aHelixPos;
attribute vec3 aWavePos;
attribute vec3 aVortexPos;
attribute vec3 aGalaxyPos;
attribute float aGalaxyRadius;
attribute float aIndex;
attribute float aRandom;
attribute float aCore;
attribute float aCrest;
attribute float aRimGlow;

uniform float uProgress;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vAlpha;
varying float vCore;
varying float vCrest;
varying float vRim;

// 1. Ring circular gradient: Top hot red-orange -> sides violet -> bottom blue-violet
vec3 computeRingGradient(float y) {
  vec3 hotOrangeRed = vec3(1.0, 0.22, 0.06);  // #FF380F
  vec3 midViolet    = vec3(0.68, 0.18, 0.92);  // #AD2EEB
  vec3 deepBlue     = vec3(0.18, 0.28, 0.98);  // #2E47FA

  float t = clamp((y / 3.32) * 0.5 + 0.5, 0.0, 1.0);
  if (t < 0.5) {
    return mix(deepBlue, midViolet, t * 2.0);
  } else {
    return mix(midViolet, hotOrangeRed, (t - 0.5) * 2.0);
  }
}

// 2. Column horizontal gradient: Left blue-violet -> pinch point magenta -> right red-orange
vec3 computeColumnHorizontalGradient(float x) {
  vec3 deepBlue     = vec3(0.18, 0.28, 0.98);  // #2E47FA (Left: cool blue-violet)
  vec3 faintMagenta = vec3(0.70, 0.18, 0.88);  // #B22EE0 (Center: faint magenta pinch)
  vec3 hotOrangeRed = vec3(1.0, 0.22, 0.06);  // #FF380F (Right: warm red-orange)

  float h = clamp(x / 1.15, -1.0, 1.0);
  if (h < 0.0) {
    return mix(faintMagenta, deepBlue, -h);
  } else {
    return mix(faintMagenta, hotOrangeRed, h);
  }
}

// 3. Wave horizontal ridge duotone: Left third blue-violet -> middle violet -> right third red-orange
vec3 computeWaveGradient(float x) {
  vec3 deepBlue     = vec3(0.18, 0.28, 0.98);  // #2E47FA (Left third)
  vec3 midViolet    = vec3(0.66, 0.18, 0.92);  // #A82EEB (Middle third)
  vec3 hotOrangeRed = vec3(1.0, 0.22, 0.06);   // #FF380F (Right third)

  float t = clamp((x / 12.0) * 0.5 + 0.5, 0.0, 1.0);
  if (t < 0.48) {
    return mix(deepBlue, midViolet, t / 0.48);
  } else {
    return mix(midViolet, hotOrangeRed, (t - 0.48) / 0.52);
  }
}

// 4. Vortex radial duotone: Upper-right red-orange, lower-left blue-violet, blending through magenta
vec3 computeVortexRadialGradient(vec2 xy) {
  float angle = atan(xy.y, xy.x);
  // Upper-right (pi/4) is 1.0, lower-left (-3pi/4) is 0.0
  float t = clamp(sin(angle - 0.785398) * 0.5 + 0.5, 0.0, 1.0);
  vec3 deepBlue     = vec3(0.18, 0.28, 0.98); // #2E47FA (lower-left arc)
  vec3 midMagenta   = vec3(0.74, 0.18, 0.90); // #BC2EE6 (magenta blend)
  vec3 hotOrangeRed = vec3(1.0, 0.22, 0.06);  // #FF380F (upper-right arc)

  if (t < 0.5) {
    return mix(deepBlue, midMagenta, t * 2.0);
  } else {
    return mix(midMagenta, hotOrangeRed, (t - 0.5) * 2.0);
  }
}

// 5. Galaxy concentric radial duotone: Core white-hot -> inner band orange-red -> outer ring & dust blue-violet
vec3 computeGalaxyRadialGradient(float r) {
  vec3 whiteHot     = vec3(1.0, 0.98, 0.95);  // Core center: pure white-hot
  vec3 hotOrangeRed = vec3(1.0, 0.22, 0.06);  // Inner band: #FF380F
  vec3 midMagenta   = vec3(0.72, 0.18, 0.90);  // Intermediate transition: #B82EE6
  vec3 deepBlue     = vec3(0.18, 0.28, 0.98);  // Outer ring & dust: #2E47FA

  if (r < 0.55) {
    return mix(whiteHot, hotOrangeRed, smoothstep(0.0, 0.55, r));
  } else if (r < 2.50) {
    return mix(hotOrangeRed, midMagenta, smoothstep(0.55, 2.50, r) * 0.35);
  } else if (r < 3.80) {
    float t = smoothstep(2.50, 3.80, r);
    return mix(mix(hotOrangeRed, midMagenta, 0.35), midMagenta, t);
  } else {
    return mix(midMagenta, deepBlue, smoothstep(3.80, 5.00, r));
  }
}

void main() {
  // ── 1. Early stage morphs ──
  float t1 = smoothstep(0.16, 0.26, uProgress); // Ring -> Column
  float t2 = smoothstep(0.46, 0.58, uProgress); // Column -> Wave

  vec3 p0 = aRingPos;
  vec3 p1 = mix(p0, aHelixPos, t1);
  vec3 pWave = mix(p1, aWavePos, t2);

  // ── Constant forward twist on DNA column (smoothly blended) ──
  float colWeight = smoothstep(0.80, 1.0, t1) * (1.0 - smoothstep(0.0, 0.35, t2));
  if (colWeight > 0.001) {
    float twistAngle = uTime * 0.22;
    float cosT = cos(twistAngle);
    float sinT = sin(twistAngle);
    vec2 rotatedXZ = vec2(pWave.x * cosT - pWave.z * sinT, pWave.x * sinT + pWave.z * cosT);
    pWave.xz = mix(pWave.xz, rotatedXZ, colWeight);
  }

  // ── Wave idle undulating ripple (active strictly while wave ridge is resolved) ──
  float waveActive = smoothstep(0.75, 1.0, t2) * (1.0 - smoothstep(0.70, 0.74, uProgress));
  if (waveActive > 0.001) {
    float waveRipple = snoise(vec3(pWave.x * 0.22 + uTime * 0.15, pWave.z * 0.25 - uTime * 0.08, 1.2)) * 0.13;
    float microWave = sin(pWave.x * 0.65 + uTime * 0.55) * cos(pWave.z * 0.45 + uTime * 0.35) * 0.04;
    pWave.y += (waveRipple + microWave) * waveActive;
  }

  // ── Tactile thread noise (anchored to base geometry) ──
  vec3 baseThreadPos = mix(aRingPos, aHelixPos, t1);
  float threadNoiseZ = snoise(vec3(baseThreadPos.xy * 1.8, uTime * 1.2 + aRandom * 3.0)) * 0.024;
  pWave.z += threadNoiseZ * (1.0 - smoothstep(0.0, 0.35, t2));

  // ── 2. INVERSE RADIAL SINKHOLE COLLAPSE (Wave -> Black Hole Vortex: 0.68 -> 0.78) ──
  // Continuous monotonic lag: center particles lead, wings follow smoothly with zero flinch
  float sVortex = smoothstep(0.68, 0.78, uProgress);
  float wingLag = clamp(abs(aWavePos.x) / 14.0, 0.0, 0.75);
  float tVortexRaw = clamp((sVortex - wingLag * 0.28) / (1.0 - wingLag * 0.28 + 0.001), 0.0, 1.0);
  float tVortex = tVortexRaw * tVortexRaw * (3.0 - 2.0 * tVortexRaw);

  // Smooth, continuous forward swirl (never phase-reversed, zero backwards snapping)
  float swirl = uTime * 0.35 + uProgress * 2.2;
  float cosS = cos(swirl);
  float sinS = sin(swirl);
  vec2 rotatedVortexXY = vec2(aVortexPos.x * cosS - aVortexPos.y * sinS, aVortexPos.x * sinS + aVortexPos.y * cosS);
  vec3 targetVortexPos = vec3(rotatedVortexXY, aVortexPos.z);

  vec3 pVortex = mix(pWave, targetVortexPos, tVortex);

  // ── 3. SINGULARITY CRUSH (Rim contracts smoothly from hold into center point: 0.83 -> 0.855) ──
  // Note: 0.78 -> 0.83 is a clear, stable hold of the black hole disc & swirling accretion rim!
  float tCrush = smoothstep(0.83, 0.855, uProgress);
  vec3 singularityPoint = vec3(0.0, -0.825, 0.0);
  vec3 pCrushed = mix(pVortex, singularityPoint, tCrush);

  // ── 4. GALAXY RESOLUTION: Tilted Orbital Bands & Glowing Core (0.855 -> 0.915) ──
  // The burst resolves smoothly into a flattened spiral-galaxy disc seen at a slight tilt:
  // - Bright, dense glowing core at exact center
  // - Tighter inner orbital ring & wider outer orbital ring
  // - Fine sparse dust fading outward towards edges
  // - Low-and-center weighting (Y = -1.65), leaving top half open and black
  float tBurst = smoothstep(0.855, 0.915, uProgress);

  // Local Keplerian orbital rotation around Y axis in the untilted disc plane
  float orbitSpeed = 0.05 + 0.09 / (aGalaxyRadius + 0.8);
  float orbitAngle = uTime * orbitSpeed;
  float cosO = cos(orbitAngle);
  float sinO = sin(orbitAngle);
  vec2 rotXZ = vec2(aGalaxyPos.x * cosO - aGalaxyPos.z * sinO, aGalaxyPos.x * sinO + aGalaxyPos.z * cosO);

  // Apply tilt (18 degrees from edge-on) and lower-center placement (Y = -1.65)
  // sin(18 deg) = 0.3090, cos(18 deg) = 0.9511
  float sinTilt = 0.3090;
  float cosTilt = 0.9511;
  vec3 pGalaxyResolved = vec3(
    rotXZ.x,
    -1.65 + rotXZ.y * sinTilt + aGalaxyPos.y * cosTilt,
    rotXZ.y * cosTilt - aGalaxyPos.y * sinTilt
  );

  // Monotonic, butter-smooth expansion (zero random scatter, zero flash explosion, zero flinch)
  vec3 pos = mix(pCrushed, pGalaxyResolved, tBurst);

  // ── Color Gradient Morph ──
  vec3 ringCol   = computeRingGradient(pos.y + (aRandom - 0.5) * 0.12);
  vec3 colCol    = computeColumnHorizontalGradient(pos.x + (aRandom - 0.5) * 0.10);
  vec3 waveCol   = computeWaveGradient(pos.x + (aRandom - 0.5) * 0.18);
  vec3 vortexCol = computeVortexRadialGradient(pos.xy);
  vec3 galaxyCol = computeGalaxyRadialGradient(aGalaxyRadius);

  vec3 c01 = mix(ringCol, colCol, t1);
  vec3 c12 = mix(c01, waveCol, t2);
  vec3 c23 = mix(c12, vortexCol, tVortex);
  vec3 c34 = mix(c23, vortexCol, tCrush);
  vec3 baseCol = mix(c34, galaxyCol, tBurst);

  vColor = baseCol;
  vCore = aCore * tBurst;
  vCrest = aCrest * waveActive;
  vRim = aRimGlow * tVortex * (1.0 - tCrush);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vec4 clipPos = projectionMatrix * mvPosition;

  // Point size attenuated by distance
  float distAtten = clamp(32.0 / -mvPosition.z, 0.7, 5.0);
  float crestSizeBonus = 1.0 + vCrest * 0.28;
  float rimSizeBonus = 1.0 + vRim * 0.25;
  float coreMultiplier = 1.0 + vCore * 0.40;

  gl_PointSize = max(distAtten * uPixelRatio * (0.65 + aRandom * 0.35) * coreMultiplier * crestSizeBonus * rimSizeBonus, 1.0);

  vAlpha = 0.65 + 0.35 * aRandom + vCore * 0.35 + vCrest * 0.20 + vRim * 0.25;

  gl_Position = clipPos;
}
`;

export const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying float vCore;
varying float vCrest;
varying float vRim;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Smooth Gaussian falloff for bloom glow
  float intensity = exp(-dist * dist * 9.0);

  // Hot white center for brilliant sparkle points
  float hotCenter = smoothstep(0.20, 0.0, dist) * 0.45;
  float crestGlow = vCrest * 0.25;
  // Crisp, subtle rim edge — eliminates over-bright flare
  float rimSubtleEdge = vRim * 0.18;

  float whiteMix = clamp(hotCenter + crestGlow + rimSubtleEdge, 0.0, 1.0);
  vec3 finalColor = mix(vColor, vec3(1.0, 0.98, 0.95), whiteMix);

  // Luminous center radiance for the galaxy nucleus
  if (vCore > 0.5) {
    finalColor = mix(finalColor, vec3(1.25, 1.15, 1.1), vCore * 0.55);
  }

  gl_FragColor = vec4(finalColor, intensity * vAlpha);
}
`;


