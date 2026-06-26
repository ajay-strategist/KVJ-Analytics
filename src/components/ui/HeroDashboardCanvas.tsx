"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * HeroDashboardCanvas
 * A highly animated, premium WebGL-style 3D/holographic dashboard canvas.
 * Renders:
 * 1. An isometric grid and dashboard layout.
 * 2. A moving, multi-colored line chart (smooth gradients).
 * 3. An orange flashing neon Alert Point at the peak.
 * 4. A detaching email icon that flies with a motion trail to a virtual mailbox.
 */
export function HeroDashboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [latency, setLatency] = useState("0.12ms");

  useEffect(() => {
    // Latency fluctuation for realism
    const interval = setInterval(() => {
      setLatency((0.08 + Math.random() * 0.09).toFixed(2) + "ms");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Canvas size
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const width = 500;
    const height = 450;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Line Chart Data
    const pointCount = 20;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: 60 + (i * 340) / (pointCount - 1),
        y: 200,
      });
    }

    // Email animation state
    const email = {
      x: 0,
      y: 0,
      active: false,
      progress: 0,
      startX: 0,
      startY: 0,
      targetX: 430,
      targetY: 80,
      trail: [] as { x: number; y: number }[],
    };

    // Alert Status State
    let alertFlash = 0;
    let triggerAlert = false;
    let peakIndex = 12; // Index of the peak point

    const draw = () => {
      t += 0.04;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Holographic Base Projection and Shadow Glow
      ctx.save();
      ctx.shadowColor = "rgba(11, 31, 58, 0.08)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      // Rounded dashboard card container
      ctx.beginPath();
      ctx.roundRect(30, 40, 440, 360, 24);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(11, 31, 58, 0.08)";
      ctx.stroke();
      ctx.restore();

      // 2. Draw Dashboard Grid Lines (Light theme)
      ctx.strokeStyle = "rgba(11, 31, 58, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const y = 120 + i * 40;
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(440, y);
        ctx.stroke();
      }

      // 3. Update Chart Points (Simulate multi-colored active movement)
      points.forEach((p, idx) => {
        // Base sine wave modulation
        let wave = Math.sin(t + idx * 0.4) * 35;
        // Introduce a peak point that surge periodically to create an "Alert Status"
        if (idx === peakIndex) {
          const alertWave = Math.sin(t * 1.5) * 20;
          // When wave reaches a high point, trigger the alert
          p.y = 130 + alertWave;
          if (p.y < 125) {
            triggerAlert = true;
          } else if (p.y > 145 && !email.active) {
            triggerAlert = false;
          }
        } else {
          // Regular points fluctuation
          p.y = 240 + wave + Math.cos(t * 0.7 + idx) * 15;
        }
      });

      // 4. Draw Line Chart Segments with Multi-Colored Gradients
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // Create gradient segment
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        if (i < 8) {
          // Vibrant Cyan to Deep Navy
          grad.addColorStop(0, "#00B4D8");
          grad.addColorStop(1, "#0B1F3A");
        } else if (i >= 8 && i < 15) {
          // Deep Navy to Alert transition or Purple
          grad.addColorStop(0, "#0B1F3A");
          grad.addColorStop(1, triggerAlert ? "#FF6B00" : "#8B5CF6");
        } else {
          // Purple to Gold/Cyan
          grad.addColorStop(0, "#8B5CF6");
          grad.addColorStop(1, "#D4AF37");
        }

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw standard points
      points.forEach((p, idx) => {
        if (idx !== peakIndex) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? "#00B4D8" : "#8B5CF6";
          ctx.fill();
        }
      });

      // 5. Draw Flashing Glowing Neon-Orange Peak Point (Alert Status)
      const peak = points[peakIndex];
      alertFlash = (alertFlash + 0.1) % (Math.PI * 2);
      const flashOpacity = 0.5 + Math.sin(alertFlash * 3) * 0.5;

      ctx.save();
      // Outer glow ring
      ctx.shadowColor = "#FF6B00";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(peak.x, peak.y, 8 + Math.sin(alertFlash * 2) * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 107, 0, ${flashOpacity * 0.4})`;
      ctx.fill();

      // Core point
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(peak.x, peak.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#FF6B00";
      ctx.fill();
      ctx.restore();

      // Draw Virtual Off-Screen Mailbox Icon (target)
      ctx.save();
      ctx.translate(email.targetX, email.targetY);
      // Mailbox shadow
      ctx.shadowColor = "rgba(11, 31, 58, 0.1)";
      ctx.shadowBlur = 10;
      // Mailbox base
      ctx.fillStyle = "#0B1F3A";
      ctx.beginPath();
      ctx.roundRect(-20, -15, 40, 30, 6);
      ctx.fill();
      // Mailbox flag (Gold)
      ctx.fillStyle = "#D4AF37";
      ctx.fillRect(8, -25, 4, 12);
      ctx.beginPath();
      ctx.arc(10, -25, 3, 0, Math.PI * 2);
      ctx.fill();
      // Slot line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();
      ctx.restore();

      // 6. Fly Email Icon with Motion Trail
      if (triggerAlert && !email.active) {
        // Trigger the flight!
        email.active = true;
        email.progress = 0;
        email.startX = peak.x;
        email.startY = peak.y;
        email.x = peak.x;
        email.y = peak.y;
        email.trail = [];
      }

      if (email.active) {
        // Increment progress along bezier curve towards mailbox
        email.progress += 0.025;

        // Bezier control point for beautiful curved trajectory
        const cpX = (email.startX + email.targetX) / 2;
        const cpY = Math.min(email.startY, email.targetY) - 80;

        // Quadratic Bezier interpolation
        const u = 1 - email.progress;
        const tt = email.progress * email.progress;
        const uu = u * u;
        
        email.x = uu * email.startX + 2 * u * email.progress * cpX + tt * email.targetX;
        email.y = uu * email.startY + 2 * u * email.progress * cpY + tt * email.targetY;

        // Update trail
        email.trail.push({ x: email.x, y: email.y });
        if (email.trail.length > 8) {
          email.trail.shift();
        }

        // Draw Motion Trail
        email.trail.forEach((pos, index) => {
          const opacity = index / email.trail.length;
          const size = 1.5 + (index / email.trail.length) * 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 107, 0, ${opacity * 0.6})`;
          ctx.fill();
        });

        // Draw Stylized Flying Email Icon (Envelope shape)
        ctx.save();
        ctx.translate(email.x, email.y);
        ctx.shadowColor = "rgba(255, 107, 0, 0.4)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#FF6B00";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;

        // Draw envelope base
        ctx.beginPath();
        ctx.roundRect(-12, -8, 24, 16, 3);
        ctx.fill();
        ctx.stroke();

        // Draw envelope flap line
        ctx.beginPath();
        ctx.moveTo(-12, -8);
        ctx.lineTo(0, 1);
        ctx.lineTo(12, -8);
        ctx.stroke();
        ctx.restore();

        // Check if reached destination
        if (email.progress >= 1) {
          email.active = false;
          email.progress = 0;
          email.trail = [];
          triggerAlert = false; // Reset trigger
        }
      }

      // 7. Render Dashboard Labels & Mini Charts (Light Theme styled)
      ctx.fillStyle = "#0B1F3A";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("DECISION_FLOW_HUB", 54, 75);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "9px monospace";
      ctx.fillText("LIVE STREAM", 345, 74);

      // Latency counter
      ctx.fillStyle = "#22C55E";
      ctx.beginPath();
      ctx.arc(334, 71, 3, 0, Math.PI * 2);
      ctx.fill();

      // UI Frame bottom details
      ctx.fillStyle = "rgba(11, 31, 58, 0.05)";
      ctx.beginPath();
      ctx.roundRect(50, 325, 400, 50, 12);
      ctx.fill();

      ctx.fillStyle = "#0B1F3A";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("SYSTEM STATUS: OPTIMAL", 65, 354);

      ctx.fillStyle = "#475569";
      ctx.font = "9px monospace";
      ctx.fillText("LATENCY: " + latency, 350, 354);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [latency]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-square flex items-center justify-center select-none">
      {/* Holographic glowing background ring */}
      <div className="absolute inset-0 bg-[#00F0FF]/5 rounded-full blur-[80px] pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}
