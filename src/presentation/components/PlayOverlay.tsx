// src/presentation/components/PlayOverlay.tsx
import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Button, Typography, Box } from "@mui/material";

const OverlayWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isHidden" && prop !== "isZippingUp",
})<{ isHidden: boolean; isZippingUp: boolean }>(
  ({ isHidden, isZippingUp }) => ({
    position: "fixed",
    inset: 0,
    backgroundColor: "#000000",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition:
      "transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s ease",
    overflow: "hidden",
    padding: "20px",
    ...(isHidden && {
      transform: "translateY(-100%)",
      opacity: 0,
      pointerEvents: "none",
    }),
    ...(isZippingUp && {
      transform: "translateY(-100%)",
      opacity: 0.2,
      pointerEvents: "none",
      transition:
        "transform 0.75s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s ease",
    }),
  })
);

const LogoImg = styled("img")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.18, // heavily covered by black background!
  zIndex: 1,
  pointerEvents: "none",
});

const GlitchTitle = styled(Typography)({
  fontFamily: "'Space Grotesk', sans-serif",
  color: "#ffffff",
  fontSize: "1.3rem",
  fontWeight: 800,
  textTransform: "uppercase",
  textAlign: "center",
  margin: "1rem 0 0.5rem",
  position: "relative",
  letterSpacing: "-0.5px",
  maxWidth: "320px",
  textShadow: "-2px -2px 0 #00f0ff, 2px 2px 0 #ff007f",
  animation: "textGlitch 4s infinite alternate",
  "@keyframes textGlitch": {
    "0%, 100%": { textShadow: "-2px -2px 0 #00f0ff, 2px 2px 0 #ff007f" },
    "40%": { textShadow: "-2px -2px 0 #00f0ff, 2px 2px 0 #ff007f" },
    "42%": {
      textShadow: "3px -1px 0 #00f0ff, -3px 2px 0 #ff007f",
      transform: "skewX(-5deg)",
    },
    "44%": {
      textShadow: "-2px -2px 0 #00f0ff, 2px 2px 0 #ff007f",
      transform: "skewX(0)",
    },
    "75%": { textShadow: "-3px 2px 0 #00f0ff, 3px -2px 0 #ff007f" },
  },
});

const TextCard = styled(Box)({
  backgroundColor: "rgba(16, 16, 22, 0.103)",
  border: "1px solid rgba(255, 255, 255, 0.046)",
  borderRadius: "24px",
  padding: "2.2rem 1.6rem",
  width: "90dvw",
  boxShadow:
    "0 20px 45px ergba(0, 0, 0, 0.071), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(3px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  zIndex: 2,
});

const StartButton = styled(Button)({
  backgroundColor: "#000000",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "0.8rem",
  letterSpacing: "1px",
  padding: "12px 8px",
  border: "1px solid #ff1c2466",
  boxShadow: "0 0 12px #ff1c2466",
  transition: "all 0.25s ease",
  zIndex: 1020,
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",

  "&:hover": {
    transform: "scale(1.02)",
    borderColor: "#00f0ff",
    boxShadow: "0 0 15px rgba(0, 240, 255, 0.3)",
    color: "#00f0ff",
    backgroundColor: "#000000",
  },
});

const SpiderSenseContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "isZippingUp",
})<{ isActive: boolean; isZippingUp: boolean }>(
  ({ isActive, isZippingUp }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.5)",
    zIndex: 1010,
    pointerEvents: "none",
    opacity: 0,
    transition:
      "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
    width: "90%",
    maxWidth: "380px",
    ...(isActive && {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1.15)",
    }),
    ...(isZippingUp && {
      opacity: 0,
      transform: "translate(-50%, -180%) scale(0.8)", // zip upwards rapidly!
      transition:
        "transform 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19), opacity 0.4s ease",
    }),
  })
);

const SpiderSenseImg = styled("img")({
  width: "100%",
  height: "auto",
  display: "block",
  imageRendering: "auto",
});

const ShockwaveRing = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay: string }>(({ delay }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  border: '3px solid #ff1c24',
  pointerEvents: 'none',
  zIndex: 1,
  animation: 'senseRadiate 2.4s infinite cubic-bezier(0.1, 0.8, 0.3, 1)',
  animationDelay: delay,
  '@keyframes senseRadiate': {
    '0%': {
      width: '50px',
      height: '50px',
      opacity: 0.9,
      borderColor: '#ffeb3b',
      boxShadow: '0 0 20px #ffeb3b, inset 0 0 10px #ffeb3b',
    },
    '50%': {
      borderColor: '#ff1c24',
      boxShadow: '0 0 40px #ff1c24, inset 0 0 20px #ff1c24',
    },
    '100%': {
      width: '800px',
      height: '800px',
      opacity: 0,
      borderColor: 'rgba(255, 28, 36, 0)',
      boxShadow: '0 0 60px rgba(255, 28, 36, 0)',
    }
  }
}));

const WebCanvas = styled("canvas")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 1005,
  pointerEvents: "none",
});

const DateSection = styled(Box)({
  textAlign: "center",
  padding: "10px 0",
  fontFamily: "'Space Grotesk', sans-serif",
});

const DateNumber = styled(Typography)({
  fontSize: "5.2rem",
  fontWeight: 400,
  lineHeight: 0.9,
  color: "#ff1c24",
  fontFamily: "'Bebas Neue', sans-serif",
  letterSpacing: "2px",
  textShadow: "0 0 10px rgba(255, 28, 36, 0.4)",
  display: "inline-block",
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",
  "@keyframes dateNumberGlitch": {
    "0%, 92%, 100%": {
      transform: "skewX(0deg) scale(1)",
      textShadow: "0 0 10px rgba(255, 28, 36, 0.4)",
    },
    "93%": {
      transform: "skewX(12deg) scaleY(1.1) translateX(-3px)",
      textShadow:
        "-4px 0 0 #00f0ff, 4px 0 0 #ff007f, 0 0 15px rgba(255, 28, 36, 0.6)",
    },
    "94%": {
      transform: "skewX(-8deg) scaleY(0.9) translateX(3px)",
      textShadow:
        "4px 0 0 #00f0ff, -4px 0 0 #ff007f, 0 0 15px rgba(255, 28, 36, 0.6)",
    },
    "95%": {
      transform: "skewX(0deg) scale(1)",
      textShadow: "0 0 10px rgba(255, 28, 36, 0.4)",
    },
    "97%": {
      transform: "skewX(-4deg) scaleY(1.05) translateX(1px)",
      textShadow:
        "-3px 0 0 #00f0ff, 3px 0 0 #ff007f, 0 0 15px rgba(255, 28, 36, 0.6)",
    },
    "98%": {
      transform: "skewX(6deg) scaleY(0.95) translateX(-1px)",
      textShadow:
        "3px 0 0 #00f0ff, -3px 0 0 #ff007f, 0 0 15px rgba(255, 28, 36, 0.6)",
    },
  },
});

const DateMonth = styled(Typography)({
  fontSize: "2rem",
  fontWeight: 400,
  textTransform: "uppercase",
  color: "#ffffff",
  fontFamily: "'Permanent Marker', cursive",
  letterSpacing: "1px",
  marginTop: "4px",
  display: "block",
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",
});

const MateoNameImg = styled("img")({
  width: "100%",
  maxWidth: "280px",
  height: "auto",
  margin: "8px auto 14px",
  display: "block",
  filter: "drop-shadow(0 0 10px rgba(255, 28, 36, 0.45))",
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",
});

interface PlayOverlayProps {
  onEnter: () => void;
  playThwip: () => void;
}

export const PlayOverlay: React.FC<PlayOverlayProps> = ({
  onEnter,
  playThwip,
}) => {
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [isSpideyDropped, setIsSpideyDropped] = useState(false);
  const [isElementsHidden, setIsElementsHidden] = useState(false);
  const [isZippingUp, setIsZippingUp] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Process spidey sense image to remove white background
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 220 && g > 220 && b > 220) {
            data[i + 3] = 0; // set transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setProcessedImage(canvas.toDataURL());
      }
    };
    img.src = "/spidersense_miles.png";
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = () => {
    playThwip();
    setIsElementsHidden(true);
    setIsSpideyDropped(true);

    setTimeout(() => {
      // 1. Shoot web UPwards
      animateWeb(() => {
        // 2. Web hits the top! Play thwip sound and ZIP UP!
        playThwip();
        setIsZippingUp(true);

        // 3. After zip transition completes halfway, trigger main content entrance
        setTimeout(() => {
          setIsOverlayHidden(true);
          onEnter();
        }, 350);
      });
    }, 700);
  };

  // Draw spider web shooting straight UP to the top of the viewport
  const animateWeb = (callback: () => void) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      callback();
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      callback();
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    // Shoot from the top of Miles Morales mask (centered) straight up
    const startX = width / 2;
    const startY = height * 0.42; //approx where Miles' hand/head is
    const endX = width / 2;
    const endY = 0; // top of screen

    let progress = 0;
    const duration = 220; // fast web shot (ms)
    const startTime = performance.now();

    const drawWebFrame = (time: number) => {
      const elapsed = time - startTime;
      progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, width, height);

      // Main thick web line
      const currentY = startY + (endY - startY) * progress;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 4;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00f0ff";
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX, currentY);
      ctx.stroke();

      // Draw secondary web fibers splitting off to make it look like a real spider-web shot!
      if (progress > 0.2) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 1.5;

        // Fiber 1 (left)
        ctx.moveTo(startX, startY + (currentY - startY) * 0.4);
        ctx.lineTo(startX - 15, startY + (currentY - startY) * 0.6);

        // Fiber 2 (right)
        ctx.moveTo(startX, startY + (currentY - startY) * 0.6);
        ctx.lineTo(startX + 18, startY + (currentY - startY) * 0.85);

        ctx.stroke();
      }

      if (progress < 1) {
        requestAnimationFrame(drawWebFrame);
      } else {
        // Simple flashing effect at the top anchor point
        ctx.beginPath();
        ctx.arc(endX, endY, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#00f0ff";
        ctx.fill();

        setTimeout(callback, 120);
      }
    };

    requestAnimationFrame(drawWebFrame);
  };

  return (
    <OverlayWrapper isHidden={isOverlayHidden} isZippingUp={isZippingUp}>
      <LogoImg
        src="/spider-team.jpg"
        alt="Spider-Man Logo"
        style={{ display: isElementsHidden ? "none" : "block" }}
      />

      <Box
        sx={{
          display: isElementsHidden ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          padding: "20px",
        }}
      >
        <TextCard>
          <GlitchTitle data-text="¡ESTÁS INVITADO A MI FIESTA ARÁCNIDA!">
            ¡ESTÁS INVITADO A MI FIESTA ARÁCNIDA!
          </GlitchTitle>

          <DateSection>
            <MateoNameImg src="/mateo_name.png" alt="Mateo Sebastian Name" />
            <DateNumber>3</DateNumber>
            <DateMonth>AÑOS</DateMonth>
          </DateSection>

          <StartButton onClick={handleStart} fullWidth>
            INGRESAR AL MULTIVERSO 🕸️
          </StartButton>
        </TextCard>
      </Box>

      <WebCanvas ref={canvasRef} />

      <SpiderSenseContainer
        isActive={isSpideyDropped}
        isZippingUp={isZippingUp}
      >
        {isSpideyDropped && (
          <>
            <ShockwaveRing delay="0s" />
            <ShockwaveRing delay="0.8s" />
            <ShockwaveRing delay="1.6s" />
          </>
        )}
        <SpiderSenseImg
          src={processedImage || "/spidersense_miles.png"}
          alt="Spider-Sense Miles"
          style={{ position: 'relative', zIndex: 2 }}
        />
      </SpiderSenseContainer>
    </OverlayWrapper>
  );
};
