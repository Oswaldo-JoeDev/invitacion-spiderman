// src/presentation/components/BackgroundParticles.tsx
import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';

const WebCanvas = styled('canvas')({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 1, // behind card content (which is zIndex: 5)
  pointerEvents: 'none',
});

interface SpiderWeb {
  x: number;
  y: number;
  radius: number;
  spokes: number;
  rings: number;
  rotation: number;
  rotSpeed: number;
  color: string;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastWidth = window.innerWidth;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resize();

    const handleResize = () => {
      // Only trigger resize when horizontal viewport width changes,
      // ignoring address bar vertical scrolls on mobile.
      if (window.innerWidth !== lastWidth) {
        resize();
        lastWidth = window.innerWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    // Initialize 3 beautiful spider-webs at different viewport coordinates
    const webs: SpiderWeb[] = [
      {
        x: -20,
        y: 80,
        radius: 180,
        spokes: 8,
        rings: 5,
        rotation: 0,
        rotSpeed: 0.0003, // Slow rotate
        color: 'rgba(0, 240, 255, 0.22)', // cyan tint
      },
      {
        x: width + 20,
        y: height - 120,
        radius: 220,
        spokes: 10,
        rings: 6,
        rotation: Math.PI / 4,
        rotSpeed: -0.0002,
        color: 'rgba(255, 28, 36, 0.22)', // red tint
      },
      {
        x: width * 0.1,
        y: height * 0.5,
        radius: 130,
        spokes: 7,
        rings: 4,
        rotation: 1.2,
        rotSpeed: 0.0004,
        color: 'rgba(255, 255, 255, 0.16)', // white tint
      }
    ];

    const drawWeb = (web: SpiderWeb, pulse: number) => {
      ctx.save();
      ctx.translate(web.x, web.y);
      ctx.rotate(web.rotation);

      // Apply breathing global alpha pulse
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = web.color;
      ctx.lineWidth = 1.1;
      ctx.shadowBlur = 6 * pulse;  // pulsing glow radius
      ctx.shadowColor = web.color;

      // 1. Draw spoke lines
      for (let i = 0; i < web.spokes; i++) {
        const angle = (i * 2 * Math.PI) / web.spokes;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * web.radius, Math.sin(angle) * web.radius);
        ctx.stroke();
      }

      // 2. Draw polygon rings connecting spokes
      for (let r = 1; r <= web.rings; r++) {
        const rCurrent = (r / web.rings) * web.radius;
        ctx.beginPath();
        for (let i = 0; i <= web.spokes; i++) {
          const angle = (i * 2 * Math.PI) / web.spokes;
          const xPos = Math.cos(angle) * rCurrent;
          const yPos = Math.sin(angle) * rCurrent;
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            // Draw a slightly curved web segment (quad curve) for a natural spider web feel
            const prevAngle = ((i - 1) * 2 * Math.PI) / web.spokes;
            const midAngle = (angle + prevAngle) / 2;
            const midRadius = rCurrent * 0.92; // pull mid-point inwards to curve the web segment
            const ctrlX = Math.cos(midAngle) * midRadius;
            const ctrlY = Math.sin(midAngle) * midRadius;
            ctx.quadraticCurveTo(ctrlX, ctrlY, xPos, yPos);
          }
        }
        ctx.stroke();
      }

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth breath-like pulse factor (oscillates between 0.70 and 1.00 over ~5 seconds)
      const pulse = Math.sin(Date.now() * 0.0012) * 0.15 + 0.85;

      // Draw all webs
      webs.forEach((web) => {
        // Update rotation
        web.rotation += web.rotSpeed;
        
        // Dynamically adjust web positions on resize to keep them at corners
        if (web.x < 0 && web.y < 200) {
          web.x = -20;
        } else if (web.x > width - 100 && web.y > height - 300) {
          web.x = width + 20;
          web.y = height - 120;
        }

        drawWeb(web, pulse);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <WebCanvas ref={canvasRef} />;
};
