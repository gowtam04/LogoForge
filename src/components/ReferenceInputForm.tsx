'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material';
import { AutoAwesome as GenerateIcon } from '@mui/icons-material';
import StyleSelector from './StyleSelector';
import ImageUploader from './ImageUploader';
import { ReferenceFormState, LogoStyle } from '@/types';

interface ReferenceInitialValues {
  prompt: string;
  style: string;
  images: string[]; // Base64 data URLs
}

interface ReferenceInputFormProps {
  onSubmit: (data: ReferenceFormState) => void;
  isLoading?: boolean;
  initialValues?: ReferenceInitialValues;
}

// Convert base64 data URL to File object
async function base64ToFile(base64DataUrl: string, index: number): Promise<File> {
  const response = await fetch(base64DataUrl);
  const blob = await response.blob();
  const extension = blob.type.split('/')[1] || 'png';
  return new File([blob], `reference-${index + 1}.${extension}`, { type: blob.type });
}

// Helper to create initial form state (without images, those are loaded async)
function createInitialFormState(initialValues?: ReferenceInitialValues): ReferenceFormState {
  return {
    images: [],
    prompt: initialValues?.prompt || '',
    style: (initialValues?.style as LogoStyle) || 'any',
  };
}

export default function ReferenceInputForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: ReferenceInputFormProps) {
  // Create a stable key for sync values (prompt and style)
  const syncKey = useMemo(
    () => initialValues ? `${initialValues.prompt}-${initialValues.style}` : 'default',
    [initialValues]
  );

  const [formState, setFormState] = useState<ReferenceFormState>(() =>
    createInitialFormState(initialValues)
  );

  // Reset form state when initialValues change (sync values only)
  const [prevSyncKey, setPrevSyncKey] = useState(syncKey);
  if (prevSyncKey !== syncKey) {
    setPrevSyncKey(syncKey);
    setFormState(createInitialFormState(initialValues));
  }

  // Track if we've loaded images for the current initialValues
  const loadedImagesKey = useRef<string | null>(null);
  const initialImages = initialValues?.images;
  const imagesKey = useMemo(
    () => initialImages ? JSON.stringify(initialImages) : null,
    [initialImages]
  );

  // Load base64 images asynchronously (only when images change)
  useEffect(() => {
    if (imagesKey && imagesKey !== loadedImagesKey.current && initialImages?.length) {
      loadedImagesKey.current = imagesKey;

      Promise.all(
        initialImages.map((base64, index) => base64ToFile(base64, index))
      ).then((files) => {
        setFormState((prev) => ({
          ...prev,
          images: files,
        }));
      });
    }
  }, [imagesKey, initialImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.images.length > 0 && !isLoading) {
      onSubmit(formState);
    }
  };

  const updateField = <K extends keyof ReferenceFormState>(
    field: K,
    value: ReferenceFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = formState.images.length > 0;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3.5}>
        {/* Image uploader */}
        <ImageUploader
          images={formState.images}
          onChange={(images) => updateField('images', images)}
          maxImages={3}
        />

        {/* Guidance text */}
        {formState.images.length > 0 && (
          <Alert
            severity="info"
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: 'text.primary',
              '& .MuiAlert-icon': {
                color: '#818cf8',
              },
            }}
          >
            <Typography variant="body2">
              The AI will analyze your reference images and create logos inspired by
              their style, colors, and composition.
            </Typography>
          </Alert>
        )}

        {/* Additional prompt */}
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
            Additional Instructions{' '}
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
            multiline
            rows={3}
            placeholder="Make it more minimalist, use only the color palette from the first image, add a gradient effect..."
            value={formState.prompt}
            onChange={(e) => updateField('prompt', e.target.value)}
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
          {isLoading ? 'Forging...' : 'Generate from References'}
        </Button>
      </Stack>
    </Box>
  );
}
