'use client';

import { Box, Container, Typography, Stack, Link as MuiLink } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid #262626',
        py: 4,
        mt: 'auto',
        backgroundColor: 'rgba(10, 10, 10, 0.6)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            LogoForge — AI-powered logo generation
          </Typography>

          <Stack direction="row" spacing={3}>
            <MuiLink
              href="#"
              underline="hover"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              Privacy
            </MuiLink>
            <MuiLink
              href="#"
              underline="hover"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              Terms
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
