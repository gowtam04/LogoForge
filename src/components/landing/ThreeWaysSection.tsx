'use client';

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  TextFields as TextFieldsIcon,
  Collections as CollectionsIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import ScrollReveal from './ScrollReveal';

const inputModes = [
  {
    icon: TextFieldsIcon,
    title: 'Text Description',
    description: 'Describe your logo in words with style and color preferences',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
  {
    icon: CollectionsIcon,
    title: 'Reference Images',
    description: 'Upload inspiration images for AI to analyze',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
  {
    icon: SmartToyIcon,
    title: 'AI Interview',
    description: 'Answer 5-8 guided questions to build the perfect prompt',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    glowColor: 'rgba(34, 197, 94, 0.3)',
  },
];

export default function ThreeWaysSection() {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 10, md: 14 }, position: 'relative' }}
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
              Three ways to create
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: 'auto' }}
            >
              Choose the input method that works best for you
            </Typography>
          </Box>
        </ScrollReveal>

        <Grid container spacing={3} justifyContent="center">
          {inputModes.map((mode, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
                  <CardContent
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: mode.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: `0 0 30px ${mode.glowColor}`,
                      }}
                    >
                      <mode.icon sx={{ fontSize: 32, color: '#0a0a0a' }} />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 1.5,
                        fontWeight: 600,
                        fontSize: '1.25rem',
                      }}
                    >
                      {mode.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {mode.description}
                    </Typography>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
