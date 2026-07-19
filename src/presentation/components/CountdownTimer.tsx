// src/presentation/components/CountdownTimer.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useCountdown } from '../hooks/useCountdown';

const CountdownBox = styled(Box)({
  border: '1px solid rgba(255, 255, 255, 0.09)',
  borderRadius: '20px',
  padding: '1.2rem',
  marginBottom: '20px',
  backgroundColor: 'rgba(16, 16, 22, 0.72)',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  textAlign: 'center',
  backdropFilter: 'blur(24px) saturate(120%)',
  WebkitBackdropFilter: 'blur(24px) saturate(120%)',
});

const HeaderText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 800,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: theme.palette.text.secondary,
  marginBottom: '8px',
}));

const GridContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
});

const TimerItem = styled(Box)({
  flex: 1,
  minWidth: '50px',
});

const NumberText = styled(Typography)({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#ffffff',
  lineHeight: 1,
});

const RedNumberText = styled(NumberText)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: '0 0 8px rgba(255, 28, 36, 0.4)',
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: '0.6rem',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <CountdownBox>
        <HeaderText style={{ color: '#ff1c24' }}>¡EL PORTAL SE HA ABIERTO!</HeaderText>
        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', textTransform: 'uppercase' }}>
          ¡La fiesta es hoy! 🕸️🎉
        </Typography>
      </CountdownBox>
    );
  }

  return (
    <CountdownBox>
      <HeaderText>Sincronización del Portal en:</HeaderText>
      <GridContainer>
        <TimerItem>
          <RedNumberText>{days}</RedNumberText>
          <LabelText>Días</LabelText>
        </TimerItem>
        <TimerItem>
          <NumberText>{hours}</NumberText>
          <LabelText>Horas</LabelText>
        </TimerItem>
        <TimerItem>
          <RedNumberText>{minutes}</RedNumberText>
          <LabelText>Mins</LabelText>
        </TimerItem>
        <TimerItem>
          <NumberText>{seconds}</NumberText>
          <LabelText>Segs</LabelText>
        </TimerItem>
      </GridContainer>
    </CountdownBox>
  );
};
