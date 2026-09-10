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
    backgroundColor: "#070709",
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
  objectPosition: "center top",
  opacity: 0.72,
  zIndex: 1,
  pointerEvents: "none",
});

const VignetteOverlay = styled(Box)({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(23, 19, 41, 0.4) 0%, rgba(10, 8, 18, 0.65) 60%, rgba(7, 7, 9, 0.92) 100%)",
  zIndex: 2,
  pointerEvents: "none",
});

const TextCard = styled(Box)({
  backgroundColor: "rgba(18, 14, 30, 0.68)",
  border: "1.5px solid rgba(255, 69, 32, 0.45)",
  borderRadius: "24px",
  padding: "2.2rem 1.6rem",
  width: "90dvw",
  maxWidth: "400px",
  boxShadow:
    "0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 69, 32, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px) saturate(140%)",
  WebkitBackdropFilter: "blur(12px) saturate(140%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  zIndex: 3,
});

const StartButton = styled(Button)({
  backgroundColor: "#ff4520",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: "0.9rem",
  letterSpacing: "1px",
  padding: "14px 16px",
  borderRadius: "50px",
  border: "none",
  boxShadow: "0 6px 20px rgba(255, 69, 32, 0.55), 0 0 15px rgba(255, 28, 36, 0.3)",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1020,
  marginTop: "12px",

  "&:hover": {
    transform: "scale(1.03) translateY(-2px)",
    backgroundColor: "#e63512",
    boxShadow: "0 10px 25px rgba(255, 69, 32, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)",
    color: "#ffffff",
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
  color: "#ff4520",
  fontFamily: "'Bebas Neue', sans-serif",
  letterSpacing: "2px",
  textShadow: "0 0 12px rgba(255, 69, 32, 0.6)",
  display: "inline-block",
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",
  "@keyframes dateNumberGlitch": {
    "0%, 92%, 100%": {
      transform: "skewX(0deg) scale(1)",
      textShadow: "0 0 12px rgba(255, 69, 32, 0.6)",
    },
    "93%": {
      transform: "skewX(12deg) scaleY(1.1) translateX(-3px)",
      textShadow:
        "-4px 0 0 #00f0ff, 4px 0 0 #ff007f, 0 0 15px rgba(255, 69, 32, 0.8)",
    },
    "94%": {
      transform: "skewX(-8deg) scaleY(0.9) translateX(3px)",
      textShadow:
        "4px 0 0 #00f0ff, -4px 0 0 #ff007f, 0 0 15px rgba(255, 69, 32, 0.8)",
    },
    "95%": {
      transform: "skewX(0deg) scale(1)",
      textShadow: "0 0 12px rgba(255, 69, 32, 0.6)",
    },
    "97%": {
      transform: "skewX(-4deg) scaleY(1.05) translateX(1px)",
      textShadow:
        "-3px 0 0 #00f0ff, 3px 0 0 #ff007f, 0 0 15px rgba(255, 69, 32, 0.8)",
    },
    "98%": {
      transform: "skewX(6deg) scaleY(0.95) translateX(-1px)",
      textShadow:
        "3px 0 0 #00f0ff, -3px 0 0 #ff007f, 0 0 15px rgba(255, 69, 32, 0.8)",
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
  fontSize: "1.45rem",
  fontWeight: 400,
  textTransform: "uppercase",
  color: "#ffffff",
  fontFamily: "'Permanent Marker', cursive",
  letterSpacing: "1px",
  marginTop: "4px",
  display: "block",
  textAlign: "center",
  textShadow: "0 0 10px rgba(255, 69, 32, 0.7), 0 0 20px rgba(255, 28, 36, 0.4)",
});

const MateoNameImg = styled("img")({
  width: "100%",
  maxWidth: "280px",
  height: "auto",
  margin: "8px auto 14px",
  display: "block",
  filter: "drop-shadow(0 0 12px rgba(255, 69, 32, 0.6))",
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
      <LogoImg src="/fondo.primario.JPEG" alt="Spider-Man Multiverse Background" />
      <VignetteOverlay />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 3,
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

