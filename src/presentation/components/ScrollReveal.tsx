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
    const el = domRef.current;
    if (!el) return;

    // If the element is already in or above the viewport on mount (above-the-fold
    // or near-top content), make it visible immediately without waiting for the observer.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsVisible(true);
      return;
    }

    // For below-the-fold elements, trigger the animation 180px BEFORE the element
    // enters the viewport so the user never sees the invisible/collapsed state.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 180px 0px",
      }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);


  return (
    <RevealWrapper ref={domRef} isVisible={isVisible}>
      {children}
    </RevealWrapper>
  );
};
