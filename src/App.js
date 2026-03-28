/**
 * ============================================================
 * PAVAN S — Video Editor | Motion Graphics | VFX | Storytelling
 * Cinematic 3D Portfolio · Single-file React SPA
 * Real resume data · Three.js + Framer Motion
 * Hero: Floating NLE Edit Timeline (ambient, non-overpowering)
 * ============================================================
 */

import React, {
  useRef, useState, useEffect, Suspense, useMemo
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Torus } from "@react-three/drei";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --black:    #030508;
        --deep:     #07090f;
        --void:     #0b0e1a;
        --orange:   #ff6b1a;
        --orange2:  #ff9a56;
        --cyan:     #00e5ff;
        --gold:     #ffd166;
        --glass:    rgba(255,255,255,0.035);
        --border:   rgba(255,255,255,0.07);
        --border-o: rgba(255,107,26,0.25);
        --text:     #dce3f0;
        --muted:    #5a6180;
        --font-display: 'Orbitron', sans-serif;
        --font-body:    'Rajdhani', sans-serif;
        --font-mono:    'IBM Plex Mono', monospace;
      }

      html { scroll-behavior: smooth; }
      body {
        background: var(--black);
        color: var(--text);
        font-family: var(--font-body);
        overflow-x: hidden;
        cursor: none;
      }

      @media (max-width: 768px) {
        body { cursor: auto; }
      }

      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: var(--deep); }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(var(--orange), var(--cyan));
        border-radius: 3px;
      }

      .glass {
        background: var(--glass);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid var(--border);
      }

      canvas { display: block; }

      @keyframes flicker {
        0%, 94%, 100% { opacity: 1; }
        95% { opacity: 0.82; }
        97% { opacity: 1; }
        98% { opacity: 0.88; }
      }

      /* ── MOBILE RESPONSIVE OVERRIDES ── */

      /* Nav */
      @media (max-width: 768px) {
        .nav-links { display: none !important; }
        .nav-hire { display: none !important; }
        .nav-hamburger { display: flex !important; }
        .nav-root { padding: 14px 20px !important; }
      }

      /* Mobile drawer */
      .mobile-drawer {
        display: none;
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(3,5,8,0.97);
        backdrop-filter: blur(24px);
        z-index: 999;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 32px;
      }
      .mobile-drawer.open { display: flex; }

      /* Section padding */
      @media (max-width: 768px) {
        .section-inner { padding: 0 20px !important; }
        .section-pad { padding: 80px 0 !important; }
      }

      /* About grid */
      @media (max-width: 768px) {
        .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .about-orb { display: none !important; }
        .about-langs { flex-wrap: wrap !important; gap: 10px !important; }
      }

      /* Experience cards */
      @media (max-width: 768px) {
        .exp-card { grid-template-columns: 1fr !important; gap: 16px !important; padding: 24px !important; }
      }

      /* Education grid */
      @media (max-width: 768px) {
        .edu-grid { grid-template-columns: 1fr !important; }
      }

      /* Portfolio grid */
      @media (max-width: 900px) {
        .portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 560px) {
        .portfolio-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 768px) {
        .portfolio-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
      }

      /* Skills grid */
      @media (max-width: 768px) {
        .skills-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        .tools-grid { grid-template-columns: repeat(4, 1fr) !important; }
      }

      /* Contact grid */
      @media (max-width: 768px) {
        .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      }

      /* Hero stats */
      @media (max-width: 480px) {
        .hero-stats { gap: 32px !important; }
      }

      /* Video modal */
      @media (max-width: 640px) {
        .modal-body { flex-direction: column !important; overflow-y: auto !important; }
        .modal-player { padding: 12px !important; width: 100% !important; }
        .modal-player-inner {
          height: auto !important;
          aspect-ratio: 9/16 !important;
          max-height: 55vw !important;
          width: 100% !important;
          min-height: 200px;
        }
        .modal-tabs { max-height: 220px !important; padding: 12px !important; }
      }

      /* Footer */
      @media (max-width: 640px) {
        .footer-root { padding: 28px 20px !important; flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
      }

      /* Hero canvas — reduce on mobile */
      @media (max-width: 768px) {
        .hero-canvas-wrap canvas { opacity: 0.5 !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ─────────────────────────────────────────
   CUSTOM CURSOR — hidden on touch
───────────────────────────────────────── */
const CustomCursor = () => {
  const outer = useRef(null);
  const dot = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dot.current)
        dot.current.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 5}px)`;
    };
    const onOver = (e) => { if (e.target.closest("a,button,[data-hover]")) setHov(true); };
    const onOut = () => setHov(false);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.1);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.1);
      if (outer.current)
        outer.current.style.transform =
          `translate(${pos.current.x - 22}px,${pos.current.y - 22}px) scale(${hov ? 1.7 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, [hov]);

  if (isMobile) return null;

  return (
    <>
      <div ref={outer} style={{
        position: "fixed", top: 0, left: 0, width: 44, height: 44,
        border: `1.5px solid ${hov ? "var(--orange)" : "var(--cyan)"}`,
        borderRadius: "50%", pointerEvents: "none", zIndex: 9999,
        transition: "border-color 0.25s, transform 0.08s",
        mixBlendMode: "exclusion",
      }} />
      <div ref={dot} style={{
        position: "fixed", top: 0, left: 0, width: 10, height: 10,
        background: "var(--orange)", borderRadius: "50%",
        pointerEvents: "none", zIndex: 9999,
        boxShadow: "0 0 12px var(--orange)",
      }} />
    </>
  );
};

/* ─────────────────────────────────────────
   CINEMATIC LOADING SCREEN
───────────────────────────────────────── */
const LoadingScreen = ({ onComplete }) => {
  const [prog, setProg] = useState(0);
  const [phase, setPhase] = useState("load");

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setPhase("reveal"); }
      setProg(Math.min(p, 100));
    }, 100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (phase === "reveal") {
      const t = setTimeout(() => { setPhase("done"); onComplete(); }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "var(--black)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,0.015) 2px,rgba(0,229,255,0.015) 4px)",
          }} />
          {[{ top: 30, left: 30 }, { top: 30, right: 30 }, { bottom: 30, left: 30 }, { bottom: 30, right: 30 }].map((s, i) => (
            <div key={i} style={{
              position: "absolute", ...s, width: 24, height: 24,
              borderTop: i < 2 ? "1px solid var(--orange)" : "none",
              borderBottom: i >= 2 ? "1px solid var(--orange)" : "none",
              borderLeft: i % 2 === 0 ? "1px solid var(--orange)" : "none",
              borderRight: i % 2 === 1 ? "1px solid var(--orange)" : "none",
            }} />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem,9vw,5.5rem)",
              fontWeight: 900, letterSpacing: "0.25em", color: "var(--cyan)",
              textShadow: "0 0 40px var(--cyan), 0 0 100px rgba(0,229,255,0.2)",
              animation: "flicker 4s infinite",
            }}>PAVAN S</div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              letterSpacing: "0.45em", color: "var(--orange)", marginTop: 10,
              textShadow: "0 0 15px var(--orange)",
            }}>VIDEO EDITOR · MOTION GRAPHICS · VFX</div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ width: "min(300px, 80vw)" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 12, position: "relative" }}>
              <motion.div
                animate={{ width: `${prog}%` }} transition={{ duration: 0.15 }}
                style={{
                  position: "absolute", left: 0, top: 0, height: "100%",
                  background: "linear-gradient(90deg, var(--orange), var(--cyan))",
                  boxShadow: "0 0 12px var(--cyan)",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--muted)" }}>
              <span>LOADING PORTFOLIO</span>
              <span style={{ color: "var(--cyan)" }}>{Math.round(prog)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   3D: FLOATING EDIT TIMELINE
───────────────────────────────────────── */
const Clip = ({ x, width, trackY, color, opacity = 0.18 }) => {
  const col = new THREE.Color(color);
  return (
    <group position={[x + width / 2, trackY, 0]}>
      <mesh>
        <boxGeometry args={[width, 0.12, 0.04]} />
        <meshStandardMaterial color={col} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.06, 0.021]}>
        <boxGeometry args={[width, 0.008, 0.001]} />
        <meshStandardMaterial color={col} transparent opacity={opacity * 2.2} emissive={col} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-width / 2 + 0.005, 0, 0.022]}>
        <boxGeometry args={[0.01, 0.12, 0.001]} />
        <meshStandardMaterial color={col} transparent opacity={opacity * 3} emissive={col} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

const CutMarker = ({ x, trackY, color }) => {
  const col = new THREE.Color(color);
  return (
    <mesh position={[x, trackY, 0.03]}>
      <boxGeometry args={[0.008, 0.13, 0.001]} />
      <meshStandardMaterial color={col} transparent opacity={0.35} emissive={col} emissiveIntensity={0.5} />
    </mesh>
  );
};

const TrackLane = ({ y, width, opacity = 0.06 }) => (
  <mesh position={[width / 2, y, -0.01]}>
    <boxGeometry args={[width, 0.14, 0.01]} />
    <meshStandardMaterial color="#ffffff" transparent opacity={opacity} />
  </mesh>
);

const Playhead = ({ x, height }) => {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
  });
  return (
    <group position={[x, 0, 0.05]}>
      <mesh ref={ref}>
        <boxGeometry args={[0.018, height, 0.001]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.55} emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, height / 2 + 0.04, 0]}>
        <boxGeometry args={[0.09, 0.04, 0.001]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const Waveform = ({ x, y, width, color }) => {
  const bars = useMemo(() => {
    const b = [];
    const count = Math.floor(width / 0.065);
    for (let i = 0; i < count; i++) {
      const h = (Math.sin(i * 0.38) * 0.5 + 0.5) * 0.07 + 0.01;
      b.push({ offset: i * 0.065, h });
    }
    return b;
  }, [width]);

  const col = new THREE.Color(color);
  return (
    <group position={[x, y, 0.02]}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.offset, 0, 0]}>
          <boxGeometry args={[0.04, bar.h, 0.001]} />
          <meshStandardMaterial color={col} transparent opacity={0.28} emissive={col} emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const EditTimeline = ({ mouse }) => {
  const group = useRef();
  const timeRef = useRef(0);

  const TRACK_W = 14;
  const TRACK_START = -7;
  const tracks = [
    { y: 1.05, color: "#ff6b1a", clips: [{ x: 0.2, w: 1.8 }, { x: 2.2, w: 1.2 }, { x: 3.6, w: 2.1 }, { x: 6.1, w: 1.4 }, { x: 7.8, w: 1.9 }, { x: 10.0, w: 1.6 }, { x: 11.9, w: 1.8 }], cuts: [2.0, 3.4, 5.7, 7.6] },
    { y: 0.88, color: "#00e5ff", clips: [{ x: 0.0, w: 2.5 }, { x: 2.7, w: 1.0 }, { x: 3.9, w: 1.8 }, { x: 6.0, w: 2.3 }, { x: 8.5, w: 1.2 }, { x: 10.0, w: 2.5 }, { x: 12.7, w: 1.0 }], cuts: [2.5, 3.7, 5.8, 8.3] },
    { y: 0.71, color: "#ffd166", clips: [{ x: 0.4, w: 1.5 }, { x: 2.1, w: 0.8 }, { x: 3.1, w: 2.4 }, { x: 5.7, w: 1.1 }, { x: 7.0, w: 2.0 }, { x: 9.2, w: 1.8 }, { x: 11.2, w: 2.5 }], cuts: [1.9, 2.9, 5.5, 6.8] },
    { y: 0.54, color: "#9b4dff", clips: [{ x: 0.0, w: 1.1 }, { x: 1.3, w: 2.0 }, { x: 3.5, w: 0.9 }, { x: 4.6, w: 2.2 }, { x: 7.0, w: 1.5 }, { x: 8.7, w: 2.0 }, { x: 10.9, w: 2.8 }], cuts: [1.1, 3.3, 4.4, 6.8] },
    { y: 0.37, color: "#00ff9f", clips: [{ x: 0.5, w: 2.2 }, { x: 2.9, w: 1.4 }, { x: 4.5, w: 1.8 }, { x: 6.5, w: 1.0 }, { x: 7.7, w: 2.5 }, { x: 10.4, w: 1.2 }, { x: 11.8, w: 1.9 }], cuts: [2.7, 4.3, 6.3, 7.5] },
    { y: 0.20, color: "#00e5ff", isWave: true },
    { y: 0.07, color: "#ff6b1a", isWave: true },
  ];

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    timeRef.current = t;
    const targetX = mouse.current.x * 0.12;
    const targetY = mouse.current.y * 0.06;
    group.current.rotation.y += (targetX - group.current.rotation.y) * 0.03;
    group.current.rotation.x += (targetY + 0.18 - group.current.rotation.x) * 0.03;
    group.current.position.x += (-0.003 - group.current.position.x * 0.001);
    if (group.current.position.x < -3) group.current.position.x = 0;
  });

  return (
    <group ref={group} position={[0, -0.4, -1.5]} rotation={[0.18, 0, 0]}>
      {tracks.map((tr, i) => (
        <TrackLane key={i} y={tr.y} width={TRACK_W} opacity={0.05} />
      ))}
      {tracks.map((tr, ti) =>
        tr.isWave
          ? <Waveform key={ti} x={TRACK_START} y={tr.y} width={TRACK_W} color={tr.color} />
          : (
            <group key={ti}>
              {tr.clips.map((cl, ci) => (
                <Clip key={ci} x={TRACK_START + cl.x} width={cl.w} trackY={tr.y} color={tr.color} opacity={0.16} />
              ))}
              {tr.cuts.map((cx, ci) => (
                <CutMarker key={ci} x={TRACK_START + cx} trackY={tr.y} color={tr.color} />
              ))}
            </group>
          )
      )}
      <Playhead x={TRACK_START + (TRACK_W / 2)} height={1.15} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
        <mesh key={i} position={[TRACK_START + i, 1.2, 0.01]}>
          <boxGeometry args={[0.006, 0.06, 0.001]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      ))}
      <mesh position={[0, 1.24, 0]}>
        <boxGeometry args={[TRACK_W, 0.004, 0.001]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[TRACK_W, 0.004, 0.001]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </group>
  );
};

/* ─────────────────────────────────────────
   3D: PARTICLES
───────────────────────────────────────── */
const Particles = ({ count = 120 }) => {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      if (Math.random() < 0.5) { col[i * 3] = 1; col[i * 3 + 1] = 0.42; col[i * 3 + 2] = 0.1; }
      else { col[i * 3] = 0; col[i * 3 + 1] = 0.9; col[i * 3 + 2] = 1; }
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.35} sizeAttenuation />
    </points>
  );
};

/* ─────────────────────────────────────────
   HERO CANVAS
───────────────────────────────────────── */
const HeroCanvas = ({ mouse }) => (
  <div className="hero-canvas-wrap" style={{ position: "absolute", inset: 0 }}>
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 52 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.08} />
      <pointLight position={[3, 4, 4]} intensity={0.5} color="#00e5ff" />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#ff6b1a" />
      <Suspense fallback={null}>
        <Stars radius={90} depth={60} count={2500} factor={2.2} saturation={0.8} fade speed={0.3} />
        <EditTimeline mouse={mouse} />
        <Particles count={120} />
      </Suspense>
      <fog attach="fog" args={["#030508", 14, 28]} />
    </Canvas>
  </div>
);

/* ─────────────────────────────────────────
   3D: DISTORTED ORB (About section)
───────────────────────────────────────── */
const DistortedOrb = ({ mouse }) => {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.18 + mouse.current.y * 0.4;
    ref.current.rotation.y = s.clock.elapsedTime * 0.25 + mouse.current.x * 0.4;
  });
  return (
    <Float speed={1.8} floatIntensity={0.5}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <MeshDistortMaterial color="#0d1424" distort={0.45} speed={2.2}
          metalness={0.75} roughness={0.12} emissive="#ff6b1a" emissiveIntensity={0.18} />
      </mesh>
      {[0, 1, 2].map(i => (
        <Torus key={i} args={[1.9 + i * 0.45, 0.016, 16, 100]}
          rotation={[Math.PI / 2.5 * (i + 1), Math.PI / 3 * i, 0]}>
          <meshStandardMaterial
            color={["#ff6b1a", "#00e5ff", "#ffd166"][i]}
            emissive={["#ff6b1a", "#00e5ff", "#ffd166"][i]}
            emissiveIntensity={1.8} transparent opacity={0.55} />
        </Torus>
      ))}
    </Float>
  );
};

const AboutCanvas = ({ mouse }) => (
  <Canvas camera={{ position: [0, 0, 5.5], fov: 48 }}
    style={{ width: "100%", height: "100%" }}
    gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
    <ambientLight intensity={0.12} />
    <pointLight position={[3, 3, 3]} intensity={1.4} color="#00e5ff" />
    <pointLight position={[-3, -3, -3]} intensity={1} color="#ff6b1a" />
    <Suspense fallback={null}>
      <DistortedOrb mouse={mouse} />
      <Particles count={70} />
    </Suspense>
  </Canvas>
);

/* ─────────────────────────────────────────
   NAV — with mobile hamburger + drawer
───────────────────────────────────────── */
const Nav = ({ active }) => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const links = ["hero", "about", "experience", "education", "portfolio", "skills", "contact"];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => {
    setDrawerOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <>
      <motion.nav
        className="nav-root"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          padding: "18px 60px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(3,5,8,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          transition: "all 0.4s",
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900, letterSpacing: "0.2em" }}>
          <span style={{ color: "var(--cyan)" }}>PAVAN </span>
          <span style={{ color: "var(--orange)" }}>S</span>
        </div>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: "flex", gap: 32 }}>
          {links.map(l => (
            <button key={l} data-hover onClick={() => go(l)} style={{
              background: "none", border: "none", cursor: "none",
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: active === l ? "var(--orange)" : "var(--muted)",
              textShadow: active === l ? "0 0 12px var(--orange)" : "none",
              transition: "all 0.3s",
            }}>{l}</button>
          ))}
        </div>

        <motion.button className="nav-hire" data-hover onClick={() => go("contact")}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,107,26,0.5)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "linear-gradient(135deg, var(--orange), #ff9500)",
            border: "none", padding: "9px 26px", borderRadius: 2,
            fontFamily: "var(--font-mono)", fontSize: "0.62rem",
            letterSpacing: "0.2em", color: "#000", fontWeight: 600,
            cursor: "none", boxShadow: "0 0 18px rgba(255,107,26,0.35)",
          }}
        >HIRE ME</motion.button>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setDrawerOpen(o => !o)}
          style={{
            display: "none",
            background: "none", border: "none", cursor: "pointer",
            flexDirection: "column", gap: 5, padding: 6,
          }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: 22, height: 1.5,
              background: drawerOpen
                ? (i === 1 ? "transparent" : "var(--orange)")
                : "var(--cyan)",
              transition: "all 0.3s",
              transform: drawerOpen
                ? (i === 0 ? "rotate(45deg) translate(4px,4px)" : i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none")
                : "none",
            }} />
          ))}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{
          position: "absolute", top: 20, right: 20,
          fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.2em",
        }}>
          <span style={{ color: "var(--cyan)" }}>PAVAN </span>
          <span style={{ color: "var(--orange)" }}>S</span>
        </div>
        {links.map((l, i) => (
          <motion.button
            key={l}
            initial={{ opacity: 0, x: -20 }}
            animate={drawerOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => go(l)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-display)", fontSize: "1.4rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: active === l ? "var(--orange)" : "var(--text)",
              textShadow: active === l ? "0 0 20px var(--orange)" : "none",
            }}
          >{l}</motion.button>
        ))}
        <motion.button
          initial={{ opacity: 0 }}
          animate={drawerOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => go("contact")}
          style={{
            marginTop: 16,
            background: "linear-gradient(135deg, var(--orange), #ff9500)",
            border: "none", padding: "12px 36px", borderRadius: 2,
            fontFamily: "var(--font-mono)", fontSize: "0.75rem",
            letterSpacing: "0.2em", color: "#000", fontWeight: 700, cursor: "pointer",
          }}
        >HIRE ME</motion.button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────── */
const FadeIn = ({ children, delay = 0, y = 28, style }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    style={style}
  >{children}</motion.div>
);

const SectionLabel = ({ num, label }) => (
  <div style={{
    fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.45em", color: "var(--orange)",
    marginBottom: 14, display: "flex", alignItems: "center", gap: 12,
  }}>
    <span style={{ color: "var(--muted)" }}>{num}</span>
    <span style={{ width: 24, height: 1, background: "var(--orange)", display: "inline-block" }} />
    {label}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,5.5vw,4.5rem)",
    fontWeight: 900, letterSpacing: "0.06em", lineHeight: 1.05,
    background: "linear-gradient(135deg, #fff 0%, var(--cyan) 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  }}>{children}</h2>
);

const MouseLight = () => {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current)
        ref.current.style.background =
          `radial-gradient(350px circle at ${e.clientX}px ${e.clientY}px, rgba(255,107,26,0.05), transparent 65%)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", transition: "background 0.06s" }} />;
};

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */
const roles = ["VIDEO EDITOR", "MOTION GRAPHICS DESIGNER", "COLOR GRADING", "VFX ARTIST", "AD CREATIVE EDITOR", "VISUAL STORYTELLING", "AUDIO MIXING"];

const HeroSection = ({ mouse }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [ri, setRi] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setRi(p => (p + 1) % roles.length), 2400);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="hero" style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <HeroCanvas mouse={mouse} />

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: [
          "radial-gradient(ellipse 70% 55% at 50% 48%, transparent 20%, var(--black) 100%)",
          "linear-gradient(to bottom, rgba(3,5,8,0.55) 0%, transparent 18%, transparent 78%, rgba(3,5,8,0.8) 100%)",
        ].join(","),
      }} />

      <MouseLight />

      <motion.div style={{
        y, opacity,
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 0",
        isolation: "isolate",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.38em", color: "var(--cyan)",
            marginBottom: 22, display: "flex", alignItems: "center", gap: 14,
          }}
        >
          <span style={{ width: 36, height: 1, background: "var(--cyan)", display: "inline-block" }} />
          BANGALORE, INDIA
          <span style={{ width: 36, height: 1, background: "var(--cyan)", display: "inline-block" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(4rem,12vw,9rem)",
            letterSpacing: "0.05em", lineHeight: 1.1,
            background: "linear-gradient(150deg, #fff 0%, var(--cyan) 40%, var(--orange) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 20,
          }}
        >PAVAN S</motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ height: 46, overflow: "hidden", marginBottom: 40 }}>
          <AnimatePresence mode="wait">
            <motion.p key={ri}
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -36, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(1rem,3vw,1.8rem)",
                fontWeight: 700, letterSpacing: "0.5em", color: "var(--orange)",
                textShadow: "0 0 35px rgba(255,107,26,0.5)",
              }}
            >{roles[ri]}</motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.95rem,1.8vw,1.1rem)",
            color: "var(--muted)", maxWidth: 560, lineHeight: 1.75, marginBottom: 40,
            padding: "0 8px",
          }}
        >
          1+ year crafting high-retention digital content — from Instagram Reels to ad creatives —
          with Adobe tools, CapCut, and AI-powered workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}
        >
          <motion.button data-hover
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,107,26,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg, var(--orange), #ff9500)",
              border: "none", padding: "15px 42px", borderRadius: 2,
              fontFamily: "var(--font-mono)", fontSize: "0.7rem",
              letterSpacing: "0.22em", color: "#000", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 0 22px rgba(255,107,26,0.35)",
            }}
          >VIEW WORK</motion.button>
          <motion.button data-hover
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              border: "1px solid rgba(0,229,255,0.35)", padding: "15px 42px", borderRadius: 2,
              fontFamily: "var(--font-mono)", fontSize: "0.7rem",
              letterSpacing: "0.22em", color: "var(--cyan)", cursor: "pointer",
            }}
          >CONTACT</motion.button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          style={{ marginTop: 72, display: "flex", gap: 64, whiteSpace: "nowrap" }}
        >
          {[["1+", "Year Exp."], ["5mo", "News Editing"], ["4", "Languages"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900,
                color: "var(--orange)", textShadow: "0 0 18px rgba(255,107,26,0.5)",
              }}>{n}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.2em", color: "var(--muted)" }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
        style={{
          position: "absolute", bottom: 28, right: 56,
          fontFamily: "var(--font-mono)", fontSize: "0.56rem",
          letterSpacing: "0.3em", color: "var(--muted)",
          writingMode: "vertical-lr", display: "flex", alignItems: "center", gap: 10,
        }}
      >
        SCROLL
        <motion.div
          animate={{ scaleY: [1, 0.25, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ width: 1, height: 36, background: "var(--orange)", transformOrigin: "top" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
        style={{
          position: "absolute", bottom: 28, left: 56,
          fontFamily: "var(--font-mono)", fontSize: "0.52rem",
          letterSpacing: "0.28em", color: "rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", opacity: 0.4, display: "inline-block" }} />
        NLE TIMELINE
      </motion.div>
    </section>
  );
};

/* ─────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────── */
const AboutSection = ({ mouse }) => {
  const tools = ["Adobe Premiere", "Adobe After Effects", "Adobe Photoshop", "Adobe Illustrator", "CapCut", "Mocha Pro", "AI Tools (Editing & Animation)"];

  return (
    <section id="about" className="section-pad" style={{ padding: "130px 0", background: "var(--deep)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "5%",
        width: 700, height: 700,
        background: "radial-gradient(circle, rgba(255,107,26,0.06) 0%, transparent 65%)",
        transform: "translateY(-50%)", pointerEvents: "none",
      }} />
      <div className="section-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <FadeIn>
          <SectionLabel num="01" label="ABOUT ME" />
          <div style={{ marginBottom: 70 }}><SectionTitle>CREATIVE<br />STORYTELLER</SectionTitle></div>
        </FadeIn>

        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <FadeIn delay={0.1}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.08rem", lineHeight: 1.85, color: "var(--text)", opacity: 0.82, marginBottom: 22 }}>
                Creative Video Editor with <strong style={{ color: "var(--cyan)" }}>1+ year of experience</strong> in digital marketing
                and 5 months of professional training in a Kannada Medium 24x7 news channel.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.08rem", lineHeight: 1.85, color: "var(--text)", opacity: 0.82, marginBottom: 22 }}>
                Proficient in Adobe tools and CapCut, with strong skills in <strong style={{ color: "var(--orange)" }}>color grading,
                  motion graphics</strong>, and storytelling. Experienced in using AI tools for animation,
                story development, and workflow automation.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1.08rem", lineHeight: 1.85, color: "var(--text)", opacity: 0.82, marginBottom: 36 }}>
                Focused on creating <strong style={{ color: "var(--gold)" }}>high-retention, visually engaging videos</strong> for
                digital platforms — from Instagram Reels and YouTube Shorts to ad creatives and live news content.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {tools.map(t => (
                  <motion.div key={t} className="glass"
                    whileHover={{ borderColor: "var(--orange)", color: "var(--orange)" }}
                    style={{
                      padding: "7px 16px", borderRadius: 2,
                      fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                      letterSpacing: "0.12em", color: "var(--muted)", transition: "all 0.3s",
                    }}
                  >{t}</motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ display: "flex", gap: 28, marginTop: 36, flexWrap: "wrap" }}>
                {[
                  { label: "EMAIL", val: "rownumdrag@gmail.com" },
                  { label: "PHONE", val: "+91 9980724331" },
                  { label: "CITY", val: "Bangalore, Karnataka" },
                ].map(c => (
                  <div key={c.label}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.25em", color: "var(--muted)", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--cyan)", fontWeight: 600 }}>{c.val}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn className="about-orb" delay={0.2} style={{ height: 420 }}>
            <div style={{ height: "100%", borderRadius: 4, overflow: "hidden" }}>
              <AboutCanvas mouse={mouse} />
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} style={{ marginTop: 70 }}>
          <div className="about-langs" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--muted)", whiteSpace: "nowrap" }}>LANGUAGES</div>
            <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
            {["Tamil", "Kannada", "English", "Telugu"].map(l => (
              <div key={l} className="glass" style={{
                padding: "8px 20px", borderRadius: 2,
                fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--gold)",
              }}>{l}</div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   PORTFOLIO SECTION
───────────────────────────────────────── */
const categories = [
  {
    id: 1,
    cat: "Motion Graphics Ads",
    desc: "Voice-over based ads with text animation, visual effects, and vector motion design.",
    color: "#ff6b1a",
    thumb: "#1a0c05",
    tags: ["Motion Graphics", "Text Animation"],
    videos: [
      { title: "Motion Graphics Ad 1", url: "https://drive.google.com/file/d/1YsZCKHwOhcIK-F_KJYXBD4LCgvt3nOg3/preview" },
      { title: "Motion Graphics Ad 2", url: "https://drive.google.com/file/d/1mtN7xbWQ88PzOcgJp2pshfrs6Qg6DR7O/preview" },
      { title: "Motion Graphics Ad 3", url: "https://drive.google.com/file/d/13QtzjTXDjotH0Y4WaqYWrjFys4ObthS7/preview" },
      { title: "Motion Graphics Ad 4", url: "https://drive.google.com/file/d/1P_SAfK2oHFrbO6AUUbb9fRqVCMJRQx2X/preview" },
      { title: "Motion Graphics Ad 5", url: "https://drive.google.com/file/d/1IFL735oe9YesZ2bAm-tP5HpFJ8Cg1eWz/preview" },
      { title: "Motion Graphics Ad 6", url: "https://drive.google.com/file/d/1GYckvcpVQSo7ofy2DBy69tiwBa70yWPr/preview" },
      { title: "Motion Graphics Ad 7", url: "https://drive.google.com/file/d/1X7Jh-MJVxfloycEqSq7gybiYem8u-NZA/preview" },
      { title: "Motion Graphics Ad 8", url: "https://drive.google.com/file/d/1d75gh7pJCTLjwDy_Ys74ObjJ2BZQr955/preview" },
      { title: "Motion Graphics Ad 9", url: "https://drive.google.com/file/d/1lcUr65htdkdzEhLA2T6NinIBI0b6Mm-G/preview" },
    ]
  },
  {
    id: 2,
    cat: "Talking Head Videos",
    desc: "Clean cuts, subtitles, and pacing focused on audience engagement and clarity.",
    color: "#00e5ff",
    thumb: "#051a1a",
    tags: ["Engaging Content", "Subtitles"],
    videos: [
      { title: "Talking Head Edit 1", url: "https://drive.google.com/file/d/1eJJQx0VgEfBPMbN89-IxtHzSwntjRnEA/preview" },
      { title: "Talking Head Edit 2", url: "https://drive.google.com/file/d/1_P1w8Ne41BSBrqBlXjmbAWJ-ztxOVh-g/preview" },
      { title: "Talking Head Edit 3", url: "https://drive.google.com/file/d/1L_xt4JoUS0TR5wkoWDJgYBDBMtSxVlhR/preview" },
      { title: "Talking Head Edit 4", url: "https://drive.google.com/file/d/1XQi5LSmhSgcWZnH2Yd44Vo_0GZ8UlGw-/preview" },
      { title: "Talking Head Edit 5", url: "https://drive.google.com/file/d/1yczWDJkq5kvPKXUKOxCPv_Z1E72VLz1Y/preview" },
    ]
  },
  {
    id: 3,
    cat: "Fast-Paced Edits & Beat Sync",
    desc: "High-energy rhythm-focused editing with precise beat synchronisation and dynamic transitions.",
    color: "#ffd166",
    thumb: "#1a1505",
    tags: ["Beat Sync", "Fast Cuts"],
    videos: [
      { title: "Beat Sync Edit 1", url: "https://drive.google.com/file/d/1jOOM8zlTlLGBfr_oySHVpx6O0v5pydJs/preview" },
      { title: "Beat Sync Edit 2", url: "https://drive.google.com/file/d/15X3D5OFYkckUo1rRoTWYC1Ra0oaYPA_m/preview" },
      { title: "Beat Sync Edit 3", url: "https://drive.google.com/file/d/1k5dcCxb0Eh1yUHJcpbD1dLyRBYD_an9N/preview" },
      { title: "Beat Sync Edit 4", url: "https://drive.google.com/file/d/1NirPIXXtEclGXJHZmRyL581_ZwxvDyJG/preview" },
      { title: "Beat Sync Edit 5", url: "https://drive.google.com/file/d/1RNkHB-wyQJlP1Bos8_i1-upc2pKOJhOT/preview" },
      { title: "Beat Sync Edit 6", url: "https://drive.google.com/file/d/1EG3aB-4AV9X-QAbolAkcgW7FJeiObnDv/preview" },
    ]
  },
  {
    id: 4,
    cat: "Product & Brand Ads",
    desc: "Product-focused ad edits with motion graphics, visual effects, and engaging storytelling.",
    color: "#9b4dff",
    thumb: "#100a1a",
    tags: ["Product Ads", "Showcase"],
    videos: [
      { title: "Product Ad 1", url: "https://drive.google.com/file/d/1atlqxWR5CF5EyepeXPozYp1vyVxJByMP/preview" },
      { title: "Product Ad 2", url: "https://drive.google.com/file/d/1zPTngh3er27bryv3qit-BC3Zp64zgII7/preview" },
      { title: "Product Ad 3", url: "https://drive.google.com/file/d/11eqHATJYL9o_nUiOQM5HCCt6FolYJ6hF/preview" },
      { title: "Product Ad 4", url: "https://drive.google.com/file/d/14EGRtPxcIRfiRf__lmtjgYRNep6OgI3E/preview" },
      { title: "Product Ad 5", url: "https://drive.google.com/file/d/1oIetQ0LP-7G_mXhvD7oHC-sQnftJV9C5/preview" },
      { title: "Product Ad 6", url: "https://drive.google.com/file/d/1VPGbUyPh-7ufUOLrVK26HL1-KL5KkPMr/preview" },
      { title: "Product Ad 7", url: "https://drive.google.com/file/d/1HnPjz4nmlXyMcAMrLRAtsSQQ8QeIL7Eo/preview" },
      { title: "Product Ad 8", url: "https://drive.google.com/file/d/1nffjFj_G3Ku3uOzAJO70HEDjZ7QwsBfV/preview" },
      { title: "Product Ad 9", url: "https://drive.google.com/file/d/1UPUkmOn4LfXa6YMmLVVUbnmqFK-HNKV9/preview" },
      { title: "Product Ad 10", url: "https://drive.google.com/file/d/133Ol30gAcA36_AhPbm3QVGUmpw1OBOT8/preview" },
    ]
  },
  {
    id: 5,
    cat: "AI-Generated Content & Animation",
    desc: "AI-assisted editing with voice sync, visual storytelling, and animated content creation.",
    color: "#00ff9f",
    thumb: "#051a0d",
    tags: ["AI Tools", "Animation"],
    videos: [
      { title: "AI Content 1", url: "https://drive.google.com/file/d/1ZwNLmCZo-MM9kMv_Nr6UH_ACNjvBE2C8/preview" },
      { title: "AI Content 2", url: "https://drive.google.com/file/d/1B3p4JqAP1eNHhxh8I_YQH51kCFnT6iUA/preview" },
      { title: "AI Content 3", url: "https://drive.google.com/file/d/1WNiZrCHVQ0k9txudckpfDNw74tBmv9_d/preview" },
      { title: "AI Podcast 1", url: "https://drive.google.com/file/d/1CYYrnofN8Mj-KK9hJaysdop3fqtP9ksQ/preview" },
      { title: "AI Podcast 2", url: "https://drive.google.com/file/d/1rKmorfriF_Wme99HJNtr8-FO7GU0-tYc/preview" },
      { title: "AI Podcast 3", url: "https://drive.google.com/file/d/1lmf65c132tk50BEkVEhPdeVLtZ8hwydZ/preview" },
    ]
  },
  {
    id: 6,
    cat: "Color Grading",
    desc: "Professional colour correction and cinematic look development — Before & After showcases.",
    color: "#ff6b9d",
    thumb: "#1a0510",
    tags: ["LUTs", "Color Correction"],
    videos: [
      { title: "Before 1", url: "https://drive.google.com/file/d/1qOqAWVFHD4WwxTNLsOxRIXf_cP8b3ku9/preview" },
      { title: "Before 2", url: "https://drive.google.com/file/d/1TxRgO2oUo_qs-2yKanCaf1HseptV5ngs/preview" },
      { title: "Before 3", url: "https://drive.google.com/file/d/12M4UdVEDsJMle6uIB80Ex_b39Xh4s6qd/preview" },
      { title: "Before 4", url: "https://drive.google.com/file/d/1OFldeu4bahWfpKuHOYioPkzMra-kVrlv/preview" },
      { title: "Before 5", url: "https://drive.google.com/file/d/1aki0ESiLsAGuRJ8O8xy63zcmBKmhLIkI/preview" },
      { title: "After 1", url: "https://drive.google.com/file/d/1Z-EaOQREqKAr-I47Q6KCZ7sOLGFPj93o/preview" },
      { title: "After 2", url: "https://drive.google.com/file/d/1Zx--aaynuWmveHJxYt7UVPfi9Pbjyqt1/preview" },
      { title: "After 3", url: "https://drive.google.com/file/d/1hHCmLh5WOudaiLL6tcqDTrmJbbWO1zvK/preview" },
      { title: "After 4", url: "https://drive.google.com/file/d/1BRlpQ0j2cjxdk8JqWhvcIR2MNp_skB1N/preview" },
      { title: "After 5", url: "https://drive.google.com/file/d/1bJPmdnRGXgKRUDPZ7SjlbHwF5ExMKIGs/preview" },
    ]
  },
  {
    id: 7,
    cat: "Educational & Institutional Content",
    desc: "Informational content with clean edits, text highlights, and clear communication.",
    color: "#80f4ff",
    thumb: "#0a1a1a",
    tags: ["Institute Promo", "Clean Edits"],
    videos: [
      { title: "Educational Edit 1", url: "https://drive.google.com/file/d/1kkp71MFqFY9xYEWVT9A7CLTpFE6FVlK9/preview" },
      { title: "Educational Edit 2", url: "https://drive.google.com/file/d/1gZ54u-EsewxvvT6Kb6mQqyIOofZrjAFx/preview" },
      { title: "Educational Edit 3", url: "https://drive.google.com/file/d/1Sx8yIAwgknFjiZPURecSP46W3VIJFCri/preview" },
      { title: "Educational Edit 4", url: "https://drive.google.com/file/d/1cUz3qIwghC1S_AFm3yFa3XcP6qQzp3_m/preview" },
      { title: "Educational Edit 5", url: "https://drive.google.com/file/d/1FyiMeBITb8jQLD_DrfiXjCElCXQUjHXi/preview" },
      { title: "Educational Edit 6", url: "https://drive.google.com/file/d/16WXGEGEDfPAJcUnuuIdtWYkM6huy_4Qf/preview" },
      { title: "Educational Edit 7", url: "https://drive.google.com/file/d/1SRjDkOt8wyP73Tx_ZPlPfd-duoMRJX3Z/preview" },
    ]
  }
];

const VideoModal = ({ cat, onClose }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const video = cat.videos[active];
  const hasUrl = video && video.url && video.url.trim() !== "";
  const embedSrc = useMemo(() => {
    if (!hasUrl) return "";
    // Google Drive preview links don't support common YouTube parameters like rel or mute
    if (video.url.includes("drive.google.com")) return video.url;
    return `${video.url}?autoplay=1&mute=1&rel=0`;
  }, [hasUrl, video.url]);

  return (
    <AnimatePresence>
      <motion.div key="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 8000, background: "rgba(3,5,8,0.92)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
      >
        <motion.div key="modal-panel" initial={{ opacity: 0, scale: 0.93, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 28 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 780, height: "95vh", background: "#07090f", border: `1px solid ${cat.color}35`, borderTop: `3px solid ${cat.color}`, borderRadius: 8, overflow: "hidden", boxShadow: `0 40px 100px rgba(0,0,0,0.85), 0 0 60px ${cat.color}20`, display: "flex", flexDirection: "column" }}
        >
          <div style={{ padding: "14px 20px", borderBottom: `1px solid rgba(255,255,255,0.07)`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.3em", color: cat.color, textTransform: "uppercase", whiteSpace: "nowrap", background: `${cat.color}15`, padding: "3px 10px", borderRadius: 2, border: `1px solid ${cat.color}30`, flexShrink: 0 }}>CATEGORY</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 900, color: "#fff", letterSpacing: "0.04em", textShadow: `0 0 30px ${cat.color}40`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.cat}</h2>
            </div>
            <motion.button data-hover onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.95 }}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "var(--muted)", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}
            >✕</motion.button>
          </div>
          <div className="modal-body" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <div className="modal-player" style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 12px 16px 20px", background: "#05070d" }}>
              <div className="modal-player-inner" style={{ height: "100%", aspectRatio: "9/16", maxHeight: "calc(95vh - 65px - 32px)", background: "#0b0e1a", borderRadius: 6, border: `1px solid ${cat.color}30`, overflow: "hidden", position: "relative" }}>
                {hasUrl ? (
                  <iframe key={embedSrc} src={embedSrc} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${cat.color}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 0, height: 0, marginLeft: 6, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: `16px solid ${cat.color}60` }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--muted)", textAlign: "center" }}>COMING SOON</div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-tabs" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 20px 16px 12px", overflowY: "auto", gap: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6, flexShrink: 0 }}>VIDEOS ({cat.videos.length})</div>
              {cat.videos.map((v, i) => (
                <motion.button key={i} data-hover onClick={() => setActive(i)} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: active === i ? `${cat.color}18` : "rgba(255,255,255,0.03)", border: `1px solid ${active === i ? cat.color : "rgba(255,255,255,0.08)"}`, borderLeft: `3px solid ${active === i ? cat.color : "rgba(255,255,255,0.08)"}`, borderRadius: 3, padding: "10px 14px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s", flexShrink: 0 }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: active === i ? cat.color : "var(--muted)", flexShrink: 0, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: active === i ? "#fff" : "var(--muted)", fontWeight: active === i ? 700 : 400, lineHeight: 1.3 }}>{v.title}</span>
                  {active === i && <span style={{ marginLeft: "auto", color: cat.color, fontSize: "0.65rem", flexShrink: 0 }}>▶</span>}
                </motion.button>
              ))}
              <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
                {cat.tags.map(t => (
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", letterSpacing: "0.1em", color: cat.color, background: `${cat.color}12`, padding: "4px 10px", borderRadius: 2, border: `1px solid ${cat.color}25`, textTransform: "uppercase" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WorkCard = ({ cat: w, index, onOpen }) => {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={0.07 * index}>
      <motion.div data-hover onClick={() => onOpen(w)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.28 }}
        style={{ position: "relative", borderRadius: 4, overflow: "hidden", aspectRatio: "4/3", cursor: "pointer", background: w.thumb, border: `1px solid ${hov ? w.color : "var(--border)"}`, boxShadow: hov ? `0 20px 60px ${w.color}35` : "none", transition: "border 0.3s, box-shadow 0.3s" }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse at 40% 50%, ${w.color}28 0%, transparent 70%)`, opacity: hov ? 1 : 0.5, transition: "opacity 0.4s" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 5, fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.15em", color: w.color, background: "rgba(3,5,8,0.82)", padding: "5px 12px", borderRadius: 2, border: `1px solid ${w.color}35` }}>{w.videos.length} VIDEO{w.videos.length !== 1 ? "S" : ""}</div>
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 6, zIndex: 5 }}>
          {w.tags.map(t => (<span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", letterSpacing: "0.08em", color: w.color, background: "rgba(0,0,0,0.8)", padding: "3px 8px", borderRadius: 2, border: `1px solid ${w.color}40`, textTransform: "uppercase" }}>{t}</span>))}
        </div>
        <motion.div animate={{ scale: hov ? 1 : 0.55, opacity: hov ? 1 : 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", width: 68, height: 68, borderRadius: "50%", background: `${w.color}1a`, border: `1.5px solid ${w.color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 36px ${w.color}50`, zIndex: 10 }}
        >
          <div style={{ width: 0, height: 0, marginLeft: 7, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: `18px solid ${w.color}`, filter: `drop-shadow(0 0 8px ${w.color})` }} />
        </motion.div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(3,5,8,0.97))", padding: "60px 22px 22px", zIndex: 5 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 900, letterSpacing: "0.04em", color: "#fff", marginBottom: 6, textShadow: `0 0 30px ${w.color}50` }}>{w.cat}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", lineHeight: 1.5, color: "var(--muted)", display: hov ? "block" : "none", borderLeft: `2px solid ${w.color}`, paddingLeft: 10, marginTop: 4 }}>{w.desc}</div>
          {!hov && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.18em", color: `${w.color}80`, marginTop: 2 }}>CLICK TO OPEN →</div>}
        </div>
      </motion.div>
    </FadeIn>
  );
};

const PortfolioSection = () => {
  const [openCat, setOpenCat] = useState(null);
  return (
    <>
      <AnimatePresence>{openCat && <VideoModal cat={openCat} onClose={() => setOpenCat(null)} />}</AnimatePresence>
      <section id="portfolio" className="section-pad" style={{ padding: "130px 0", background: "var(--black)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,107,26,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,26,0.02) 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />
        <div className="section-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div className="portfolio-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
              <div>
                <SectionLabel num="04" label="PORTFOLIO" />
                <SectionTitle>SELECTED<br />WORKS</SectionTitle>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--muted)", marginBottom: 8 }}>CURRENT STATUS</div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", color: "var(--cyan)" }}>Video Editor | Motion Graphics Designer</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--orange)", marginTop: 4 }}>Full-Time @ Aatmia Digital</div>
              </div>
            </div>
          </FadeIn>
          <div className="portfolio-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {categories.map((c, i) => <WorkCard key={c.id} cat={c} index={i} onOpen={setOpenCat} />)}
          </div>
        </div>
      </section>
    </>
  );
};

/* ─────────────────────────────────────────
   SKILLS SECTION
───────────────────────────────────────── */
const skillsList = [
  { name: "Video Editing", level: 95, color: "#ff6b1a" },
  { name: "Motion Graphics", level: 92, color: "#00e5ff" },
  { name: "Color Grading", level: 90, color: "#9b4dff" },
  { name: "Reels / Short Content", level: 95, color: "#ffd166" },
  { name: "Ad Creative Editing", level: 85, color: "#00ff9f" },
  { name: "Sound Design", level: 85, color: "#ff6b9d" },
  { name: "VFX / Compositing", level: 75, color: "#80f4ff" },
  { name: "AI Workflow Tools", level: 85, color: "#ffaa5a" },
];
const keySkills = ["Video Editing", "Reels Editing", "Visual Effects", "Color Grading", "Storytelling", "Social Media Editing", "Motion Graphics", "Ad Creative Editor", "AI Tools for Editing", "Transitions", "Voice Over Editing", "Text Animation", "High-retention Edits", "Audio Mixing", "Time Management & Fast Delivery"];

const SkillBar = ({ s, index }) => {
  const [animated, setAnimated] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.6 }} onViewportEnter={() => setAnimated(true)} style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.95rem" }}>{s.name}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: s.color }}>{s.level}%</span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, position: "relative" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: animated ? `${s.level}%` : 0 }} transition={{ duration: 1.3, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${s.color}90, ${s.color})`, boxShadow: `0 0 8px ${s.color}50`, position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 9, height: 9, borderRadius: "50%", background: s.color, boxShadow: `0 0 14px ${s.color}` }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkillsSection = () => (
  <section id="skills" className="section-pad" style={{ padding: "130px 0", background: "var(--void)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -300, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />
    <div className="section-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
      <FadeIn>
        <SectionLabel num="03" label="SKILLS & TOOLS" />
        <div style={{ marginBottom: 70 }}><SectionTitle>MASTERY &<br />EXPERTISE</SectionTitle></div>
      </FadeIn>
      <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 90 }}>
        <div>{skillsList.map((s, i) => <SkillBar key={s.name} s={s} index={i} />)}</div>
        <FadeIn delay={0.2}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--muted)", marginBottom: 20 }}>KEY SKILLS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 44 }}>
              {keySkills.map((k, i) => (
                <motion.div key={k} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ borderColor: "var(--orange)", color: "#fff" }} className="glass"
                  style={{ padding: "6px 14px", borderRadius: 2, fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", color: "var(--muted)", transition: "all 0.25s" }}>{k}</motion.div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--muted)", marginBottom: 18 }}>TOOLS</div>
            <div className="tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 44 }}>
              {[{ name: "Premiere", icon: "Pr" }, { name: "After Fx", icon: "Ae" }, { name: "Photoshop", icon: "Ps" }, { name: "Illustrator", icon: "Ai" }, { name: "CapCut", icon: "Cc" }, { name: "Mocha Pro", icon: "Mo" }, { name: "AI Tools", icon: "AI" }, { name: "Audition", icon: "Au" }].map((t, i) => (
                <motion.div key={i} className="glass" whileHover={{ scale: 1.06, borderColor: "var(--cyan)" }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} style={{ padding: "16px 10px", borderRadius: 3, textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--cyan)", marginBottom: 5, textShadow: "0 0 14px rgba(0,229,255,0.35)" }}>{t.icon}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.06em", color: "var(--muted)" }}>{t.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   EDUCATION SECTION
───────────────────────────────────────── */
const educationList = [
  {
    period: "May 2024 – Feb 2025", degree: "Graphic Design Plus", field: "Video Editing & Graphic Design", institution: "Graphic Design Plus Institute",
    highlights: ["Specialized certification in professional video editing and post-production.", "Trained in Adobe Premiere Pro, After Effects, Photoshop, and Illustrator.", "Worked on real-world projects including ad creatives and motion graphics."],
    color: "#00e5ff", icon: "🎨"
  },
  {
    period: "May 2017 – Jan 2020", degree: "Diploma in Computer Science", field: "Computer & Science", institution: "Polytechnic College",
    highlights: ["Foundational training in computer science, programming, and digital systems.", "Built strong technical aptitude that supports digital media and software workflows.", "Graduated with a solid grounding in IT fundamentals."],
    color: "#ffd166", icon: "💻"
  }
];

const EducationSection = () => (
  <section id="education" className="section-pad" style={{ padding: "130px 0", background: "var(--void)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -200, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />
    <div className="section-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px", position: "relative", zIndex: 1 }}>
      <FadeIn>
        <SectionLabel num="03" label="EDUCATION" />
        <div style={{ marginBottom: 72 }}><SectionTitle>ACADEMIC<br />BACKGROUND</SectionTitle></div>
      </FadeIn>
      <div className="edu-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {educationList.map((edu, index) => (
          <FadeIn key={index} delay={0.15 * index}>
            <motion.div whileHover={{ y: -6, boxShadow: `0 24px 60px ${edu.color}18` }} transition={{ duration: 0.3 }} className="glass"
              style={{ padding: "40px", borderRadius: 6, border: `1px solid ${edu.color}30`, borderTop: `3px solid ${edu.color}`, height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ fontSize: "2.4rem", lineHeight: 1 }}>{edu.icon}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: edu.color, letterSpacing: "0.18em", fontWeight: 700, background: `${edu.color}12`, padding: "6px 14px", borderRadius: 2, border: `1px solid ${edu.color}30` }}>{edu.period}</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "0.04em", marginBottom: 6 }}>{edu.degree}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: edu.color, letterSpacing: "0.15em", marginBottom: 6, textTransform: "uppercase" }}>{edu.field}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 28, fontStyle: "italic" }}>{edu.institution}</div>
              <div style={{ height: 1, background: `linear-gradient(90deg, ${edu.color}40, transparent)`, marginBottom: 24 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {edu.highlights.map((h, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i + 0.2 * index }} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: edu.color, fontSize: "0.9rem", marginTop: 2, flexShrink: 0 }}>▸</span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text)", opacity: 0.82 }}>{h}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   EXPERIENCE SECTION
───────────────────────────────────────── */
const experienceList = [
  {
    period: "Mar 2025 – Present", role: "Video Editor & Motion Graphics Artist", company: "Aatmia Digital Marketing And Security Pvt. Ltd.",
    details: ["Specializing in high-retention digital ad creatives and social media content.", "Developing motion graphics and visual effects for diverse marketing campaigns.", "Optimizing video workflows for rapid delivery across multiple digital platforms."]
  },
  {
    period: "Sep 2024 – Jan 2025", role: "Trainee Video Editor", company: "Kannada Medium 24x7 News Channel",
    details: ["Intensive 5-month training in a live broadcast environment.", "Executing quick-turnaround edits for news segments and breaking content.", "Mastering audio synchronization and industry-standard broadcast editing tools."]
  }
];

const ExperienceSection = () => (
  <section id="experience" className="section-pad" style={{ padding: "130px 0", background: "var(--deep)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
    <div className="section-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px", position: "relative", zIndex: 1 }}>
      <FadeIn>
        <SectionLabel num="02" label="WORK HISTORY" />
        <div style={{ marginBottom: 72 }}><SectionTitle>PROFESSIONAL<br />JOURNEY</SectionTitle></div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 40 }}>
        {experienceList.map((e, index) => (
          <FadeIn key={index} delay={0.15 * index}>
            <div className="glass exp-card" style={{ padding: "40px", borderRadius: 4, borderLeft: "4px solid var(--orange)", display: "grid", gridTemplateColumns: "250px 1fr", gap: 40 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--orange)", marginBottom: 12, fontWeight: 700 }}>{e.period}</div>
                <div style={{ width: 40, height: 1, background: "rgba(255,107,26,0.3)", marginBottom: 12 }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{e.company}</div>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "1.6rem", color: "var(--cyan)", marginBottom: 20, letterSpacing: "0.02em" }}>{e.role}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {e.details.map((d, i) => (
                    <div key={i} style={{ display: "flex", gap: 14 }}>
                      <span style={{ color: "var(--orange)", fontSize: "1.1rem" }}>▹</span>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.6, color: "var(--text)", opacity: 0.85 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────── */
const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setForm({ name: "", email: "", project: "", message: "" });
    setTimeout(() => setSent(false), 3500);
  };

  const inp = (name) => ({
    width: "100%", background: focused === name ? "rgba(255,107,26,0.06)" : "var(--glass)",
    border: `1px solid ${focused === name ? "var(--orange)" : "var(--border)"}`,
    borderRadius: 2, padding: "15px 18px", fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--text)",
    outline: "none", transition: "all 0.3s", backdropFilter: "blur(12px)",
    boxShadow: focused === name ? "0 0 18px rgba(255,107,26,0.18)" : "none",
  });

  return (
    <section id="contact" className="section-pad" style={{ padding: "130px 0", background: "var(--deep)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -150, right: -150, width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,26,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div className="section-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px", position: "relative", zIndex: 1 }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 80 }}>
          <SectionLabel num="04" label="CONTACT" />
          <SectionTitle>LET'S BUILD<br />SOMETHING GREAT</SectionTitle>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", color: "var(--muted)", maxWidth: 480, margin: "18px auto 0", lineHeight: 1.7 }}>Looking for a video editor who delivers high-quality, deadline-driven content? Let's connect.</p>
        </FadeIn>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 72 }}>
          <FadeIn delay={0.1}>
            <div>
              {[{ icon: "✉", label: "EMAIL", val: "rownumdrag@gmail.com" }, { icon: "📞", label: "PHONE", val: "+91 9980724331" }, { icon: "📍", label: "LOCATION", val: "Bangalore, Karnataka, India" }].map(c => (
                <motion.div key={c.label} className="glass" whileHover={{ borderColor: "var(--orange)" }} style={{ padding: "20px 24px", borderRadius: 4, marginBottom: 14, display: "flex", gap: 18, alignItems: "center", transition: "border-color 0.3s" }}>
                  <span style={{ fontSize: "1.3rem" }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--orange)", fontWeight: 600 }}>{c.val}</div>
                  </div>
                </motion.div>
              ))}
              <div style={{ marginTop: 32 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.28em", color: "var(--muted)", marginBottom: 16 }}>INTERESTS</div>
                {["Video Editing & Content Creation", "Motion Graphics & Animation", "Exploring AI Tools & Creative Workflows"].map(it => (
                  <div key={it} style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text)", opacity: 0.7, paddingLeft: 14, borderLeft: "1px solid var(--orange)", marginBottom: 10, lineHeight: 1.5 }}>☆ {it}</div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="glass" style={{ padding: "44px", borderRadius: 4, border: "1px solid var(--border-o)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                {[["name", "Your name"], ["email", "your@email.com"]].map(([k, ph]) => (
                  <div key={k}>
                    <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.2em", color: "var(--muted)", display: "block", marginBottom: 9 }}>{k.toUpperCase()}</label>
                    <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} onFocus={() => setFocused(k)} onBlur={() => setFocused(null)} placeholder={ph} style={{ ...inp(k), cursor: "auto" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.2em", color: "var(--muted)", display: "block", marginBottom: 9 }}>PROJECT TYPE</label>
                <input value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} onFocus={() => setFocused("project")} onBlur={() => setFocused(null)} placeholder="Reels, Ad Creative, YouTube, Motion Graphics..." style={{ ...inp("project"), cursor: "auto" }} />
              </div>
              <div style={{ marginBottom: 30 }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.2em", color: "var(--muted)", display: "block", marginBottom: 9 }}>MESSAGE</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} placeholder="Tell me about your project vision..." rows={5} style={{ ...inp("message"), resize: "vertical", cursor: "auto" }} />
              </div>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", padding: 18, fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.28em", color: "var(--cyan)" }}>✓ MESSAGE SENT! I'LL REPLY WITHIN 24H</motion.div>
                ) : (
                  <motion.button key="btn" data-hover onClick={handleSend} whileHover={{ scale: 1.02, boxShadow: "0 0 38px rgba(255,107,26,0.45)" }} whileTap={{ scale: 0.98 }}
                    style={{ width: "100%", background: "linear-gradient(135deg, var(--orange), #ffaa00)", border: "none", padding: "17px", borderRadius: 2, fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.28em", color: "#000", fontWeight: 700, cursor: "pointer", boxShadow: "0 0 22px rgba(255,107,26,0.3)" }}
                  >SEND MESSAGE →</motion.button>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
const Footer = () => (
  <footer className="footer-root" style={{ padding: "36px 60px", background: "var(--black)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 900, letterSpacing: "0.2em" }}>
      <span style={{ color: "var(--cyan)" }}>PAVAN</span><span style={{ color: "var(--orange)" }}>S</span>
    </div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--muted)" }}>© 2025 PAVAN S · VIDEO EDITOR · BANGALORE, INDIA</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", color: "var(--muted)" }}>rownumdrag@gmail.com · +91 9980724331</div>
  </footer>
);

/* ─────────────────────────────────────────
   AMBIENT BACKGROUND
───────────────────────────────────────── */
const AmbientBg = () => {
  const ref = useRef(null);
  useEffect(() => {
    let raf, t = 0;
    const tick = () => {
      t += 0.0025;
      if (ref.current) ref.current.style.background = `
        radial-gradient(ellipse 550px 450px at ${50 + Math.sin(t) * 18}% ${28 + Math.cos(t * 0.7) * 14}%,
          rgba(255,107,26,0.045) 0%, transparent 60%),
        radial-gradient(ellipse 500px 400px at ${62 + Math.cos(t * 1.2) * 14}% ${72 + Math.sin(t * 0.85) * 14}%,
          rgba(0,229,255,0.035) 0%, transparent 60%)
      `;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, transition: "background 0.08s" }} />;
};

/* ─────────────────────────────────────────
   ACTIVE SECTION TRACKER
───────────────────────────────────────── */
const useActiveSection = () => {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const ids = ["hero", "about", "experience", "education", "portfolio", "skills", "contact"];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.38 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
};

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [ready, setReady] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const active = useActiveSection();

  useEffect(() => {
    const move = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <GlobalStyles />
      <CustomCursor />
      <AmbientBg />
      <LoadingScreen onComplete={() => setReady(true)} />
      <AnimatePresence>
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <Nav active={active} />
            <HeroSection mouse={mouse} />
            <AboutSection mouse={mouse} />
            <ExperienceSection />
            <EducationSection />
            <PortfolioSection />
            <SkillsSection />
            <ContactSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}