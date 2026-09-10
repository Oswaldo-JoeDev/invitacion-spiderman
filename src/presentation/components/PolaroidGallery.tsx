// src/presentation/components/PolaroidGallery.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { GALLERY_IMAGES } from "../../data/datasources/galleryImages";

// ── Data ──────────────────────────────────────────────────────────────────────
const SPIDER_QUOTES = [
  "¡Momentos del Multiverso!",
  "Mateo Sebastián",
  "Pequeño Héroe",
  "Aventura Arácnida",
  "¡Rumbo a los 3 Años!",
  "Un gran poder conlleva a una gran responsabilidad",
  "Un salto de fe...",
  "Cualquiera puede usar la máscara",
  "No, voy a hacer las cosas a mi manera",
  "En cada universo hay un Spider-Man",
  "¿Qué hay de nuevo, viejo?",
  "¡La ciudad cuenta con nosotros!",
  "Siempre puedes volver a levantarte",
  "¡Spider-Gang unida!",
  "Sentido Arácnido activado",
  "¡Eres el héroe de tu propia historia!",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

// Returns visual properties for a card based on its distance from center.
// Only ±2 slots are rendered (5 cards total in DOM).
function slotStyle(offset: number) {
  const abs = Math.min(Math.abs(offset), 2);

  const scale   = [1,    0.72, 0.55][abs];
  const opacity = [1,    0.50, 0.22][abs];
  const zIndex  = [10,   5,    2   ][abs];

  const txMap: Record<number, string> = {
    0:  "0px",
    1:  "64%",  "-1": "-64%",
    2:  "112%", "-2": "-112%",
  };
  const translateX = txMap[offset] ?? (offset > 0 ? "130%" : "-130%");

  return { scale, opacity, zIndex, translateX };
}

// ── Styled components ─────────────────────────────────────────────────────────

const GalleryWrapper = styled(Box)({
  margin: "35px 0 25px",
  position: "relative",
  userSelect: "none",
});

const CarouselViewport = styled(Box)({
  position: "relative",
  width: "100%",
  height: "340px",
  overflow: "hidden",
  // Isolate carousel repaints from the rest of the page
  contain: "layout style paint",
});

const CarouselTrack = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Card keyed by imgIdx — offset changes trigger CSS transitions
const CardSlot = styled(Box, {
  shouldForwardProp: (p) => p !== "cardOffset" && p !== "isCenter",
})<{ cardOffset: number; isCenter: boolean }>(({ cardOffset, isCenter }) => {
  const { scale, opacity, zIndex, translateX } = slotStyle(cardOffset);
  return {
    position: "absolute",
    width: "220px",
    borderRadius: "14px",
    overflow: "hidden",
     border: isCenter
      ? ".01rem solid #ff000045"
      : ".01rem solid #0400f994",
    boxShadow: isCenter
      ? "0 3px 12px rgba(255, 0, 0, 0.251), 0 8px 20px rgba(0,0,0,0.45)"
      : "none",
    transform: `translateX(${translateX}) scale(${scale})`,
    transformOrigin: "center center",
    opacity,
    zIndex,
    // willChange only on center card — side cards don't need a dedicated GPU layer
    willChange: isCenter ? "transform, opacity" : "auto",
    // Only animate transform + opacity (GPU-composited, no main thread work)
    // Removed: filter (forces rasterization), box-shadow (main thread)
    transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: isCenter ? "default" : "pointer",
    pointerEvents: Math.abs(cardOffset) >= 2 ? "none" : "auto",
  };
});


const PhotoArea = styled(Box)({
  width: "100%",
  height: "260px",
  backgroundColor: "#111115",
  overflow: "hidden",
  position: "relative",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
});

// Invisible transparent shield overlay to prevent right-click / long-press save menu
const ProtectionShield = styled(Box)({
  position: "absolute",
  inset: 0,
  zIndex: 10,
  pointerEvents: "auto",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
});

const PhotoImg = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  pointerEvents: "none", // Image cannot be dragged or right-clicked directly
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
});

// White bottom strip — polaroid signature
const WhiteStrip = styled(Box)({
  backgroundColor: "#09090c",
  padding: "10px 12px 12px",
  textAlign: "center",
  minHeight: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CaptionText = styled(Typography)({
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "0.85rem",
  color: "#f2f2f2",
  letterSpacing: "0.4px",
  lineHeight: 1.3,
});

// Navigation arrows
const NavBtn = styled("button", {
  shouldForwardProp: (p) => p !== "side",
})<{ side: "left" | "right" }>(({ side }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: "4px",
  zIndex: 20,
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "1.5px solid rgba(255,255,255,0.25)",
  backgroundColor: "rgba(16,16,22,0.6)",
  backdropFilter: "blur(6px)",
  color: "#ffffff",
  fontSize: "1rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255,28,36,0.5)",
    borderColor: "#ff1c24",
  },
}));

const DotsRow = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "6px",
  marginTop: "14px",
});

const Dot = styled(Box, {
  shouldForwardProp: (p) => p !== "active",
})<{ active: boolean }>(({ active }) => ({
  width: active ? "20px" : "6px",
  height: "6px",
  borderRadius: "3px",
  backgroundColor: active ? "#ff1c24" : "rgba(255,255,255,0.25)",
  transition: "width 0.3s ease, background-color 0.3s ease",
}));

// ── Component ─────────────────────────────────────────────────────────────────

interface PolaroidGalleryProps {
  onTap?: () => void;
}

// Render ±2 slots: 5 cards total in DOM at any time
// 5 cards in DOM: ±2 barely visible + ±1 side + 0 center
const OFFSETS = [-2, -1, 0, 1, 2];

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ onTap }) => {
  const total = GALLERY_IMAGES.length;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const goNext = useCallback(() => {
    if (onTap) onTap();
    setCurrent((prev) => (prev + 1) % total);
    setResetKey((k) => k + 1);
  }, [total, onTap]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
    setResetKey((k) => k + 1);
  }, [total]);

  // Auto-advance — resetKey restarts timer on manual navigation
  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3800);
    return () => clearInterval(id);
  }, [isHovered, resetKey, total]);

  // Preload next two images
  useEffect(() => {
    [1, 2].forEach((delta) => {
      const idx = (current + delta) % total;
      const img = new Image();
      img.src = GALLERY_IMAGES[idx];
    });
  }, [current, total]);

  // Build visible card list, keyed by imgIdx so React tracks the DOM element
  // across renders and CSS transitions fire when offset changes
  const visibleCards = useMemo(() =>
    OFFSETS.map((d) => {
      const imgIdx = ((current + d) % total + total) % total;
      return { imgIdx, offset: d };
    }),
  [current, total]);

  // ── Touch swipe ──────────────────────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return; // vertical scroll intent
    const THRESHOLD = 45;
    if (deltaX < -THRESHOLD) goNext();
    else if (deltaX > THRESHOLD) goPrev();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <GalleryWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CarouselViewport
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <NavBtn side="left" onClick={goPrev} aria-label="Anterior">&#8249;</NavBtn>
        <NavBtn side="right" onClick={goNext} aria-label="Siguiente">&#8250;</NavBtn>

        <CarouselTrack>
          {visibleCards.map(({ imgIdx, offset }) => {
            const src = GALLERY_IMAGES[imgIdx];
            const caption = SPIDER_QUOTES[imgIdx % SPIDER_QUOTES.length];
            const isCenter = offset === 0;

            return (
              // key=imgIdx: React keeps same DOM element as card moves between slots.
              // When offset changes, CSS transition animates scale/opacity/translateX.
              <CardSlot
                key={imgIdx}
                cardOffset={offset}
                isCenter={isCenter}
                onClick={!isCenter ? (offset < 0 ? goPrev : goNext) : undefined}
              >
                <PhotoArea onContextMenu={(e) => e.preventDefault()}>
                  <ProtectionShield onContextMenu={(e) => e.preventDefault()} />
                  <PhotoImg
                    src={src}
                    alt={`Foto ${imgIdx + 1} Galería Mateo`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    // Center card loads immediately; side cards are deferred by browser
                    loading={isCenter ? "eager" : "lazy"}
                    // Decode off main thread so it doesn't block rendering
                    decoding="async"
                    // Boost network priority only for the visible center image
                    fetchPriority={isCenter ? "high" : "low"}
                  />
                </PhotoArea>
                <WhiteStrip>
                  <CaptionText>{caption}</CaptionText>
                </WhiteStrip>
              </CardSlot>
            );
          })}
        </CarouselTrack>
      </CarouselViewport>

      {/* Dot indicators — sliding window of 5 around current */}
      <DotsRow>
        {Array.from({ length: total }).map((_, i) => {
          const dist = Math.abs(i - current);
          const wrappedDist = Math.min(dist, total - dist);
          if (wrappedDist > 2) return null;
          return <Dot key={i} active={i === current} />;
        })}
      </DotsRow>
    </GalleryWrapper>
  );
};
