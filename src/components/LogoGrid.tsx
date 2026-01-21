'use client';

import { useCallback } from 'react';
import { Box, Card, CardActionArea, Grid, Skeleton, alpha } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GeneratedLogo } from '@/types';

interface LogoGridProps {
  logos: GeneratedLogo[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (logo: GeneratedLogo) => void;
  loading?: boolean;
}

export default function LogoGrid({
  logos,
  selectedId,
  onSelect,
  onPreview,
  loading = false,
}: LogoGridProps) {
  const handleClick = useCallback((logo: GeneratedLogo) => {
    if (selectedId === logo.id) {
      // Already selected, open preview
      onPreview(logo);
    } else {
      // Select this logo
      onSelect(logo.id);
    }
  }, [selectedId, onPreview, onSelect]);

  const handleDoubleClick = useCallback((logo: GeneratedLogo) => {
    onPreview(logo);
  }, [onPreview]);

  // Handle keyboard interaction for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent, logo: GeneratedLogo) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(logo);
    }
  }, [handleClick]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item}>
            <Card
              sx={{
                aspectRatio: '1',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ bgcolor: alpha('#6366f1', 0.1) }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {logos.map((logo) => {
        const isSelected = selectedId === logo.id;

        return (
          <Grid size={{ xs: 12, sm: 6 }} key={logo.id}>
            <Card
              sx={{
                position: 'relative',
                aspectRatio: '1',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                boxShadow: isSelected
                  ? `0 0 30px ${alpha('#6366f1', 0.4)}, 0 0 60px ${alpha('#6366f1', 0.2)}`
                  : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isSelected
                    ? `0 0 40px ${alpha('#6366f1', 0.5)}, 0 0 80px ${alpha('#6366f1', 0.25)}`
                    : `0 8px 30px ${alpha('#000', 0.3)}`,
                  borderColor: isSelected ? 'primary.light' : alpha('#6366f1', 0.3),
                },
              }}
            >
              <CardActionArea
                onClick={() => handleClick(logo)}
                onDoubleClick={() => handleDoubleClick(logo)}
                onKeyDown={(e) => handleKeyDown(e, logo)}
                aria-label={`Logo option ${logos.indexOf(logo) + 1}${isSelected ? ' (selected)' : ''}. ${isSelected ? 'Press Enter to preview' : 'Press Enter to select'}`}
                aria-pressed={isSelected}
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  '&:focus-visible': {
                    outline: `3px solid ${alpha('#6366f1', 0.9)}`,
                    outlineOffset: -3,
                    backgroundColor: alpha('#6366f1', 0.05),
                  },
                }}
              >
                <Box
                  component="img"
                  src={`data:${logo.mimeType};base64,${logo.base64}`}
                  alt="Generated logo"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              </CardActionArea>

              {/* Selection indicator */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    boxShadow: `0 0 15px ${alpha('#6366f1', 0.6)}`,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: `0 0 15px ${alpha('#6366f1', 0.6)}`,
                      },
                      '50%': {
                        boxShadow: `0 0 25px ${alpha('#6366f1', 0.8)}`,
                      },
                      '100%': {
                        boxShadow: `0 0 15px ${alpha('#6366f1', 0.6)}`,
                      },
                    },
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      fontSize: 20,
                      color: 'white',
                    }}
                  />
                </Box>
              )}

              {/* Glow overlay for selected state */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(ellipse at center, ${alpha('#6366f1', 0.1)} 0%, transparent 70%)`,
                  }}
                />
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
