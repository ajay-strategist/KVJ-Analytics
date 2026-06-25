"use client";

import { useEffect, useRef } from "react";

/**
 * Dependency-free animated hero centerpiece: a slowly rotating 3D point-globe
 * (white points on transparent), evoking a data/analytics network. Gives the
 * dark hero a premium "3D animation" feel without Three.js. Pauses for
 * reduced-motion users.
 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Fibonacci-sphere point cloud
    const N = 720;
    const pts: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963229; // golden angle
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36;
      const cosA = Math.cos(t), sinA = Math.sin(t);
      const cosB = Math.cos(t * 0.42), sinB = Math.sin(t * 0.42);

      for (const p of pts) {
        let x = p.x * cosA - p.z * sinA;
        let z = p.x * sinA + p.z * cosA;
        const y = p.y * cosB - z * sinB;
        z = p.y * sinB + z * cosB;

        const persp = 1 / (2.1 - z);
        const sx = cx + x * R * persp * 1.7;
        const sy = cy + y * R * persp * 1.7;
        const depth = (z + 1) / 2; // 0..1
        const alpha = 0.18 + depth * 0.62;
        const size = 0.6 + depth * 1.7;

        ctx.beginPath();
        ctx.fillStyle = `rgba(123, 97, 255, ${alpha})`;
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) t += 0.0032;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full" aria-hidden />;
}
