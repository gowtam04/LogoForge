'use client';

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  alpha,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { GeneratedLogo } from '@/types';

interface LogoPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  logo: GeneratedLogo | null;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export default function LogoPreviewDialog({
  open,
  onClose,
  logo,
  onSelect,
  isSelected = false,
}: LogoPreviewDialogProps) {
  if (!logo) return null;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(logo.id);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: alpha('#6366f1', 0.2),
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${alpha('#6366f1', 0.15)}, 0 25px 50px -12px ${alpha('#000', 0.5)}`,
        },
      }}
    >
      {/* Header with close button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${alpha('#6366f1', 0.05)} 0%, ${alpha('#8b5cf6', 0.05)} 100%)`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #ededed 0%, #a1a1aa 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Logo Preview
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Logo preview area */}
      <DialogContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          minHeight: 400,
          backgroundColor: '#0f0f0f',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 20% 20%, ${alpha('#6366f1', 0.08)} 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${alpha('#8b5cf6', 0.08)} 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Checkered background pattern for transparency */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 2,
              overflow: 'hidden',
              background: `
                repeating-conic-gradient(
                  #1a1a1a 0% 25%,
                  #252525 0% 50%
                )
                50% / 20px 20px
              `,
              opacity: 0.5,
            }}
          />
          <Box
            component="img"
            src={`data:${logo.mimeType};base64,${logo.base64}`}
            alt="Logo preview"
            sx={{
              position: 'relative',
              maxWidth: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: `0 20px 40px ${alpha('#000', 0.4)}`,
            }}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 2,
          background: `linear-gradient(180deg, ${alpha('#171717', 0.8)} 0%, ${alpha('#171717', 1)} 100%)`,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: alpha('#fff', 0.2),
            color: 'text.secondary',
            px: 3,
            '&:hover': {
              borderColor: alpha('#fff', 0.4),
              backgroundColor: alpha('#fff', 0.05),
            },
          }}
        >
          Close
        </Button>
        {onSelect && (
          <Button
            onClick={handleSelect}
            variant="contained"
            startIcon={<CheckIcon />}
            disabled={isSelected}
            sx={{
              background: isSelected
                ? alpha('#22c55e', 0.2)
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: isSelected ? '#22c55e' : 'white',
              px: 3,
              boxShadow: isSelected ? 'none' : `0 4px 20px ${alpha('#6366f1', 0.4)}`,
              '&:hover': {
                background: isSelected
                  ? alpha('#22c55e', 0.2)
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: isSelected ? 'none' : 'translateY(-1px)',
                boxShadow: isSelected ? 'none' : `0 6px 25px ${alpha('#6366f1', 0.5)}`,
              },
              '&:disabled': {
                background: alpha('#22c55e', 0.2),
                color: '#22c55e',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isSelected ? 'Selected' : 'Select This Logo'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
