// src/presentation/components/ItineraryTimeline.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { FaChurch, FaFortAwesome, FaUtensils, FaStar, FaBirthdayCake, FaDoorOpen } from 'react-icons/fa';
import { ItineraryItem } from '../../domain/entities/EventDetails';
import { GiBaton } from 'react-icons/gi';

const ItineraryCard = styled(Box)({
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '24px',
  padding: '1.8rem 1.25rem',
  backgroundColor: 'rgba(16, 16, 22, 0.45)',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  marginBottom: '20px',
  backdropFilter: 'blur(30px) saturate(130%)',
  WebkitBackdropFilter: 'blur(30px) saturate(130%)',
});

const ItineraryTitle = styled(Typography)({
  textAlign: 'center',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '1.5rem',
  textTransform: 'uppercase',
  fontWeight: 800,
  margin: '10px 0 20px',
});

const TimelineWrapper = styled(Box)({
  position: 'relative',
  paddingLeft: '32px',
});

const TimelineAxis = styled(Box)({
  position: 'absolute',
  left: '12px',
  top: '10px',
  bottom: '10px',
  width: '2px',
  background: 'repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 0px, rgba(255, 255, 255, 0.12) 8px, transparent 8px, transparent 14px)',
});

const TimelineItem = styled(Box)({
  position: 'relative',
  marginBottom: '1.4rem',
  '&:last-child': {
    marginBottom: 0,
  },
});

const TimelineBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '-28px',
  top: '2px',
  width: '26px',
  height: '26px',
  backgroundColor: theme.palette.background.default,
  border: `1.5px solid rgba(255, 255, 255, 0.2)`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.85rem',
  zIndex: 2,
  transition: 'all 0.3s ease',
  color: theme.palette.text.primary,
}));

const TimelineContent = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  borderRadius: '16px',
  padding: '0.8rem 1rem',
});

const TimeText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  display: 'block',
}));

const HeadingText = styled(Typography)({
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: '1rem',
  color: '#ffffff',
  marginBottom: '1px',
});

const DescText = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
}));

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  onHover: () => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ items, onHover }) => {
  // Map icons to react-icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'church': return <FaChurch />;
      case 'castle': return <FaFortAwesome />;
      case 'food': return <FaUtensils />;
      case 'show': return <FaStar />;
      case 'bat': return <GiBaton />;
      case 'cake': return <FaBirthdayCake />;
      case 'door': return <FaDoorOpen />;
      default: return <FaStar />;
    }
  };

  return (
    <ItineraryCard>
      <ItineraryTitle>Itinerario del Evento</ItineraryTitle>
      
      <TimelineWrapper>
        <TimelineAxis />
        {items.map((item, idx) => (
          <TimelineItem key={idx} onMouseEnter={onHover}>
            <TimelineBadge className="itinerary-badge">
              {getIcon(item.icon)}
            </TimelineBadge>
            <TimelineContent>
              <TimeText>{item.time}</TimeText>
              <HeadingText>{item.title}</HeadingText>
              <DescText>{item.description}</DescText>
            </TimelineContent>
          </TimelineItem>
        ))}
      </TimelineWrapper>
    </ItineraryCard>
  );
};
