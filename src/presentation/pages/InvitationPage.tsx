// src/presentation/pages/InvitationPage.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { FaComment } from "react-icons/fa";

// Components
import { PlayOverlay } from "../components/PlayOverlay";
import { HeroBanner } from "../components/HeroBanner";
import { CountdownTimer } from "../components/CountdownTimer";
import { EventCoordinates } from "../components/EventCoordinates";
import { ItineraryTimeline } from "../components/ItineraryTimeline";
import { TicketPass } from "../components/TicketPass";
import { AudioController } from "../components/AudioController";
import { BackgroundParticles } from "../components/BackgroundParticles";

// Hooks
import { useAudio } from "../hooks/useAudio";

// Domain & Data (Clean Architecture Injection)
import { UrlParameterDataSource } from "../../data/datasources/UrlParameterDataSource";
import { AttendanceRepositoryImpl } from "../../data/repositories/AttendanceRepositoryImpl";
import { GetTickets } from "../../domain/usecases/GetTickets";
import { ConfirmAttendance } from "../../domain/usecases/ConfirmAttendance";

// Instantiations
const urlDataSource = new UrlParameterDataSource();
const attendanceRepo = new AttendanceRepositoryImpl(urlDataSource);
const getTicketsUseCase = new GetTickets(attendanceRepo);
const confirmAttendanceUseCase = new ConfirmAttendance(attendanceRepo);

// Styled Components
const LandingContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "animateIn",
})<{ animateIn: boolean }>(({ animateIn }) => ({
  maxWidth: "460px", // High mobile priority screen container
  margin: "0 auto",
  padding: "0 14px 80px",
  position: "relative",
  zIndex: 5,
  transform: "translateY(-140px)",
  opacity: 0,
  transition:
    "transform 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease",
  ...(animateIn && {
    transform: "translateY(0)",
    opacity: 1,
  }),
}));

const RsvpButton = styled("a")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  width: "100%",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 800,
  fontSize: "0.95rem",
  padding: "14px 24px",
  borderRadius: "50px",
  textDecoration: "none",
  boxShadow: "0 6px 15px rgba(255, 28, 36, 0.25)",
  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(255, 28, 36, 0.4)",
    backgroundColor: "#e6001a",
  },
}));

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

export const InvitationPage: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { isPlaying, toggleMusic, forcePlayMusic, playThwip, playHoverClick } =
    useAudio("/sunflower.mp3");

  const ticketsCount = getTicketsUseCase.execute();
  const whatsAppUrl = confirmAttendanceUseCase.execute();

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
      title: "Comida Especial",
      description:
        "Disfrutamos de un banquete preparado para recargar energías arácnidas.",
      icon: "food",
    },
    {
      time: "6:00 PM",
      title: "Show & Piñata",
      description: "¡Visita especial de Mago y romper la piñata!",
      icon: "show",
    },

    {
      time: "7:00 PM",
      title: "Pastel y Mañanitas",
      description: "Cantamos el cumpleaños feliz para Mateo Sebastian.",
      icon: "cake",
    },
    {
      time: "8:00 PM",
      title: "Baile",
      description: "Prepara para dar tus mejores pasos arácnidos.",
      icon: "dance",
    },
    {
      time: "11:00 PM Aprox",
      title: "Cierre del Portal",
      description:
        "Agradecemos a todos por acompañarnos en esta gran aventura.",
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
      {/* Splash overlay initial check - unmounts completely after entry to free VRAM/memory */}
      {!hasEntered && (
        <PlayOverlay onEnter={handleEnter} playThwip={playThwip} />
      )}

      {hasEntered && (
        <>
          <BackgroundParticles />
          <LandingContainer animateIn={animateIn}>
            <HeroBanner />

            <SeparatorLine />

            <DateSection>
              <DateNumber>5</DateNumber>
              <DateMonth>Diciembre</DateMonth>
            </DateSection>

            <SeparatorLine />

            {/* Countdown timer */}
            <CountdownTimer targetDate="Dec 5, 2026 15:15:00" />

            <PinSeparatorContainer>
              <PinSeparatorImg src="/pin-miles.png" alt="Miles Morales Pin" />
            </PinSeparatorContainer>

            {/* Details (Misa & Recepcion) */}
            <EventCoordinates
              misa={misaDetail}
              recepcion={recepcionDetail}
              onHover={playHoverClick}
            />

            {/* Itinerary */}
            <ItineraryTimeline items={itineraryData} onHover={playHoverClick} />

            {/* Ticket passes */}
            <TicketPass ticketsCount={ticketsCount} />

            {/* WhatsApp RSVP */}
            <RsvpButton
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playThwip}
            >
              <FaComment /> Confirmar Asistencia por WhatsApp
            </RsvpButton>

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
    </Box>
  );
};
