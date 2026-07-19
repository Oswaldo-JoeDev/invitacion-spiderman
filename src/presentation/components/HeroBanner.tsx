// src/presentation/components/HeroBanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, CircularProgress } from "@mui/material";

const BannerCard = styled(Box)({
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '28px',
  backgroundColor: 'rgba(16, 16, 22, 0.45)',
  margin: '20px 0',
  overflow: 'hidden',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  position: 'relative',
  backdropFilter: 'blur(30px) saturate(130%)',
  WebkitBackdropFilter: 'blur(30px) saturate(130%)',
});

const ImageContainer = styled(Box)({
  width: "100%",
  height: "250px",
  position: "relative",
  overflow: "hidden",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
});

const BannerVideo = styled("video")({
  width: "100%",
  height: "120%",
  objectFit: "cover",
  position: "absolute",
  top: "-10%",
  transition: "transform 0.1s ease-out",
  border: "none",
  outline: "none",
});

const LoaderContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
  backgroundColor: '#070709', // clean solid dark background during load
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
});

const TitleOverlay = styled(Box)({
  padding: "2rem 1.25rem",
  textAlign: "center",
});

const CustomLogoImg = styled('img')({
  width: '90%',
  maxWidth: '290px',
  height: 'auto',
  margin: '8px auto 18px',
  display: 'block',
});

const IntroDesc = styled(Typography)({
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.92rem",
  color: 'rgba(255, 255, 255, 0.7)',
  lineHeight: 1.5,
  maxWidth: '360px',
  margin: '0 auto',
});

export const HeroBanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // Process cover logo (making background transparent and black text white)
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];
          
          // Only convert black/near-black pixels of "SPIDER-MAN" to white,
          // preserving the original transparency and keeping the white MARVEL text intact.
          if (r < 50 && g < 50 && b < 50 && a > 30) {
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setProcessedLogo(canvas.toDataURL());
      }
    };
    img.src = '/mateo_logo.png';
  }, []);

  // Parallax Scroll for video background
  useEffect(() => {
    const handleScroll = () => {
      const video = videoRef.current;
      if (video) {
        const scrolled = window.pageYOffset;
        video.style.transform = `translateY(${scrolled * 0.12}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <BannerCard>
      <ImageContainer>
        <BannerVideo
          ref={videoRef}
          src="/salto-fe.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setIsVideoPlaying(true)}
        />

        {/* Custom loading overlay with circular progress around pin-loader image */}
        <LoaderContainer style={{ opacity: isVideoPlaying ? 0 : 1, pointerEvents: isVideoPlaying ? 'none' : 'auto' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              size={76} 
              sx={{ color: '#ff1c24' }} 
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src="/pin-loader.png" 
                alt="Cargando video..." 
                style={{ width: '40px', height: '40px', display: 'block' }} 
              />
            </Box>
          </Box>
        </LoaderContainer>
      </ImageContainer>

      <TitleOverlay>
        <CustomLogoImg 
          src={processedLogo || '/mateo_logo.png'} 
          alt="Spider-Man Mateo Sebastian Logo" 
        />

        <IntroDesc>
          ¡Acompáñame a cruzar el portal dimensional para celebrar mi
          cumpleaños! Prepárate para balancearte por las actividades de este
          gran día.
        </IntroDesc>
      </TitleOverlay>
    </BannerCard>
  );
};
