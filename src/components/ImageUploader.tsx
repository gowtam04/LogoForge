'use client';

import { useCallback, useRef, useState } from 'react';
import { Box, Typography, IconButton, alpha } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  AddPhotoAlternate as AddIcon,
} from '@mui/icons-material';

interface ImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function ImageUploader({
  images,
  onChange,
  maxImages = 3,
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) =>
        ACCEPTED_TYPES.includes(file.type)
      );

      const newImages = [...images, ...validFiles].slice(0, maxImages);
      onChange(newImages);
    },
    [images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = images.length < maxImages;

  return (
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
        Reference Images ({images.length}/{maxImages})
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Image previews */}
      {images.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          {images.map((file, index) => (
            <Box
              key={`${file.name}-${index}`}
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #262626',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#404040',
                  '& .remove-btn': {
                    opacity: 1,
                  },
                },
              }}
            >
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                alt={`Reference ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                className="remove-btn"
                size="small"
                onClick={() => handleRemove(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: '#ef4444',
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}

          {/* Add more button */}
          {canAddMore && (
            <Box
              onClick={handleClick}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '12px',
                border: '2px dashed #262626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              <AddIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
            </Box>
          )}
        </Box>
      )}

      {/* Drop zone */}
      {images.length === 0 && (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          sx={{
            border: '2px dashed',
            borderColor: isDragOver ? '#6366f1' : '#262626',
            borderRadius: '16px',
            padding: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragOver
              ? alpha('#6366f1', 0.08)
              : 'transparent',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: '#404040',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
            },
            ...(isDragOver && {
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)',
            }),
          }}
        >
          {/* Decorative gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
              opacity: isDragOver ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: isDragOver
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #262626 0%, #171717 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transition: 'all 0.3s ease',
                boxShadow: isDragOver
                  ? '0 0 25px rgba(99, 102, 241, 0.4)'
                  : 'none',
              }}
            >
              <UploadIcon
                sx={{
                  fontSize: 28,
                  color: isDragOver ? '#fff' : 'text.secondary',
                  transition: 'color 0.3s ease',
                }}
              />
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                mb: 0.5,
                color: isDragOver ? '#818cf8' : 'text.primary',
              }}
            >
              {isDragOver ? 'Drop to upload' : 'Drop images here'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              or click to browse • PNG, JPG, WebP
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
