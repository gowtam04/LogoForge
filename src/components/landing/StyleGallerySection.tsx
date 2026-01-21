'use client';

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

const styles = [
  {
    name: 'Minimalist',
    description: 'Clean lines and simple shapes for a modern look',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    logos: [
      { filename: 'logo-fintech-minimal.png', name: 'PayFlow' },
      { filename: 'logo-eco-minimal.png', name: 'GreenStep' },
    ],
  },
  {
    name: 'Playful',
    description: 'Fun and vibrant designs with personality',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    logos: [
      { filename: 'logo-fitness-playful.png', name: 'FitBurst' },
      { filename: 'logo-food-playful.png', name: 'NomNom' },
    ],
  },
  {
    name: 'Corporate',
    description: 'Professional and trustworthy brand identity',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    logos: [
      { filename: 'logo-legal-corporate.png', name: 'LexisCounsel' },
      { filename: 'logo-cloud-corporate.png', name: 'VaultCloud' },
    ],
  },
  {
    name: 'Mascot',
    description: 'Character-based logos with memorable appeal',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    logos: [
      { filename: 'logo-game-mascot.png', name: 'RoboRun' },
      { filename: 'logo-pet-mascot.png', name: 'PawPal' },
    ],
  },
];

export default function StyleGallerySection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        backgroundColor: 'rgba(23, 23, 23, 0.3)',
      }}
    >
      <Container maxWidth="lg">
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              Every style you can imagine
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              Generate logos in any style to match your brand personality
            </Typography>
          </Box>
        </ScrollReveal>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            overflowX: 'auto',
            gap: 2,
            pb: 2,
            mx: -2,
            px: 2,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {styles.map((style, index) => (
            <ScrollReveal key={style.name} delay={index * 0.1}>
              <StyleCard style={style} />
            </ScrollReveal>
          ))}
        </Box>

        {/* Desktop grid */}
        <Grid container spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {styles.map((style, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={style.name}>
              <ScrollReveal delay={index * 0.1}>
                <StyleCard style={style} />
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

interface StyleCardProps {
  style: (typeof styles)[0];
}

function StyleCard({ style }: StyleCardProps) {
  return (
    <Card
      sx={{
        minWidth: { xs: 260, md: 'auto' },
        scrollSnapAlign: 'start',
        p: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Style badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            mb: 2,
            borderRadius: '100px',
            background: style.gradient,
            boxShadow: `0 0 15px ${style.glowColor}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#0a0a0a',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {style.name}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2.5, lineHeight: 1.5, fontSize: '0.8125rem' }}
        >
          {style.description}
        </Typography>

        {/* Logo thumbnails */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {style.logos.map((logo) => (
            <Box
              key={logo.filename}
              sx={{
                flex: 1,
                aspectRatio: '1',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#171717',
                border: '1px solid #262626',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: style.glowColor.replace('0.3', '0.5'),
                  boxShadow: `0 4px 20px ${style.glowColor}`,
                },
              }}
            >
              <Image
                src={`/logos/showcase/${logo.filename}`}
                alt={`${logo.name} - ${style.name} style example`}
                fill
                sizes="120px"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
