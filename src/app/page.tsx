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
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ScrollReveal,
  HowItWorksSection,
  PlatformExportPreview,
  ShowcaseGrid,
  FloatingLogos,
  ThreeWaysSection,
  StyleGallerySection,
} from '@/components/landing';

const valueProps = [
  {
    icon: BoltIcon,
    title: 'Lightning Fast',
    description: 'Generate professional logos in seconds, not hours. AI does the heavy lifting.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
  {
    icon: AutoAwesomeIcon,
    title: 'Completely Free',
    description: 'No watermarks, no subscriptions. Full resolution exports at no cost.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
  {
    icon: VerifiedIcon,
    title: 'App Store Ready',
    description: 'Export complete icon bundles for iOS, Android, and Web in one click.',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    glowColor: 'rgba(34, 197, 94, 0.3)',
  },
  {
    icon: DashboardIcon,
    title: '4 Unique Variations',
    description: 'Get four distinct logo concepts to choose from with every generation.',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    glowColor: 'rgba(236, 72, 153, 0.3)',
  },
];

export default function Home() {
  const handleScrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      {/* Third gradient orb - teal for variety */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '60%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating background logos */}
      <FloatingLogos />

      <Header />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 12, md: 16 }, pb: 0, position: 'relative', zIndex: 1 }}>
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
                Powered by Google Gemini
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
              <Button
                onClick={handleScrollToHowItWorks}
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  color: '#a5b4fc',
                  '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.6)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                See how it works
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* Three Ways to Create */}
        <ThreeWaysSection />

        {/* Value Props */}
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ mb: { xs: 6, md: 10 } }}>
            {valueProps.map((prop, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <ScrollReveal delay={index * 0.1}>
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
                          boxShadow: `0 0 20px ${prop.glowColor}`,
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
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Style Gallery */}
        <StyleGallerySection />

        {/* Logo Showcase Grid */}
        <ShowcaseGrid />

        {/* Platform Export Preview */}
        <PlatformExportPreview />

        {/* Final CTA Section */}
        <Box
          component="section"
          sx={{
            py: { xs: 10, md: 14 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="sm">
            <ScrollReveal>
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                }}
              >
                Ready to create your logo?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
              >
                Start generating professional logos in seconds. No design skills required.
              </Typography>
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
                Get Started Free
              </Button>
            </ScrollReveal>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
