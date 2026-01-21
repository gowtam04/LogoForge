'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

const showcaseLogos = [
  {
    filename: 'logo-fintech-minimal.png',
    name: 'PayFlow',
    style: 'Minimalist',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-fitness-playful.png',
    name: 'FitBurst',
    style: 'Playful',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-legal-corporate.png',
    name: 'LexisCounsel',
    style: 'Corporate',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-game-mascot.png',
    name: 'RoboRun',
    style: 'Mascot',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-eco-minimal.png',
    name: 'GreenStep',
    style: 'Minimalist',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-food-playful.png',
    name: 'NomNom',
    style: 'Playful',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-cloud-corporate.png',
    name: 'VaultCloud',
    style: 'Corporate',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
  {
    filename: 'logo-pet-mascot.png',
    name: 'PawPal',
    style: 'Mascot',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    gridArea: { xs: 'span 1', md: 'span 1' },
  },
];

export default function ShowcaseGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 14 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              See what you can create
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              From minimalist to playful, corporate to mascot — generate any style you imagine.
            </Typography>
          </Box>
        </ScrollReveal>

        <Box
          ref={containerRef}
          className={`cascade-grid ${isVisible ? 'is-visible' : ''}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, md: 3 },
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {showcaseLogos.map((logo, index) => (
            <Box
              key={logo.filename}
              className="showcase-logo"
              sx={{
                aspectRatio: '1',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#171717',
                border: '1px solid #262626',
                cursor: 'pointer',
                boxShadow: `0 4px 30px ${logo.glowColor.replace('0.4', '0.15')}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 40px ${logo.glowColor}`,
                  borderColor: logo.glowColor.replace('0.4', '0.5'),
                },
                // Alternating slight size variations for asymmetry
                ...(index === 0 || index === 5
                  ? { transform: 'scale(1.02)' }
                  : index === 3 || index === 6
                  ? { transform: 'scale(0.98)' }
                  : {}),
              }}
            >
              <Image
                src={`/logos/showcase/${logo.filename}`}
                alt={`${logo.name} - ${logo.style} logo example`}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
                style={{
                  objectFit: 'cover',
                }}
              />

              {/* Hover overlay with info */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 2,
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  {logo.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {logo.style}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
