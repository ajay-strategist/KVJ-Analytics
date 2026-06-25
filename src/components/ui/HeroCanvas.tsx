"use client";

import { useEffect, useRef } from "react";

/**
 * A highly interactive, futuristic node network background using HTML5 Canvas.
 * Particles float dynamically, connect when close, and react to cursor movement
 * by drawing golden connector lines and responding to soft attraction forces.
 * Stylized in deep navy blue and glowing gold.
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

    // Node counts and properties
    const nodeCount = 90;
    const maxDistance = 110;
    const mouseRadius = 160;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      baseX: number;
      baseY: number;
    }

    const nodes: Node[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    // Initialize particles
    const initNodes = (width: number, height: number) => {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        // Random golden or navy/slate colored nodes
        const isGold = Math.random() > 0.4;
        const color = isGold ? "rgba(212, 175, 55, 0.8)" : "rgba(10, 17, 40, 0.4)";
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * (reduce ? 0.15 : 0.6),
          vy: (Math.random() - 0.5) * (reduce ? 0.15 : 0.6),
          radius: Math.random() * 2 + (isGold ? 1.5 : 1),
          color,
          baseX: x,
          baseY: y,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let raf = 0;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Move node
        if (!reduce) {
          n1.x += n1.vx;
          n1.y += n1.vy;

          // Bounce off edges
          if (n1.x < 0 || n1.x > w) n1.vx *= -1;
          if (n1.y < 0 || n1.y > h) n1.vy *= -1;

          // Soft correction to stay inside bounds
          if (n1.x < 0) n1.x = 0;
          if (n1.x > w) n1.x = w;
          if (n1.y < 0) n1.y = 0;
          if (n1.y > h) n1.y = h;
        }

        // Mouse attraction physics
        if (mouse.active) {
          const dx = mouse.x - n1.x;
          const dy = mouse.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            // Calculate pull force
            const force = (mouseRadius - dist) / mouseRadius;
            const pullX = (dx / dist) * force * 0.9;
            const pullY = (dy / dist) * force * 0.9;
            n1.x += pullX;
            n1.y += pullY;
          }
        }

        // Draw connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            // Draw in soft navy outline
            ctx.strokeStyle = `rgba(10, 17, 40, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }

        // Draw connection to mouse
        if (mouse.active) {
          const dx = mouse.x - n1.x;
          const dy = mouse.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const alpha = (1 - dist / mouseRadius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            // Draw glowing gold connection to cursor
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.fill();
        
        // Add subtle gold aura on gold nodes
        if (n1.color.includes("212") && !reduce) {
          ctx.beginPath();
          ctx.arc(n1.x, n1.y, n1.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(212, 175, 55, 0.08)";
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const cleanup = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };

    return cleanup;
  }, []);

  return <canvas ref={ref} className="w-full h-full block" aria-hidden />;
}
