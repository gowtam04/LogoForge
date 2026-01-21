'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Stack, alpha } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  icon: SvgIconComponent | ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  // Check if icon is a component or a ReactNode
  const isIconComponent = typeof Icon === 'function';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: { xs: 8, md: 12 },
        px: 3,
        minHeight: 400,
      }}
    >
      {/* Icon container with glow effect */}
      <Box
        sx={{
          position: 'relative',
          mb: 4,
        }}
      >
        {/* Background glow */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#6366f1', 0.15)} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Icon wrapper */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: alpha('#6366f1', 0.1),
            border: '1px solid',
            borderColor: alpha('#6366f1', 0.2),
          }}
        >
          {isIconComponent ? (
            <Icon
              sx={{
                fontSize: 36,
                color: 'primary.main',
              }}
            />
          ) : (
            Icon
          )}
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: 'text.primary',
          background: 'linear-gradient(135deg, #ededed 0%, #a1a1aa 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 400,
          mb: action ? 4 : 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {/* Optional CTA button */}
      {action && (
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            href={action.href}
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: `0 4px 20px ${alpha('#6366f1', 0.4)}`,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 25px ${alpha('#6366f1', 0.5)}`,
              },
              '&:focus-visible': {
                outline: `2px solid ${alpha('#6366f1', 0.8)}`,
                outlineOffset: 2,
              },
              transition: 'all 0.2s ease',
            }}
          >
            {action.label}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
