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
  color: string;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    const drawWebs = () => {
      ctx.clearRect(0, 0, width, height);

      const webs: SpiderWeb[] = [
        {
          x: 0,
          y: 0,
          radius: 240,
          spokes: 9,
          rings: 6,
          rotation: 0,
          color: 'rgba(0, 240, 255, 0.42)', // cian glow
        },
        {
          x: width,
          y: height,
          radius: 280,
          spokes: 11,
          rings: 7,
          rotation: Math.PI,
          color: 'rgba(255, 28, 36, 0.42)', // red glow
        },
      ];

      const drawSingleWeb = (web: SpiderWeb) => {
        const traceSpokes = () => {
          for (let i = 0; i < web.spokes; i++) {
            const angle = (i * 2 * Math.PI) / web.spokes;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * web.radius, Math.sin(angle) * web.radius);
            ctx.stroke();
          }
        };

        const traceRings = () => {
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
                const prevAngle = ((i - 1) * 2 * Math.PI) / web.spokes;
                const midAngle = (angle + prevAngle) / 2;
                const midRadius = rCurrent * 0.92;
                const ctrlX = Math.cos(midAngle) * midRadius;
                const ctrlY = Math.sin(midAngle) * midRadius;
                ctx.quadraticCurveTo(ctrlX, ctrlY, xPos, yPos);
              }
            }
            ctx.stroke();
          }
        };

        ctx.save();
        ctx.translate(web.x, web.y);
        ctx.rotate(web.rotation);

        // Draw outer glow outline
        ctx.strokeStyle = web.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.45;
        traceSpokes();
        traceRings();

        // Draw sharp center line
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = 1.0;
        traceSpokes();
        traceRings();

        ctx.restore();
      };

      webs.forEach((web) => {
        drawSingleWeb(web);
      });
    };

    resize();
    drawWebs();

    let lastWidth = window.innerWidth;

    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        resize();
        drawWebs();
        lastWidth = window.innerWidth;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <WebCanvas ref={canvasRef} />;
};
