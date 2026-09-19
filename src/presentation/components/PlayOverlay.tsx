// src/presentation/components/PlayOverlay.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Button, Typography, Box } from "@mui/material";
import { FaHandPointer } from "react-icons/fa";
import { BackgroundParticles } from "./BackgroundParticles";

// Team artwork's native aspect ratio (team.webp is 1264x2250)
const IMAGE_RATIO = 1264 / 2250;

const OverlayWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isHidden" && prop !== "isZippingUp",
})<{ isHidden: boolean; isZippingUp: boolean }>(
  ({ isHidden, isZippingUp }) => ({
    position: "fixed",
    inset: 0,
    // Subtle color glow instead of flat black, visible in the letterboxed
    // margins on wide/desktop screens (the spiderweb canvas draws on top)
    background:
      "radial-gradient(circle at 18% 22%, rgba(0, 240, 255, 0.12), transparent 45%), " +
      "radial-gradient(circle at 82% 78%, rgba(255, 28, 36, 0.12), transparent 45%), " +
      "#070709",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.8s ease-in-out",
    overflow: "hidden",
    ...((isHidden || isZippingUp) && {
      opacity: 0,
      pointerEvents: "none",
    }),
  }),
);

// Mobile: full-bleed, edge-to-edge (image crops via object-fit: cover).
// Desktop: locked to the artwork's own aspect ratio so it doesn't get
// stretched/zoomed to fill a wide screen — equivalent to object-fit: contain,
// but as a real box the text can be pinned to (never exceeds the image).
const StageBox = styled(Box)({
  position: "relative",
  zIndex: 2,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  "@media (min-width: 768px)": {
    width: `min(100vw, calc(100dvh * ${IMAGE_RATIO}))`,
    height: `min(100dvh, calc(100vw / ${IMAGE_RATIO}))`,
  },
});

const LogoImg = styled("img")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center center",
  zIndex: 1,
  pointerEvents: "none",
});

// Light scrim overall + a bit stronger at the very top/bottom edges so the
// kicker line and the name/age block stay readable. The artwork (and the
// circular button sitting over it) stays fully visible in the middle.
const VignetteOverlay = styled(Box)({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(7, 7, 9, 0.7) 0%, rgba(7, 7, 9, 0.15) 16%, transparent 30%, transparent 62%, rgba(7, 7, 9, 0.55) 82%, rgba(7, 7, 9, 0.92) 100%)",
  zIndex: 2,
  pointerEvents: "none",
});

// Small kicker line pinned to the top
const TopContent = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 3,
  display: "flex",
  justifyContent: "center",
  padding: "18px 20px 0",
});

// Name + age pinned to the bottom
const BottomContent = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 20px 28px",
});

// Dead-center over the artwork — free to sit on top of the characters
const CenterContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "14px",
});

// Palette lifted from team.webp: deep city-night blue, with the red of the
// spider emblem as a thin accent and a faint cyan skyline glow at rest.
const CircleButton = styled(Button)({
  width: "clamp(76px, 20vw, 96px)",
  height: "clamp(76px, 20vw, 96px)",
  minWidth: 0,
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 35% 30%, rgba(28, 43, 69, 0.55) 0%, rgba(13, 20, 32, 0.55) 65%, rgba(7, 9, 15, 0.55) 100%)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1.5px solid rgba(255, 45, 60, 0.5)",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  boxShadow:
    "0 6px 18px rgba(0, 0, 0, 0.55), 0 0 14px rgba(0, 240, 255, 0.18), inset 0 0 10px rgba(0, 240, 255, 0.08)",
  transition: "all 0.25s ease",

  "&:hover": {
    borderColor: "rgba(255, 45, 60, 0.85)",
    boxShadow:
      "0 6px 18px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 28, 36, 0.35), inset 0 0 10px rgba(0, 240, 255, 0.12)",
    transform: "scale(1.05)",
  },
});

const TapIcon = styled(FaHandPointer)({
  fontSize: "1.15rem",
});

const CircleLabel = styled(Typography)({
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 800,
  fontSize: "0.8rem",
  letterSpacing: "1px",
  textTransform: "uppercase",
});

const HintText = styled(Typography)({
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.75rem",
  color: "rgba(255, 255, 255, 0.75)",
  textAlign: "center",
  letterSpacing: "0.3px",
  textShadow: "0 2px 6px rgba(0, 0, 0, 0.8)",
});

const DateSection = styled(Box)({
  textAlign: "center",
  padding: "4px 0 0",
  fontFamily: "'Space Grotesk', sans-serif",
  display: "flex",
  alignItems: "baseline",
  justifyContent: "center",
  gap: "10px",
});

const DateNumber = styled(Typography)({
  fontSize: "3.8rem",
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
  fontSize: "1.5rem",
  fontWeight: 400,
  textTransform: "uppercase",
  color: "#ffffff",
  fontFamily: "'Permanent Marker', cursive",
  letterSpacing: "1px",
  display: "block",
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",
});

const TitleInv = styled(Typography)({
  fontSize: "1.1rem",
  fontWeight: 400,
  textTransform: "uppercase",
  color: "#ffffff",
  fontFamily: "'Permanent Marker', cursive",
  letterSpacing: "1px",
  display: "block",
  textAlign: "center",
  textShadow: "0 0 10px rgba(255, 69, 32, 0.7), 0 0 20px rgba(255, 28, 36, 0.4)",
});

const MateoNameImg = styled("img")({
  width: "94%",
  maxWidth: "380px",
  height: "auto",
  margin: "8px auto 0",
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
      {/* Only visible in the letterboxed margins on wide/desktop screens,
          since StageBox otherwise fills the viewport edge-to-edge */}
      <BackgroundParticles />

      <StageBox>
        <LogoImg src="/team.webp" alt="Spider-Man, Miles Morales y Spider-Gwen" />
        <VignetteOverlay />

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: isZippingUp ? "none" : "auto",
          }}
        >
          {/* Kicker line pinned to the top */}
          <TopContent>
            <TitleInv>¡ESTÁS INVITADO A MI FIESTA ARÁCNIDA!</TitleInv>
          </TopContent>

          {/* Circular CTA, free to sit over the artwork/characters */}
          <CenterContent>
            <CircleButton onClick={handleStart}>
              <TapIcon />
              <CircleLabel>Abrir</CircleLabel>
            </CircleButton>
            <HintText>Activa el sonido para la experiencia completa</HintText>
          </CenterContent>

          {/* Name + age pinned to the bottom */}
          <BottomContent>
            <MateoNameImg src="/mateo_name.png" alt="Mateo Sebastian Name" />
            <DateSection>
              <DateNumber>3</DateNumber>
              <DateMonth>AÑOS</DateMonth>
            </DateSection>
          </BottomContent>
        </Box>
      </StageBox>
    </OverlayWrapper>
  );
};

