// src/presentation/components/TicketPass.tsx
import React from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const TicketSectionTitle = styled(Typography)({
  textAlign: "center",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "1.5rem",
  textTransform: "uppercase",
  fontWeight: 800,
  margin: "32px 0 16px",
});

const TicketWrapperContainer = styled(Box)({
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "20px",
  padding: "1.6rem 1.25rem",
  backgroundColor: "rgba(16, 16, 22, 0.18)",
  boxShadow:
    "0 20px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  marginBottom: "20px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backdropFilter: "blur(6px) saturate(130%)",
  WebkitBackdropFilter: "blur(6px) saturate(130%)",
  "&::before, &::after": {
    content: "''",
    position: "absolute",
    top: "50%",
    width: "18px",
    height: "18px",
    backgroundColor: "#070709", // matches body background
    border: "1px solid rgba(255, 255, 255, 0.09)",
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

const TicketHeader = styled(Typography)(({ theme }) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.7rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: theme.palette.primary.main,
  marginBottom: "8px",
  textShadow: "0 0 5px rgba(255, 28, 36, 0.4)",
}));

const TicketContent = styled(Box)({
  textAlign: "center",
  borderTop: "1px dashed rgba(255, 255, 255, 0.08)",
  borderBottom: "1px dashed rgba(255, 255, 255, 0.08)",
  padding: "1.2rem 0",
  width: "100%",
});

const InfoTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  color: theme.palette.text.secondary,
  marginBottom: "6px",
}));

const SeatsBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 800,
  fontSize: "2rem",
  padding: "6px 20px",
  borderRadius: "10px",
  display: "inline-block",
  border: "1px solid #070709",
  boxShadow: "0 4px 10px rgba(255, 28, 36, 0.4)",
  marginBottom: "10px",
}));

const SeatsLabel = styled(Typography)({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.95rem",
  textTransform: "uppercase",
  fontWeight: 800,
  color: "#ffffff",
});

interface TicketPassProps {
  ticketsCount: number | null;
  showChildNote: boolean;
}

export const TicketPass: React.FC<TicketPassProps> = ({
  ticketsCount,
  showChildNote,
}) => {
  if (ticketsCount === null) return null;

  return (
    <Box>
      <TicketSectionTitle>Acceso Reservado</TicketSectionTitle>

      <TicketWrapperContainer>
        <TicketHeader>PASE DE ACCESO MULTIVERSAL</TicketHeader>

        <TicketContent>
          <InfoTitle>Pase Oficial de Invitado</InfoTitle>
          <SeatsBox>{ticketsCount}</SeatsBox>
          <SeatsLabel>Pases Reservados</SeatsLabel>
        </TicketContent>
        {showChildNote && (
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              color: "#ff1c24",
              textShadow: "0 0 10px rgba(255, 28, 36, 0.5)",
              mt: 2,
              textAlign: "center",
              display: "block",
              fontSize: "0.82rem",
              letterSpacing: "0.5px",
            }}
          >
            Niños menores de 3 años no requieren boleto.
          </Typography>
        )}
      </TicketWrapperContainer>
    </Box>
  );
};
