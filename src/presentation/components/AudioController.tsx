// src/presentation/components/AudioController.tsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const ToggleContainer = styled(Box)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 100,
});

const MusicBtn = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isPlaying',
})<{ isPlaying: boolean }>(({ theme, isPlaying }) => ({
  background: 'rgba(16, 16, 22, 0.9)',
  border: `1.5px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  cursor: 'pointer',
  boxShadow: '0 6px 15px rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: `0 0 10px ${theme.palette.primary.main}44`,
  },
  ...(isPlaying && {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(255, 28, 36, 0.05)',
  }),
}));

const HeadphonesSvg = styled('svg', {
  shouldForwardProp: (prop) => prop !== 'isPlaying',
})<{ isPlaying: boolean }>(({ theme, isPlaying }) => ({
  width: '22px',
  height: '22px',
  fill: '#ffffff',
  transition: 'fill 0.3s ease, transform 0.3s ease',
  ...(isPlaying && {
    fill: theme.palette.primary.main,
    filter: `drop-shadow(0 0 5px ${theme.palette.primary.main}66)`,
    animation: 'headphoneDance 1.2s infinite ease-in-out',
  }),
  '@keyframes headphoneDance': {
    '0%': { transform: 'scale(1) rotate(0)' },
    '25%': { transform: 'scale(1.08) rotate(-8deg)' },
    '50%': { transform: 'scale(1) rotate(0)' },
    '75%': { transform: 'scale(1.08) rotate(8deg)' },
    '100%': { transform: 'scale(1) rotate(0)' },
  },
}));

interface AudioControllerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioController: React.FC<AudioControllerProps> = ({ isPlaying, onToggle }) => {
  return (
    <ToggleContainer>
      <MusicBtn isPlaying={isPlaying} onClick={onToggle} aria-label="Activar/Pausar Música">
        <HeadphonesSvg 
          isPlaying={isPlaying} 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12v5c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-3v8h3c1.66 0 3-1.34 3-3v-5c0-5.52-4.48-10-10-10z"/>
        </HeadphonesSvg>
      </MusicBtn>
    </ToggleContainer>
  );
};
