// src/presentation/components/EventCoordinates.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { LocationDetail } from '../../domain/entities/EventDetails';

const CoordinatesTitle = styled(Typography)({
  textAlign: 'center',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '1.5rem',
  textTransform: 'uppercase',
  fontWeight: 800,
  margin: '32px 0 16px',
});

const GridContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '20px',
});

const DetailCard = styled(Box)({
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '20px',
  padding: '1.4rem',
  backgroundColor: 'rgba(16, 16, 22, 0.18)',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  backdropFilter: 'blur(6px) saturate(130%)',
  WebkitBackdropFilter: 'blur(6px) saturate(130%)',
  '&:hover': {
    borderColor: 'rgba(255, 28, 36, 0.35)',
    boxShadow: '0 0 20px rgba(255, 28, 36, 0.1)',
  },
});

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
});

const PinIconImg = styled('img')({
  width: '30px',
  height: 'auto',
  display: 'block',
  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  animation: 'pinFloat 2.5s infinite ease-in-out',
  '@keyframes pinFloat': {
    '0%, 100%': {
      transform: 'translateY(0) scale(1)',
    },
    '50%': {
      transform: 'translateY(-6px) scale(1.05)',
    },
  },
  '&:hover': {
    animationPlayState: 'paused',
    transform: 'scale(1.25) rotate(15deg) translateY(-8px)',
  },
});

const TimeText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.primary.main,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '4px',
}));

const AddressText = styled(Typography)(({ theme }) => ({
  fontSize: '0.88rem',
  color: theme.palette.text.secondary,
  marginBottom: '14px',
  flexGrow: 1,
}));

const MapsLink = styled('a')(({ theme }) => ({
  alignSelf: 'flex-start',
  backgroundColor: 'transparent',
  border: `1.5px solid rgba(255, 255, 255, 0.15)`,
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  padding: '8px 18px',
  borderRadius: '30px',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: "'Outfit', sans-serif",
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255, 28, 36, 0.05)',
  },
}));

interface EventCoordinatesProps {
  misa: LocationDetail;
  recepcion: LocationDetail;
  onHover: () => void;
}

export const EventCoordinates: React.FC<EventCoordinatesProps> = ({ misa, recepcion, onHover }) => {
  return (
    <Box>
      <CoordinatesTitle>Coordenadas del Encuentro</CoordinatesTitle>
      
      <GridContainer>
        {/* Misa */}
        <DetailCard onMouseEnter={onHover}>
          <CardHeader>
            <PinIconImg src="/pin-gwen.png" alt="Gwen Pin" />
            <Typography variant="subtitle1" sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800 }}>
              {misa.name}
            </Typography>
          </CardHeader>
          <TimeText>{misa.time}</TimeText>
          <AddressText dangerouslySetInnerHTML={{ __html: misa.address }} />
          <MapsLink 
            href={misa.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaMapMarkerAlt /> Ver Ubicación
          </MapsLink>
        </DetailCard>

        {/* Recepción */}
        <DetailCard onMouseEnter={onHover}>
          <CardHeader>
            <PinIconImg src="/pin-piter.png" alt="Peter Pin" />
            <Typography variant="subtitle1" sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800 }}>
              {recepcion.name}
            </Typography>
          </CardHeader>
          <TimeText>{recepcion.time}</TimeText>
          <AddressText dangerouslySetInnerHTML={{ __html: recepcion.address }} />
          <MapsLink 
            href={recepcion.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaMapMarkerAlt /> Ver Ubicación
          </MapsLink>
        </DetailCard>
      </GridContainer>
    </Box>
  );
};
