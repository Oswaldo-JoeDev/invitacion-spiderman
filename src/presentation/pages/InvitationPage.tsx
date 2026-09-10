// src/presentation/pages/InvitationPage.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPaperPlane,
  FaComment,
} from "react-icons/fa";

// Components
import { PlayOverlay } from "../components/PlayOverlay";
import { HeroBanner } from "../components/HeroBanner";
import { CountdownTimer } from "../components/CountdownTimer";
import { EventCoordinates } from "../components/EventCoordinates";
import { PolaroidGallery } from "../components/PolaroidGallery";
import { ItineraryTimeline } from "../components/ItineraryTimeline";
import { TicketPass } from "../components/TicketPass";
import { AudioController } from "../components/AudioController";
import { BackgroundParticles } from "../components/BackgroundParticles";
import { ScrollReveal } from "../components/ScrollReveal";
import { PrivacyBlurOverlay } from "../components/PrivacyBlurOverlay";

// Hooks
import { useAudio } from "../hooks/useAudio";

// Domain & Data (Clean Architecture Injection)
import { UrlParameterDataSource } from "../../data/datasources/UrlParameterDataSource";
import { AttendanceRepositoryImpl } from "../../data/repositories/AttendanceRepositoryImpl";
import { GetTickets } from "../../domain/usecases/GetTickets";
import { ShouldShowChildNote } from "../../domain/usecases/ShouldShowChildNote";
import { GetKidsMenuLimit } from "../../domain/usecases/GetKidsMenuLimit";

// Instantiations
const urlDataSource = new UrlParameterDataSource();
const attendanceRepo = new AttendanceRepositoryImpl(urlDataSource);
const getTicketsUseCase = new GetTickets(attendanceRepo);
const shouldShowChildNoteUseCase = new ShouldShowChildNote(attendanceRepo);
const getKidsMenuLimitUseCase = new GetKidsMenuLimit(attendanceRepo);

// Styled Components
const LandingContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "animateIn",
})<{ animateIn: boolean }>(({ animateIn }) => ({
  maxWidth: "460px", // High mobile priority screen container
  margin: "0 auto",
  padding: "0 14px 80px",
  position: "relative",
  zIndex: 5,
  transform: "scale(0.3) rotate(-15deg)",
  opacity: 0,
  transition:
    "transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease",
  ...(animateIn && {
    transform: "scale(1) rotate(0deg)",
    opacity: 1,
  }),
}));

const RsvpFormContainer = styled("form")({
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "24px",
  padding: "1.8rem 1.4rem",
  backgroundColor: "rgba(16, 16, 22, 0.18)",
  boxShadow:
    "0 20px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(6px) saturate(130%)",
  WebkitBackdropFilter: "blur(6px) saturate(130%)",
  width: "100%",
  marginTop: "25px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxSizing: "border-box",
  position: "relative",
  "&::before, &::after": {
    content: "''",
    position: "absolute",
    top: "50%",
    width: "18px",
    height: "18px",
    backgroundColor: "#070709", // matches body background
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "50%",
    zIndex: 3,
  },
  "&::before": {
    left: "-10px",
    transform: "translateY(-50%) rotate(45deg)",
  },
  "&::after": {
    right: "-10px",
    transform: "translateY(-50%) rotate(45deg)",
  },
});

const RsvpTitle = styled(Typography)({
  textAlign: "center",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "1.35rem",
  textTransform: "uppercase",
  fontWeight: 800,
  color: "#ffffff",
  letterSpacing: "1px",
});

const RsvpInput = styled("input")({
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "12px",
  padding: "14px 16px",
  color: "#ffffff",
  fontSize: "0.95rem",
  fontFamily: "'Outfit', sans-serif",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "all 0.25s ease",
  "&:focus": {
    borderColor: "#ff1c24",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    boxShadow: "0 0 12px rgba(255, 28, 36, 0.3)",
  },
});

const RsvpSelect = styled("select")({
  backgroundColor: "rgba(10, 10, 14, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "12px",
  padding: "14px 16px",
  color: "#ffffff",
  fontSize: "0.95rem",
  fontFamily: "'Outfit', sans-serif",
  outline: "none",
  width: "100%",
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "all 0.25s ease",
  "&:focus": {
    borderColor: "#ff1c24",
  },
});

const RsvpOptionsWrapper = styled(Box)({
  display: "flex",
  gap: "12px",
  width: "100%",
});

const RsvpOptionButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>(({ isSelected }) => ({
  flex: 1,
  padding: "14px 12px",
  borderRadius: "12px",
  border: `1.5px solid ${isSelected ? "#ff1c24" : "rgba(255, 255, 255, 0.15)"}`,
  backgroundColor: isSelected
    ? "rgba(255, 28, 36, 0.15)"
    : "rgba(255, 255, 255, 0.02)",
  textAlign: "center",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 700,
  fontFamily: "'Outfit', sans-serif",
  color: isSelected ? "#ff1c24" : "rgba(255, 255, 255, 0.7)",
  transition: "all 0.25s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
}));

const RsvpSubmitButton = styled("button")({
  backgroundColor: "#ff1c24",
  color: "#ffffff",
  border: "none",
  borderRadius: "50px",
  padding: "14px 24px",
  fontSize: "0.95rem",
  fontWeight: 800,
  fontFamily: "'Outfit', sans-serif",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(255, 28, 36, 0.25)",
  transition: "all 0.2s ease",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginTop: "8px",
  "&:hover": {
    backgroundColor: "#e6001a",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(255, 28, 36, 0.4)",
  },
  "&:disabled": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    color: "rgba(255, 255, 255, 0.35)",
    boxShadow: "none",
    cursor: "not-allowed",
  },
});

const SuccessContainer = styled(Box)({
  border: "1px solid rgba(0, 240, 255, 0.4)",
  borderRadius: "24px",
  padding: "2.2rem 1.4rem",
  backgroundColor: "rgba(10, 25, 30, 0.18)",
  boxShadow:
    "0 20px 45px rgba(0, 0, 0, 0.65), 0 0 15px rgba(0, 240, 255, 0.15)",
  backdropFilter: "blur(6px) saturate(130%)",
  WebkitBackdropFilter: "blur(6px) saturate(130%)",
  width: "100%",
  marginTop: "25px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
  position: "relative",
  "&::before, &::after": {
    content: "''",
    position: "absolute",
    top: "50%",
    width: "18px",
    height: "18px",
    backgroundColor: "#070709", // matches body background
    border: "1px solid rgba(0, 240, 255, 0.4)",
    borderRadius: "50%",
    zIndex: 3,
  },
  "&::before": {
    left: "-10px",
    transform: "translateY(-50%) rotate(45deg)",
  },
  "&::after": {
    right: "-10px",
    transform: "translateY(-50%) rotate(45deg)",
  },
});

const CustomDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    backgroundColor: "rgba(16, 16, 22, 0.95)",
    backgroundImage: "none",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "24px",
    boxShadow:
      "0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 28, 36, 0.2)",
    backdropFilter: "blur(20px)",
    padding: "1.5rem",
    maxWidth: "360px",
    width: "90%",
    color: "#ffffff",
  },
});

const DialogHeaderPin = styled("img")({
  width: "60px",
  height: "auto",
  display: "block",
  margin: "0 auto 16px",
  animation: "pulsePin 2s infinite ease-in-out",
  "@keyframes pulsePin": {
    "0%, 100%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.08)" },
  },
});

const DialogCancelButton = styled(Button)({
  color: "rgba(255, 255, 255, 0.7)",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 700,
  textTransform: "none",
  borderRadius: "50px",
  padding: "10px 18px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});

const DialogConfirmButton = styled(Button)({
  backgroundColor: "#ff1c24",
  color: "#ffffff",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 800,
  textTransform: "none",
  borderRadius: "50px",
  padding: "10px 22px",
  boxShadow: "0 4px 12px rgba(255, 28, 36, 0.2)",
  "&:hover": {
    backgroundColor: "#e6001a",
    boxShadow: "0 6px 16px rgba(255, 28, 36, 0.4)",
  },
});

const CardFooter = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginTop: "3rem",
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: "1.5rem",
}));

const SeparatorLine = styled(Box)({
  width: "80%",
  height: "1px",
  background:
    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
  margin: "22px auto",
  position: "relative",
  "&::after": {
    content: "''",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(45deg)",
    width: "6px",
    height: "6px",
    backgroundColor: "#ff1c24",
    boxShadow: "0 0 8px #ff1c24",
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
  fontSize: "1.4rem",
  fontWeight: 400,
  textTransform: "uppercase",
  color: "#ffffff",
  fontFamily: "'Permanent Marker', cursive",
  letterSpacing: "1px",
  marginTop: "4px",
  display: "block",
  animation: "dateNumberGlitch 4s infinite alternate ease-in-out",
});

const PinSeparatorContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "22px 0 10px",
});

const PinSeparatorImg = styled("img")({
  width: "52px",
  height: "auto",
  display: "block",
  filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))",
  animation:
    "pinBounce 1.6s infinite ease-in-out, multiverseGlitch 4.5s infinite alternate ease-in-out",
  "@keyframes pinBounce": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(8px)" },
  },
  "@keyframes multiverseGlitch": {
    "0%, 92%, 100%": {
      transform: "skewX(0deg) scale(1)",
      filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))",
    },
    "93%": {
      transform: "skewX(12deg) scaleY(1.1) translateX(-3px)",
      filter: "drop-shadow(-4px 0 0 #00f0ff) drop-shadow(4px 0 0 #ff007f)",
    },
    "94%": {
      transform: "skewX(-8deg) scaleY(0.9) translateX(3px)",
      filter: "drop-shadow(4px 0 0 #00f0ff) drop-shadow(-4px 0 0 #ff007f)",
    },
    "95%": {
      transform: "skewX(0deg) scale(1)",
      filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))",
    },
    "97%": {
      transform: "skewX(-4deg) scaleY(1.05) translateX(1px)",
      filter: "drop-shadow(-3px 0 0 #00f0ff) drop-shadow(3px 0 0 #ff007f)",
    },
    "98%": {
      transform: "skewX(6deg) scaleY(0.95) translateX(-1px)",
      filter: "drop-shadow(3px 0 0 #00f0ff) drop-shadow(-3px 0 0 #ff007f)",
    },
  },
});

const AUDIO_PLAYLIST = ["/sunflower.mp3", "/amidreaming.mp3"];

export const InvitationPage: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { isPlaying, toggleMusic, forcePlayMusic, playThwip, playHoverClick } =
    useAudio(AUDIO_PLAYLIST);

  const ticketsCount = getTicketsUseCase.execute();
  const kidsMenuLimit = getKidsMenuLimitUseCase.execute();

  const [nombre, setNombre] = useState("");
  const [asistencia, setAsistencia] = useState<"Sí" | "No">("Sí");
  const [boletosSelected, setBoletosSelected] = useState<number | "">("");
  const [kidsSelected, setKidsSelected] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Custom dialog state variables
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"Sí" | "No">("Sí");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (asistencia === "Sí" && !boletosSelected) {
      alert("Por favor selecciona la cantidad de boletos que utilizarás.");
      return;
    }

    setConfirmType(asistencia);
    setConfirmDialogOpen(true);
  };

  const executeSubmit = () => {
    setConfirmDialogOpen(false);
    setIsSubmitting(true);
    playThwip();

    const data = {
      "form-name": "rsvp",
      nombre: nombre,
      asistencia: confirmType,
      boletos: confirmType === "Sí" ? boletosSelected.toString() : "0",
      menuKids: confirmType === "Sí" ? kidsSelected.toString() : "0",
    };

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    })
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      })
      .catch((error) => {
        setIsSubmitting(false);
        alert("Ocurrió un error al enviar. Por favor vuelve a intentarlo.");
        console.error(error);
      });
  };

  const handleEnter = () => {
    setHasEntered(true);
    forcePlayMusic();
    setTimeout(() => {
      setAnimateIn(true);
    }, 80);
  };

  const itineraryData = [
    {
      time: "3:15 PM",
      title: "Ceremonia",
      description:
        "Agradecimiento religioso en la Iglesia San José de la Montaña.",
      icon: "church",
    },
    {
      time: "4:30 PM",
      title: "Recepción",
      description: "Bienvenidos al Jardín de Eventos Villa Los Arcos.",
      icon: "castle",
    },
    {
      time: "5:00 PM",
      title: "Comida",
      description:
        "Ningún héroe puede salvar el multiverso con el estómago vacío… ¡hora de recargar energías!.",
      icon: "food",
    },
    {
      time: "6:00 PM",
      title: "Sopresa",
      description: "¡Visita especial!",
      icon: "show",
    },

    {
      time: "7:00 PM",
      title: "Piñata",
      description: "A romper esa piñata.",
      icon: "bat",
    },
    {
      time: "7:30 PM",
      title: "Sorpresa",
      description: "¡Visita musical!",
      icon: "dance",
    },
    {
      time: "8:30 PM",
      title: "Baile",
      description: "Prepara para dar tus mejores pasos arácnidos.",
      icon: "dance",
    },
    {
      time: "11:00 PM Aprox",
      title: "Misión completada",
      description:
        "Gracias por acompañarme en esta gran aventura.",
      icon: "door",
    },
  ];

  const misaDetail = {
    name: "Ceremonia",
    time: "3:15 PM",
    address:
      "<strong>Iglesia San José de la Montaña</strong><br>Emilio Portes Gil 8, Benito Juárez (Tequex),<br>54020 Tlalnepantla, Méx.",
    googleMapsUrl:
      "https://maps.google.com/?q=Iglesia+San+José+de+la+Montaña+Emilio+Portes+Gil+8+Tlalnepantla",
  };

  const recepcionDetail = {
    name: "Recepción",
    time: "4:30 PM",
    address:
      '<strong>Jardín de Eventos "Villa Los Arcos"</strong><br>Av. de la Manzana 74, San Miguel Xochimanga,<br>52927 Ciudad López Mateos, Méx.',
    googleMapsUrl:
      "https://maps.google.com/?q=Jardín+De+Eventos+Villa+Los+Arcos+Av+de+la+Manzana+74+San+Miguel+Xochimanga",
  };

  return (
    <Box>
      {/* Privacy Protection Blur Overlay for app-switch / multitasking screenshot prevention */}
      <PrivacyBlurOverlay />

      {/* Splash overlay initial check - unmounts completely after entry to free VRAM/memory */}
      {!hasEntered && (
        <PlayOverlay onEnter={handleEnter} playThwip={playThwip} />
      )}

      {hasEntered && (
        <>
          <BackgroundParticles />
          <LandingContainer animateIn={animateIn}>
            <HeroBanner />

            <ScrollReveal>
              <SeparatorLine />
              <DateSection>
                <DateNumber>5</DateNumber>
                <DateMonth>Diciembre</DateMonth>
              </DateSection>
              <SeparatorLine />
            </ScrollReveal>

            <ScrollReveal>
              {/* Countdown timer */}
              <CountdownTimer targetDate="Dec 5, 2026 15:15:00" />
            </ScrollReveal>

            <ScrollReveal>
              <PinSeparatorContainer>
                <PinSeparatorImg src="/pin-miles.png" alt="Miles Morales Pin" />
              </PinSeparatorContainer>
            </ScrollReveal>

            <ScrollReveal>
              {/* Details (Misa & Recepcion) */}
              <EventCoordinates
                misa={misaDetail}
                recepcion={recepcionDetail}
                onHover={playHoverClick}
              />
            </ScrollReveal>

            <ScrollReveal>
              {/* Multiverse Polaroid Gallery */}
              <PolaroidGallery />
            </ScrollReveal>

            <ScrollReveal>
              {/* Itinerary */}
              <ItineraryTimeline
                items={itineraryData}
                onHover={playHoverClick}
              />
            </ScrollReveal>

            {/* Ticket passes and RSVP verification */}
            {ticketsCount !== null ? (
              <>
                <ScrollReveal>
                  <TicketPass
                    ticketsCount={ticketsCount}
                    showChildNote={shouldShowChildNoteUseCase.execute()}
                  />
                </ScrollReveal>

                {/* RSVP Form and Success Panel */}
                <ScrollReveal>
                  {isSubmitted ? (
                    <SuccessContainer
                      style={{
                        borderColor:
                          asistencia === "Sí"
                            ? "rgba(0, 240, 255, 0.4)"
                            : "rgba(255, 28, 36, 0.4)",
                      }}
                    >
                      {asistencia === "Sí" ? (
                        <>
                          <FaCheckCircle
                            style={{
                              fontSize: "3rem",
                              color: "#00f0ff",
                              marginBottom: "12px",
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 800,
                              color: "#00f0ff",
                              mb: 1,
                            }}
                          >
                            ¡ASISTENCIA REGISTRADA!
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              color: "rgba(255, 255, 255, 0.8)",
                              px: 1,
                            }}
                          >
                            Tu portal de acceso al multiverso ha sido asegurado.
                            ¡Nos vemos en la fiesta! 🕸️⚡
                          </Typography>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle
                            style={{
                              fontSize: "3rem",
                              color: "#ff1c24",
                              marginBottom: "12px",
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 800,
                              color: "#ff1c24",
                              mb: 1,
                            }}
                          >
                            INASISTENCIA REGISTRADA
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Outfit', sans-serif",
                              color: "rgba(255, 255, 255, 0.8)",
                              px: 1,
                              lineHeight: 1.6,
                            }}
                          >
                            Lamentamos que no nos puedas acompañar en esta
                            fecha, será para la próxima. ¡Saludos! 🕸️
                          </Typography>
                        </>
                      )}
                    </SuccessContainer>
                  ) : (
                    <RsvpFormContainer
                      name="rsvp"
                      onSubmit={handleFormSubmit}
                      data-netlify="true"
                      data-netlify-honeypot="bot-field"
                    >
                      {/* Honeypot field for netlify spambots */}
                      <input type="hidden" name="form-name" value="rsvp" />
                      <p style={{ display: "none" }}>
                        <label>
                          Don't fill this out if you're human:{" "}
                          <input name="bot-field" />
                        </label>
                      </p>

                      <RsvpTitle>Confirmar Asistencia</RsvpTitle>

                      {/* Dynamic ticket count status badge */}
                      <Box sx={{ textAlign: "center", my: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            color: "#ff1c24",
                            textShadow: "0 0 8px rgba(255, 28, 36, 0.35)",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {asistencia === "Sí"
                            ? `Boletos a confirmar: ${boletosSelected || "--"} de ${ticketsCount} autorizados`
                            : `Boletos a liberar: ${ticketsCount} espacios`}
                        </Typography>
                      </Box>

                      <RsvpInput
                        type="text"
                        name="nombre"
                        placeholder="Nombre de la familia o invitados"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />

                      <RsvpOptionsWrapper>
                        <RsvpOptionButton
                          isSelected={asistencia === "Sí"}
                          onClick={() => {
                            playHoverClick();
                            setAsistencia("Sí");
                          }}
                        >
                          <FaCheckCircle /> Sí asistiré
                        </RsvpOptionButton>
                        <RsvpOptionButton
                          isSelected={asistencia === "No"}
                          onClick={() => {
                            playHoverClick();
                            setAsistencia("No");
                          }}
                        >
                          <FaTimesCircle /> No podré ir
                        </RsvpOptionButton>
                      </RsvpOptionsWrapper>

                      {asistencia === "Sí" && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                                mb: 0.5,
                                display: "block",
                                fontFamily: "'Outfit', sans-serif",
                              }}
                            >
                              Número de boletos a confirmar:
                            </Typography>
                            <RsvpSelect
                              name="boletos"
                              value={boletosSelected}
                              onChange={(e) =>
                                setBoletosSelected(
                                  e.target.value === ""
                                    ? ""
                                    : parseInt(e.target.value, 10),
                                )
                              }
                              required
                            >
                              <option
                                value=""
                                style={{ backgroundColor: "#070709" }}
                              >
                                -- Seleccionar cantidad --
                              </option>
                              {/* Generate options up to ticketsCount (limit), or default to 5 if ticketsCount is not set */}
                              {Array.from(
                                { length: ticketsCount || 5 },
                                (_, i) => i + 1,
                              ).map((num) => (
                                <option
                                  key={num}
                                  value={num}
                                  style={{ backgroundColor: "#070709" }}
                                >
                                  {num} {num === 1 ? "boleto" : "boletos"}
                                </option>
                              ))}
                            </RsvpSelect>
                          </Box>

                          {kidsMenuLimit !== null && kidsMenuLimit > 0 && (
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.6)",
                                  mb: 0.5,
                                  display: "block",
                                  fontFamily: "'Outfit', sans-serif",
                                }}
                              >
                                Tendremos Menú kids (Hamburguesas con papas):
                              </Typography>
                              <RsvpSelect
                                name="menuKids"
                                value={kidsSelected}
                                onChange={(e) =>
                                  setKidsSelected(parseInt(e.target.value, 10))
                                }
                              >
                                {Array.from(
                                  { length: kidsMenuLimit + 1 },
                                  (_, i) => (
                                    <option
                                      key={i}
                                      value={i}
                                      style={{ backgroundColor: "#070709" }}
                                    >
                                      {i === 0
                                        ? "Ninguno"
                                        : `${i} ${i === 1 ? "pequeño arácnido" : "pequeños arácnidos"}`}
                                    </option>
                                  ),
                                )}
                              </RsvpSelect>
                            </Box>
                          )}
                        </Box>
                      )}

                      <RsvpSubmitButton
                        type="submit"
                        disabled={
                          isSubmitting ||
                          !nombre.trim() ||
                          (asistencia === "Sí" && !boletosSelected)
                        }
                      >
                        {isSubmitting ? (
                          "Enviando señal..."
                        ) : asistencia === "Sí" ? (
                          <>
                            <FaPaperPlane /> Confirmar Asistencia
                          </>
                        ) : (
                          <>
                            <FaPaperPlane /> Confirmar inasistencia
                          </>
                        )}
                      </RsvpSubmitButton>
                    </RsvpFormContainer>
                  )}
                </ScrollReveal>
              </>
            ) : (
              /* Contact Us alert if ticketsCount is not provided in URL */
              <ScrollReveal>
                <RsvpFormContainer
                  style={{ borderColor: "rgba(255, 28, 36, 0.45)" }}
                >
                  <FaTimesCircle
                    style={{
                      fontSize: "3rem",
                      color: "#ff1c24",
                      marginBottom: "12px",
                      alignSelf: "center",
                    }}
                  />
                  <RsvpTitle style={{ color: "#ff1c24" }}>
                    Pase no verificado
                  </RsvpTitle>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Outfit', sans-serif",
                      color: "rgba(255, 255, 255, 0.85)",
                      textAlign: "center",
                      lineHeight: 1.6,
                      px: 1,
                    }}
                  >
                    No hemos detectado la cantidad de pases asignados en este
                    enlace. Por favor, contáctanos directamente para verificar
                    tus boletos y confirmar tu asistencia. 🕸️
                  </Typography>
                  <RsvpSubmitButton
                    type="button"
                    onClick={() => {
                      playThwip();
                      window.open(
                        "https://wa.me/525565235192?text=" +
                          encodeURIComponent(
                            "¡Hola! Tengo una duda con mis boletos para la fiesta de Mateo Sebastian.",
                          ),
                        "_blank",
                      );
                    }}
                    style={{ marginTop: "10px" }}
                  >
                    <FaComment /> Contactar por WhatsApp
                  </RsvpSubmitButton>
                </RsvpFormContainer>
              </ScrollReveal>
            )}

            {/* Footer */}
            <CardFooter>
              <Typography variant="body2">
                ¡Te esperamos para compartir este gran día! 🕸️
              </Typography>
            </CardFooter>
          </LandingContainer>
        </>
      )}

      {/* Music Control headphones - rendered outside hasEntered, so it is always visible! */}
      <AudioController isPlaying={isPlaying} onToggle={toggleMusic} />

      {/* Custom Confirmation Dialog */}
      <CustomDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogContent sx={{ p: 0, textAlign: "center" }}>
          <DialogHeaderPin src="/pin-loader.png" alt="Spider-Man Pin Header" />

          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              mb: 2,
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            {confirmType === "Sí"
              ? "Confirmar Asistencia"
              : "Confirmar inasistencia"}
          </Typography>

          {confirmType === "Sí" ? (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  color: "rgba(255, 255, 255, 0.85)",
                  mb: 2,
                  px: 1,
                  lineHeight: 1.5,
                }}
              >
                ¿Estás seguro de confirmar tu asistencia arácnida con los
                siguientes datos?
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "12px",
                  p: 1.5,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    display: "block",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Invitado / Familia:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    mb: 1,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {nombre}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    display: "block",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Boletos a confirmar:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00f0ff",
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {boletosSelected}{" "}
                  {boletosSelected === 1 ? "boleto" : "boletos"}
                </Typography>
                {kidsMenuLimit !== null && kidsMenuLimit > 0 && (
                  <>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        display: "block",
                        mt: 1,
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Cantidad de Menús kids:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ff1c24",
                        fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {kidsSelected}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  color: "rgba(255, 255, 255, 0.85)",
                  mb: 2,
                  px: 1,
                  lineHeight: 1.6,
                }}
              >
                "Lamentamos que no puedas acompañarnos este día, sera para otra
                ocasion, saludos"
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "12px",
                  p: 1.5,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    display: "block",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Invitado / Familia:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {nombre}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 0, justifyContent: "space-between", gap: "12px" }}
        >
          <DialogCancelButton
            onClick={() => setConfirmDialogOpen(false)}
            fullWidth
          >
            Cancelar
          </DialogCancelButton>
          <DialogConfirmButton onClick={executeSubmit} fullWidth>
            Confirmar
          </DialogConfirmButton>
        </DialogActions>
      </CustomDialog>
    </Box>
  );
};
