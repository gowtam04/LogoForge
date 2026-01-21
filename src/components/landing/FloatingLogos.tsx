'use client';

import { Box } from '@mui/material';
import Image from 'next/image';

const floatingLogos = [
  {
    filename: 'logo-fintech-minimal.png',
    position: { top: '15%', left: '5%' },
    size: 80,
    delay: 1,
  },
  {
    filename: 'logo-game-mascot.png',
    position: { top: '25%', right: '8%' },
    size: 100,
    delay: 2,
  },
  {
    filename: 'logo-eco-minimal.png',
    position: { bottom: '30%', left: '3%' },
    size: 70,
    delay: 3,
  },
  {
    filename: 'logo-pet-mascot.png',
    position: { bottom: '20%', right: '5%' },
    size: 90,
    delay: 4,
  },
];

export default function FloatingLogos() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {floatingLogos.map((logo, index) => (
        <Box
          key={logo.filename}
          className={`floating-logo floating-logo-${index + 1}`}
          sx={{
            position: 'absolute',
            ...logo.position,
            width: logo.size,
            height: logo.size,
            opacity: 0.12,
            filter: 'blur(1px)',
            borderRadius: '16px',
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Image
            src={`/logos/showcase/${logo.filename}`}
            alt=""
            fill
            sizes={`${logo.size}px`}
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
