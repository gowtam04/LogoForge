'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

interface ScrollRevealProps extends BoxProps {
  children: ReactNode;
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.1,
  className = '',
  ...boxProps
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Box
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      sx={{
        transitionDelay: `${delay}s`,
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
