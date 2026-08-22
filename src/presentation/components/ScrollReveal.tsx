// src/presentation/components/ScrollReveal.tsx
import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const RevealWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible: boolean }>(({ isVisible }) => ({
  opacity: 0,
  transform: "translateY(55px) scale(0.85) rotate(-2.5deg)",
  transition: "opacity 0.75s ease-out, transform 0.95s cubic-bezier(0.34, 1.65, 0.64, 1)",
  ...(isVisible && {
    opacity: 1,
    transform: "translateY(0) scale(1) rotate(0deg)",
  }),
}));

interface ScrollRevealProps {
  children: React.ReactNode;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Play animation only once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentTarget = domRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  return (
    <RevealWrapper ref={domRef} isVisible={isVisible}>
      {children}
    </RevealWrapper>
  );
};
