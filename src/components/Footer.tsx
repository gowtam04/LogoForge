'use client';

import { Box, Container, Typography, Stack } from '@mui/material';

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

          <Typography variant="body2" color="text.secondary">
            Made with AI
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
