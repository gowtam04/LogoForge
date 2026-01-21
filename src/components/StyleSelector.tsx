'use client';

import { ToggleButtonGroup, ToggleButton, Box, Typography, alpha } from '@mui/material';
import {
  AutoAwesome as AnyIcon,
  MinimizeOutlined as MinimalistIcon,
  SentimentVerySatisfied as PlayfulIcon,
  Business as CorporateIcon,
  Pets as MascotIcon,
} from '@mui/icons-material';
import { LogoStyle } from '@/types';

interface StyleSelectorProps {
  value: LogoStyle;
  onChange: (style: LogoStyle) => void;
}

const styles: { value: LogoStyle; label: string; icon: React.ElementType }[] = [
  { value: 'any', label: 'Any', icon: AnyIcon },
  { value: 'minimalist', label: 'Minimal', icon: MinimalistIcon },
  { value: 'playful', label: 'Playful', icon: PlayfulIcon },
  { value: 'corporate', label: 'Corporate', icon: CorporateIcon },
  { value: 'mascot', label: 'Mascot', icon: MascotIcon },
];

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <Box role="group" aria-labelledby="style-selector-label">
      <Typography
        id="style-selector-label"
        variant="body2"
        sx={{
          mb: 1.5,
          color: 'text.secondary',
          fontWeight: 500,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
        }}
      >
        Style
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => newValue && onChange(newValue)}
        aria-label="Logo style selection"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          '& .MuiToggleButtonGroup-grouped': {
            border: '1px solid #262626 !important',
            borderRadius: '10px !important',
            margin: 0,
            '&:not(:first-of-type)': {
              borderLeft: '1px solid #262626 !important',
            },
          },
        }}
      >
        {styles.map(({ value: styleValue, label, icon: Icon }) => (
          <ToggleButton
            key={styleValue}
            value={styleValue}
            aria-label={`${label} style`}
            sx={{
              px: 2,
              py: 1.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              minWidth: 80,
              backgroundColor: 'transparent',
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                borderColor: '#404040 !important',
              },
              '&:focus-visible': {
                outline: `2px solid ${alpha('#6366f1', 0.9)}`,
                outlineOffset: 2,
                zIndex: 1,
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                borderColor: '#6366f1 !important',
                color: '#818cf8',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                },
              },
            }}
          >
            <Icon sx={{ fontSize: 20 }} aria-hidden="true" />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                fontSize: '0.7rem',
                letterSpacing: '0.01em',
              }}
            >
              {label}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
