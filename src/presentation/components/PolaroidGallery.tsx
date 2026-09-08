// src/presentation/components/PolaroidGallery.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

// Dynamically discover all images placed inside public/Galeria folder via Vite glob
const rawGalleryModules = import.meta.glob("/public/Galeria/*", {
  query: "?url",
  import: "default",
  eager: true,
});

const GALLERY_PATHS: string[] = Object.keys(rawGalleryModules).map((path) =>
  path.replace("/public", "")
);

// Iconic Spider-Man & Miles Morales quotes (en español, sin emojis)
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

// Fan spread transform presets matching the reference image layout
const FAN_PRESETS = [
  { rotation: -16, offsetX: -40, offsetY: 18 },  // Far left bottom
  { rotation: -6,  offsetX: -22, offsetY: -16 }, // Top left
  { rotation: 10,  offsetX: 28,  offsetY: -20 }, // Top right
  { rotation: 5,   offsetX: 18,  offsetY: 10 },  // Far right
  { rotation: -11, offsetX: -6,  offsetY: 16 },  // Center front top
];

const GalleryContainer = styled(Box)({
  margin: "35px 0 25px",
  textAlign: "center",
  position: "relative",
});

const StackArea = styled(Box)({
  position: "relative",
  width: "100%",
  maxWidth: "380px",
  height: "420px",
  margin: "0 auto",
  cursor: "pointer",
  userSelect: "none",
  perspective: "1000px",
});

const PolaroidCard = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "rotation" &&
    prop !== "offsetX" &&
    prop !== "offsetY" &&
    prop !== "zIndex" &&
    prop !== "isTop",
})<{
  rotation: number;
  offsetX: number;
  offsetY: number;
  zIndex: number;
  isTop: boolean;
}>(({ rotation, offsetX, offsetY, zIndex, isTop }) => ({
  position: "absolute",
  top: "10px",
  left: "50%",
  width: "270px",
  marginLeft: "-135px",
  backgroundColor: "#ffffff",
  padding: "10px 10px 38px 10px", // Iconic mythical Polaroid frame: thin top/side white borders + wide bottom chin
  borderRadius: "4px",
  overflow: "hidden",
  boxShadow: isTop
    ? "0 18px 40px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.3)"
    : "0 10px 25px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.2)",
  transform: `translate3d(${offsetX}px, ${offsetY}px, 0px) rotate(${rotation}deg)`,
  transformOrigin: "center center",
  willChange: "transform",
  backfaceVisibility: "hidden",
  zIndex: zIndex,
  transition: "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.25), box-shadow 0.3s ease",
  animation: isTop ? "dropIn 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.1) forwards" : "none",
  "&:hover": {
    transform: `translate3d(${offsetX}px, ${offsetY}px, 0px) rotate(${rotation}deg) scale(1.03)`,
  },
  "@keyframes dropIn": {
    "0%": {
      opacity: 0,
      transform: `translate3d(${offsetX}px, ${offsetY - 60}px, 0px) rotate(${rotation - 12}deg) scale(1.1)`,
    },
    "100%": {
      opacity: 1,
      transform: `translate3d(${offsetX}px, ${offsetY}px, 0px) rotate(${rotation}deg) scale(1)`,
    },
  },
}));

const PhotoWrapper = styled(Box)({
  width: "100%",
  height: "260px",
  backgroundColor: "#111115",
  borderRadius: "2px",
  overflow: "hidden",
  position: "relative",
});

const PhotoImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

const CaptionText = styled(Typography)({
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "0.95rem",
  color: "#222225",
  marginTop: "10px",
  textAlign: "center",
  letterSpacing: "0.5px",
});

interface PolaroidGalleryProps {
  onTap?: () => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ onTap }) => {
  // Use all dynamically discovered gallery paths
  const galleryList = useMemo(() => {
    if (GALLERY_PATHS.length > 0) return GALLERY_PATHS;
    return [
      "/Galeria/F36072BA-14F7-4E25-B3ED-7F0A5CF98985.jpg",
      "/Galeria/IMG_0888.JPEG",
      "/Galeria/IMG_2034.JPEG",
      "/Galeria/IMG_5326 Copy.JPG",
      "/Galeria/IMG_8417.JPEG",
    ];
  }, []);

  // Active stack array storing photo indices
  const [stackedIndices, setStackedIndices] = useState<number[]>([0]);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Advance function to drop next photo onto fan stack
  const advanceStack = () => {
    if (onTap) onTap();

    setStackedIndices((prev) => {
      if (prev.length >= galleryList.length) {
        // Reset to first card to repeat fan stacking loop
        return [0];
      }
      return [...prev, prev.length];
    });
  };

  // Preload upcoming images in browser cache
  useEffect(() => {
    const next1 = (stackedIndices.length) % galleryList.length;
    const next2 = (stackedIndices.length + 1) % galleryList.length;
    [next1, next2].forEach((idx) => {
      if (galleryList[idx]) {
        const img = new Image();
        img.src = galleryList[idx];
      }
    });
  }, [stackedIndices, galleryList]);

  // Auto-advance interval every 3.8s if not hovered
  useEffect(() => {
    if (isHovered) return;

    timerRef.current = setInterval(() => {
      advanceStack();
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, stackedIndices, galleryList.length]);

  // Keep top 5 cards in DOM spread out into fan positions
  const visibleStack = useMemo(() => {
    const maxVisible = 5;
    if (stackedIndices.length <= maxVisible) {
      return stackedIndices.map((imgIdx, level) => ({
        imgIndex: imgIdx,
        preset: FAN_PRESETS[level % FAN_PRESETS.length],
        level: level,
      }));
    }

    const sliced = stackedIndices.slice(stackedIndices.length - maxVisible);
    return sliced.map((imgIdx, level) => ({
      imgIndex: imgIdx,
      preset: FAN_PRESETS[level % FAN_PRESETS.length],
      level: level,
    }));
  }, [stackedIndices]);

  return (
    <GalleryContainer>
      <StackArea
        onClick={advanceStack}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {visibleStack.map(({ imgIndex, preset, level }, stackPos) => {
          const imgSrc = galleryList[imgIndex];
          const isTop = stackPos === visibleStack.length - 1;
          const caption = SPIDER_QUOTES[imgIndex % SPIDER_QUOTES.length];

          return (
            <PolaroidCard
              key={`${imgSrc}-${level}`}
              rotation={preset.rotation}
              offsetX={preset.offsetX}
              offsetY={preset.offsetY}
              zIndex={stackPos + 1}
              isTop={isTop}
            >
              <PhotoWrapper>
                <PhotoImage
                  src={imgSrc}
                  alt={`Foto ${imgIndex + 1} Galería Mateo`}
                  loading="eager"
                />
              </PhotoWrapper>
              <CaptionText>{caption}</CaptionText>
            </PolaroidCard>
          );
        })}
      </StackArea>
    </GalleryContainer>
  );
};
