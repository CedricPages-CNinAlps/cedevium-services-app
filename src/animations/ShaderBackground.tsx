import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { prefersReducedMotion } from './motion';

// Fond « aurore » animé en WebGL (OGL) : bandes de couleur qui ondulent
// lentement, sans interaction souris. Prévu pour un fond uni (pas une photo).
// Repli : la couleur CSS de l'élément parent reste visible si WebGL manque
// ou si l'utilisateur réduit les animations.

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Bruit simplex 2D (Ashima Arts, licence MIT)
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(vUv.x * aspect, vUv.y);
    float t = uTime * 0.05;

    vec3 base   = vec3(0.118, 0.102, 0.204); // #1E1A34 bleu nuit
    vec3 violet = vec3(0.235, 0.165, 0.380);
    vec3 orange = vec3(0.863, 0.345, 0.165); // #DC582A

    // Deux rubans horizontaux qui ondulent
    float w1 = snoise(vec2(p.x * 0.8 + t, t * 0.6)) * 0.18;
    float w2 = snoise(vec2(p.x * 0.6 - t * 0.8, 3.0 + t * 0.4)) * 0.22;
    float band1 = smoothstep(0.22, 0.0, abs(p.y - 0.72 - w1));
    float band2 = smoothstep(0.30, 0.0, abs(p.y - 0.25 - w2));

    float grain = snoise(p * 3.0 + t) * 0.03;

    vec3 col = base;
    col = mix(col, violet, band2 * 0.75);
    col = mix(col, orange, band1 * 0.35);
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const ShaderBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5) });
    } catch {
      return; // pas de WebGL : on garde le fond CSS
    }
    const gl = renderer.gl;
    if (!gl) return;
    Object.assign(gl.canvas.style, { width: '100%', height: '100%', display: 'block', opacity: '0', transition: 'opacity 1s ease' });
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: { uTime: { value: 0 }, uResolution: { value: [1, 1] } },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uResolution.value = [container.clientWidth, container.clientHeight];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Boucle en pause hors écran et onglet caché
    let rafId = 0;
    let visible = false;
    let start = 0;
    let elapsed = 0;
    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      program.uniforms.uTime.value = elapsed + (now - start) / 1000;
      renderer.render({ scene: mesh });
    };
    const play = () => {
      if (rafId || !visible || document.hidden) return;
      start = performance.now();
      rafId = requestAnimationFrame(loop);
    };
    const pause = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
      elapsed += (performance.now() - start) / 1000;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? play() : pause();
    });
    io.observe(container);
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVisibility);

    renderer.render({ scene: mesh });
    requestAnimationFrame(() => { gl.canvas.style.opacity = '1'; });

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;
};

export default ShaderBackground;
