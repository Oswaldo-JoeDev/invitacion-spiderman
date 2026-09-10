// src/presentation/components/PrivacyBlurOverlay.tsx
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { FaLock } from "react-icons/fa";

const BlurWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isBlurred",
})<{ isBlurred: boolean }>(({ isBlurred }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 99999, // Highest priority overlay
  backgroundColor: "rgba(7, 7, 9, 0.94)",
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  opacity: isBlurred ? 1 : 0,
  pointerEvents: isBlurred ? "auto" : "none",
  transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
}));

const CardContent = styled(Box)({
  backgroundColor: "rgba(20, 20, 28, 0.75)",
  border: "1px solid rgba(255, 28, 36, 0.4)",
  borderRadius: "24px",
  padding: "2.2rem 1.6rem",
  maxWidth: "340px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 28, 36, 0.3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
});

const LockIconWrapper = styled(Box)({
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 28, 36, 0.15)",
  border: "1.5px solid #ff1c24",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ff1c24",
  fontSize: "1.8rem",
  boxShadow: "0 0 15px rgba(255, 28, 36, 0.4)",
  animation: "pulseLock 2s infinite ease-in-out",
  "@keyframes pulseLock": {
    "0%, 100%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.08)" },
  },
});

const TitleText = styled(Typography)({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#ffffff",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginTop: "4px",
});

const SubtitleText = styled(Typography)({
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "1.2rem",
  color: "#ff1c24",
  textShadow: "0 0 10px rgba(255, 28, 36, 0.5)",
});

const HelperText = styled(Typography)({
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.88rem",
  color: "rgba(255, 255, 255, 0.7)",
  lineHeight: 1.4,
});

export const PrivacyBlurOverlay: React.FC = () => {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <BlurWrapper isBlurred={isBlurred}>
      <CardContent>
        <LockIconWrapper>
          <FaLock />
        </LockIconWrapper>

        <TitleText>Modo Privado Protegido</TitleText>

        <SubtitleText>Mateo Sebastián • 3 Años</SubtitleText>

        <HelperText>
          Regresa a la aplicación para continuar la experiencia del Multiverso.
        </HelperText>
      </CardContent>
    </BlurWrapper>
  );
};
