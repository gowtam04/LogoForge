'use client';

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Apple as AppleIcon,
  Android as AndroidIcon,
  Language as WebIcon,
} from '@mui/icons-material';
import ScrollReveal from './ScrollReveal';

const platforms = [
  {
    name: 'iOS',
    icon: AppleIcon,
    gradient: 'linear-gradient(135deg, #a1a1aa 0%, #71717a 100%)',
    glowColor: 'rgba(161, 161, 170, 0.2)',
    description: 'AppIcon.appiconset',
    sizes: [
      { size: 1024, label: 'App Store' },
      { size: 180, label: '@3x' },
      { size: 120, label: '@2x' },
      { size: 87, label: 'Settings' },
      { size: 80, label: 'Spotlight' },
      { size: 60, label: 'Notification' },
    ],
  },
  {
    name: 'Android',
    icon: AndroidIcon,
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    glowColor: 'rgba(34, 197, 94, 0.2)',
    description: 'mipmap folders',
    sizes: [
      { size: 512, label: 'Play Store' },
      { size: 192, label: 'xxxhdpi' },
      { size: 144, label: 'xxhdpi' },
      { size: 96, label: 'xhdpi' },
      { size: 72, label: 'hdpi' },
      { size: 48, label: 'mdpi' },
    ],
  },
  {
    name: 'Web',
    icon: WebIcon,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glowColor: 'rgba(99, 102, 241, 0.2)',
    description: 'PWA & favicons',
    sizes: [
      { size: 512, label: 'PWA' },
      { size: 192, label: 'Chrome' },
      { size: 180, label: 'Apple Touch' },
      { size: 48, label: 'favicon' },
      { size: 32, label: 'favicon' },
      { size: 16, label: 'favicon' },
    ],
  },
];

function IconSizeGrid({ sizes }: { sizes: { size: number; label: string }[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        mt: 2,
      }}
    >
      {sizes.map((item, index) => {
        const displaySize = Math.min(item.size / 16, 32);
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: displaySize,
                height: displaySize,
                minWidth: 16,
                minHeight: 16,
                borderRadius: displaySize > 16 ? '6px' : '3px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                opacity: 0.7,
              }}
            />
            <Typography
              sx={{
                fontSize: '0.625rem',
                color: 'text.secondary',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function PlatformExportPreview() {
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
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              Export to every platform
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 550, mx: 'auto' }}
            >
              One logo, all the sizes you need. Get perfectly formatted icon bundles
              ready for app stores and browsers.
            </Typography>
          </Box>
        </ScrollReveal>

        <Grid container spacing={3}>
          {platforms.map((platform, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={platform.name}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '10px',
                          background: platform.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 20px ${platform.glowColor}`,
                        }}
                      >
                        <platform.icon sx={{ fontSize: 24, color: '#0a0a0a' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                          {platform.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {platform.description}
                        </Typography>
                      </Box>
                    </Box>

                    <IconSizeGrid sizes={platform.sizes} />
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
