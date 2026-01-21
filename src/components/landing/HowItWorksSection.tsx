'use client';

import { Box, Container, Typography, Stack } from '@mui/material';
import {
  EditNote as EditNoteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Devices as DevicesIcon,
} from '@mui/icons-material';
import ScrollReveal from './ScrollReveal';

const steps = [
  {
    number: 1,
    icon: EditNoteIcon,
    title: 'Describe',
    description: 'Tell us about your brand and style preferences. Upload references if you have them.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
  {
    number: 2,
    icon: AutoAwesomeIcon,
    title: 'Generate',
    description: 'AI creates 4 unique logo variations tailored to your vision in seconds.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
  {
    number: 3,
    icon: DevicesIcon,
    title: 'Export',
    description: 'Download complete icon bundles ready for iOS, Android, and Web.',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    glowColor: 'rgba(34, 197, 94, 0.3)',
  },
];

export default function HowItWorksSection() {
  return (
    <Box
      id="how-it-works"
      component="section"
      sx={{ py: { xs: 10, md: 14 }, position: 'relative' }}
    >
      <Container maxWidth="lg">
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              How it works
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              Three simple steps from concept to production-ready assets
            </Typography>
          </Box>
        </ScrollReveal>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 6, md: 4 }}
          alignItems="stretch"
          justifyContent="center"
          sx={{ position: 'relative' }}
        >
          {/* Connecting line for desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: '50px',
              left: '20%',
              right: '20%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.3) 0%, rgba(245, 158, 11, 0.3) 50%, rgba(34, 197, 94, 0.3) 100%)',
              zIndex: 0,
            }}
          />

          {steps.map((step, index) => (
            <ScrollReveal
              key={step.number}
              delay={index * 0.15}
              sx={{ flex: 1, maxWidth: { md: 320 }, position: 'relative', zIndex: 1 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Icon circle with number */}
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: step.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 30px ${step.glowColor}`,
                      position: 'relative',
                    }}
                  >
                    <step.icon sx={{ fontSize: 36, color: '#0a0a0a' }} />
                  </Box>
                  {/* Step number badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#171717',
                      border: '2px solid',
                      borderColor: step.gradient.includes('#6366f1')
                        ? '#6366f1'
                        : step.gradient.includes('#f59e0b')
                        ? '#f59e0b'
                        : '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: step.gradient.includes('#6366f1')
                          ? '#818cf8'
                          : step.gradient.includes('#f59e0b')
                          ? '#fbbf24'
                          : '#4ade80',
                      }}
                    >
                      {step.number}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: '1.25rem',
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {step.description}
                </Typography>
              </Box>
            </ScrollReveal>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
