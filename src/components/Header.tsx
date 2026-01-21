'use client';

import { AppBar, Toolbar, Typography, Button, Container, Box, alpha } from '@mui/material';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <AppBar position="fixed" elevation={0} component="header" role="banner">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70 }} component="nav" aria-label="Main navigation">
            <Link
              href="/"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              aria-label="LogoForge - Go to homepage"
            >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -1,
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                  opacity: 0.5,
                  filter: 'blur(4px)',
                  zIndex: -1,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0a0a0a',
                  lineHeight: 1,
                }}
              >
                L
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ededed 0%, #a1a1aa 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LogoForge
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/create"
              variant="contained"
              aria-label="Create a new logo"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${alpha('#6366f1', 0.9)}`,
                  outlineOffset: 2,
                  boxShadow: `0 0 0 4px ${alpha('#6366f1', 0.2)}`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              Create Logo
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
}
