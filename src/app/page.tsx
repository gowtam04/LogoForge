'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';
import {
  Bolt as BoltIcon,
  AutoAwesome as AutoAwesomeIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const valueProps = [
  {
    icon: BoltIcon,
    title: 'Lightning Fast',
    description: 'Generate professional logos in seconds, not hours. AI does the heavy lifting.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },
  {
    icon: AutoAwesomeIcon,
    title: 'Completely Free',
    description: 'No watermarks, no subscriptions. Full resolution exports at no cost.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  {
    icon: VerifiedIcon,
    title: 'App Store Ready',
    description: 'Export complete icon bundles for iOS, Android, and Web in one click.',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
  },
];

const showcaseLogos = [
  { color: '#6366f1', letter: 'A' },
  { color: '#ec4899', letter: 'B' },
  { color: '#f59e0b', letter: 'C' },
  { color: '#22c55e', letter: 'D' },
  { color: '#ef4444', letter: 'E' },
  { color: '#8b5cf6', letter: 'F' },
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Header />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 12, md: 16 }, pb: 10, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 10, md: 14 } }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                mb: 4,
                borderRadius: '100px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 16, color: '#818cf8' }} />
              <Typography variant="body2" sx={{ color: '#818cf8', fontWeight: 500 }}>
                Powered by AI
              </Typography>
            </Box>

            {/* Main headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                mb: 3,
              }}
            >
              From idea to{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                App Store-ready
              </Box>
              <br />
              icons in under 5 minutes
            </Typography>

            {/* Subheadline */}
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                mb: 5,
                lineHeight: 1.6,
              }}
            >
              Generate unique logos with AI and export perfectly sized icon bundles
              for iOS, Android, and Web.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                component={Link}
                href="/create"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.75,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Create Your Logo
              </Button>
            </Stack>
          </Box>

          {/* Value Props */}
          <Grid container spacing={3} sx={{ mb: { xs: 10, md: 14 } }}>
            {valueProps.map((prop, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: prop.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        boxShadow: `0 0 20px ${prop.gradient.includes('#f59e0b') ? 'rgba(245, 158, 11, 0.3)' : prop.gradient.includes('#6366f1') ? 'rgba(99, 102, 241, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                      }}
                    >
                      <prop.icon sx={{ fontSize: 24, color: '#0a0a0a' }} />
                    </Box>
                    <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 600 }}>
                      {prop.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {prop.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Logo Showcase */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              See what you can create
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}
            >
              From minimalist to playful, corporate to mascot — generate any style you imagine.
            </Typography>

            {/* Logo Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(6, 1fr)',
                },
                gap: 2,
                maxWidth: 900,
                mx: 'auto',
              }}
            >
              {showcaseLogos.map((logo, index) => (
                <Box
                  key={index}
                  sx={{
                    aspectRatio: '1',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${logo.color} 0%, ${logo.color}99 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 30px ${logo.color}33`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05) rotate(2deg)',
                      boxShadow: `0 8px 40px ${logo.color}44`,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {logo.letter}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
