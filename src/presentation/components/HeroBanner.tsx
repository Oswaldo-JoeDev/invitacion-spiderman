// src/presentation/components/HeroBanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const BannerCard = styled(Box)({
  border: '1px solid rgba(255, 255, 255, 0.09)',
  borderRadius: '28px',
  backgroundColor: 'rgba(16, 16, 22, 0.72)',
  margin: '20px 0',
  overflow: 'hidden',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  position: 'relative',
  backdropFilter: 'blur(24px) saturate(120%)',
  WebkitBackdropFilter: 'blur(24px) saturate(120%)',
});

const ImageContainer = styled(Box)({
  width: "100%",
  height: "250px",
  position: "relative",
  overflow: "hidden",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  // Instant visual fallback (poster background) while video loads/buffers
  backgroundImage: 'url("/miles_comic_bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
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

  // Force video to start at second 36 and loop back to second 36 safely
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = 36;
      video.play().catch(() => {});
    };

    const handleTimeUpdate = () => {
      // Prevent seeking command overload during active seek
      if (video.seeking) return;
      
      // Loop check: if video reaches end or wraps back to 0, seek to 36
      if (video.currentTime < 36) {
        video.currentTime = 36;
      }
    };

    const handleSeeked = () => {
      video.play().catch(() => {});
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);

    if (video.readyState >= 1) {
      video.currentTime = 36;
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  return (
    <BannerCard>
      <ImageContainer>
        <BannerVideo
          ref={videoRef}
          src="/salto-fe.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/miles_comic_bg.jpg"
        />
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
