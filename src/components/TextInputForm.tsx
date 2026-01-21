'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { AutoAwesome as GenerateIcon } from '@mui/icons-material';
import StyleSelector from './StyleSelector';
import { TextFormState, LogoStyle } from '@/types';

interface TextInitialValues {
  prompt: string;
  appName: string;
  style: string;
  colorHints: string;
}

interface TextInputFormProps {
  onSubmit: (data: TextFormState) => void;
  isLoading?: boolean;
  initialValues?: TextInitialValues;
}

const MAX_PROMPT_LENGTH = 500;

// Helper to create initial form state
function createInitialFormState(initialValues?: TextInitialValues): TextFormState {
  return {
    prompt: initialValues?.prompt || '',
    appName: initialValues?.appName || '',
    style: (initialValues?.style as LogoStyle) || 'any',
    colorHints: initialValues?.colorHints || '',
  };
}

export default function TextInputForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: TextInputFormProps) {
  // Create a stable key based on initialValues to reset form when they change
  const formKey = useMemo(
    () => initialValues ? JSON.stringify(initialValues) : 'default',
    [initialValues]
  );

  const [formState, setFormState] = useState<TextFormState>(() =>
    createInitialFormState(initialValues)
  );

  // Reset form state when initialValues change by using key
  const [prevKey, setPrevKey] = useState(formKey);
  if (prevKey !== formKey) {
    setPrevKey(formKey);
    setFormState(createInitialFormState(initialValues));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.prompt.trim() && !isLoading) {
      onSubmit(formState);
    }
  };

  const updateField = <K extends keyof TextFormState>(
    field: K,
    value: TextFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const charCount = formState.prompt.length;
  const isOverLimit = charCount > MAX_PROMPT_LENGTH;
  const isValid = formState.prompt.trim().length > 0 && !isOverLimit;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3.5}>
        {/* Main prompt */}
        <Box>
          <Typography
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
            Describe your logo
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="A modern tech startup logo with abstract geometric shapes representing connectivity and innovation. Clean lines, professional feel..."
            value={formState.prompt}
            onChange={(e) => updateField('prompt', e.target.value)}
            error={isOverLimit}
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                },
              },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 0.75,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isOverLimit ? 'error.main' : 'text.secondary',
                fontWeight: isOverLimit ? 500 : 400,
              }}
            >
              {charCount}/{MAX_PROMPT_LENGTH}
            </Typography>
          </Box>
        </Box>

        {/* App name */}
        <Box>
          <Typography
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
            App Name{' '}
            <Typography
              component="span"
              variant="caption"
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              (optional)
            </Typography>
          </Typography>
          <TextField
            fullWidth
            placeholder="MyApp"
            value={formState.appName}
            onChange={(e) => updateField('appName', e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                },
              },
            }}
          />
        </Box>

        {/* Style selector */}
        <StyleSelector
          value={formState.style}
          onChange={(style: LogoStyle) => updateField('style', style)}
        />

        {/* Color hints */}
        <Box>
          <Typography
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
            Color Preferences{' '}
            <Typography
              component="span"
              variant="caption"
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              (optional)
            </Typography>
          </Typography>
          <TextField
            fullWidth
            placeholder="Blue and white, warm earth tones, vibrant gradients..."
            value={formState.colorHints}
            onChange={(e) => updateField('colorHints', e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                },
              },
            }}
          />
        </Box>

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isValid || isLoading}
          startIcon={
            <GenerateIcon
              sx={{
                animation: isLoading ? 'pulse 1.5s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
          }
          sx={{
            mt: 1,
            py: 1.75,
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              boxShadow: '0 0 35px rgba(99, 102, 241, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: '#262626',
              boxShadow: 'none',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isLoading ? 'Forging...' : 'Generate Logo'}
        </Button>
      </Stack>
    </Box>
  );
}
