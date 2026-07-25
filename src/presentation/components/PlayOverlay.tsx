// src/presentation/components/PlayOverlay.tsx
import React, { useState } from "react";
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
    transition: "opacity 0.8s ease-in-out",
    overflow: "hidden",
    padding: "20px",
    ...((isHidden || isZippingUp) && {
      opacity: 0,
      pointerEvents: "none",
    }),
  }),
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

const TextCard = styled(Box)({
  backgroundColor: "rgba(68, 68, 70, 0.103)",
  border: "1px solid rgba(255, 255, 255, 0.046)",
  borderRadius: "24px",
  padding: "2.2rem 1.6rem",
  width: "90dvw",
  boxShadow:
    "0 20px 45px rgba(0, 0, 0, 0.071), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(2px)",
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
  // animation: "dateNumberGlitch 4s infinite alternate ease-in-out",

  "&:hover": {
    transform: "scale(1.02)",
    borderColor: "#00f0ff",
    boxShadow: "0 0 15px rgba(0, 240, 255, 0.3)",
    color: "#00f0ff",
    backgroundColor: "#000000",
  },
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

const TitleInv = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: 400,
  textTransform: "uppercase",
  color: "#ffffff",
  fontFamily: "'Permanent Marker', cursive",
  letterSpacing: "1px",
  marginTop: "4px",
  display: "block",
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
  const [isZippingUp, setIsZippingUp] = useState(false);

  const handleStart = () => {
    playThwip();
    setIsZippingUp(true); // triggers wrapper fade-out (opacity 0)
    onEnter(); // mounts/triggers invitation container scale pop-in immediately!

    // Wait for overlay opacity transition (800ms) to complete before unmounting it
    setTimeout(() => {
      setIsOverlayHidden(true);
    }, 800);
  };

  return (
    <OverlayWrapper isHidden={isOverlayHidden} isZippingUp={isZippingUp}>
      <LogoImg src="/spider-team.png" alt="Spider-Man Logo" />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          padding: "20px",
          pointerEvents: isZippingUp ? "none" : "auto",
        }}
      >
        <TextCard>
          <TitleInv>¡ESTÁS INVITADO A MI FIESTA ARÁCNIDA!</TitleInv>

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
    </OverlayWrapper>
  );
};
