'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  TextField,
  Button,
  Stack,
  CircularProgress,
  alpha,
  Fade,
  Divider,
  InputAdornment,
} from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import LanguageIcon from '@mui/icons-material/Language';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { useSessionStorage } from '@/lib/hooks';
import { STORAGE_KEYS } from '@/lib/constants';
import { GeneratedLogo, ExportPlatform } from '@/types';

// Platform configuration with icons and descriptions
const PLATFORMS = [
  {
    id: 'ios' as ExportPlatform,
    label: 'iOS',
    description: 'Xcode-ready AppIcon.appiconset',
    icon: AppleIcon,
  },
  {
    id: 'android' as ExportPlatform,
    label: 'Android',
    description: 'Mipmap folders + Play Store icon',
    icon: AndroidIcon,
  },
  {
    id: 'web' as ExportPlatform,
    label: 'Web',
    description: 'Favicons + PWA manifest icons',
    icon: LanguageIcon,
  },
];

// Checkered background pattern for transparency preview
const checkeredBackground = `
  linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
  linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
  linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
`;

export default function ExportPage() {
  // Read selected logo from sessionStorage
  const selectedLogo = useSessionStorage<GeneratedLogo>(STORAGE_KEYS.SELECTED_LOGO);

  // State for export options
  const [selectedPlatforms, setSelectedPlatforms] = useState<ExportPlatform[]>([
    'ios',
    'android',
    'web',
  ]);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [padding, setPadding] = useState<number>(10);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Handle initial loading state and check for selected logo
  useEffect(() => {
    // Small delay to ensure sessionStorage is checked
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!selectedLogo) {
        setShowEmptyState(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedLogo]);

  // Handle platform checkbox change
  const handlePlatformChange = useCallback((platform: ExportPlatform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      }
      return [...prev, platform];
    });
  }, []);

  // Handle padding slider change
  const handlePaddingChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      setPadding(newValue as number);
    },
    []
  );

  // Handle background color change
  const handleBackgroundColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBackgroundColor(event.target.value);
    },
    []
  );

  // Handle export
  const handleExport = useCallback(async () => {
    if (!selectedLogo || selectedPlatforms.length === 0) return;

    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoBase64: selectedLogo.base64,
          platforms: selectedPlatforms,
          backgroundColor: backgroundColor || undefined,
          padding,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Export failed');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'logoforge-icons.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedLogo, selectedPlatforms, backgroundColor, padding]);

  // Check if export is disabled
  const isExportDisabled = useMemo(
    () => selectedPlatforms.length === 0 || isExporting,
    [selectedPlatforms, isExporting]
  );

  // Show loading state while checking for logo
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
        className="page-fade-in"
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 12, md: 14 },
            pb: 8,
          }}
        >
          <Container maxWidth="lg">
            {/* Loading header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <LoadingSkeleton variant="text" count={2} />
            </Box>
            {/* Loading grid */}
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Card
                  sx={{
                    backgroundColor: alpha('#171717', 0.8),
                    border: '1px solid',
                    borderColor: alpha('#262626', 1),
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    height: '100%',
                    minHeight: 350,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LoadingSkeleton variant="card" count={1} />
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Card
                  sx={{
                    backgroundColor: alpha('#171717', 0.8),
                    border: '1px solid',
                    borderColor: alpha('#262626', 1),
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    p: 4,
                  }}
                >
                  <LoadingSkeleton variant="text" count={8} />
                  <Box sx={{ mt: 4 }}>
                    <LoadingSkeleton variant="button" count={1} />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  // Empty state when no logo selected
  if (showEmptyState || !selectedLogo) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
        className="page-fade-in"
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 12, md: 14 },
            pb: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="md">
            <Card
              sx={{
                backgroundColor: alpha('#171717', 0.8),
                border: '1px solid',
                borderColor: alpha('#262626', 1),
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <EmptyState
                icon={ImageNotSupportedIcon}
                title="No Logo Selected"
                description="Select a logo from your generated results to export it as platform-ready icons for iOS, Android, and Web."
                action={{
                  label: 'View Results',
                  href: '/results',
                }}
              />
            </Card>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <Box
        sx={{
          position: 'fixed',
          top: '15%',
          left: '-5%',
          width: '35%',
          height: '35%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#6366f1', 0.08)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '20%',
          right: '-10%',
          width: '45%',
          height: '45%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#f59e0b', 0.06)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Header />

      {/* Main content */}
      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          pt: { xs: 12, md: 14 },
          pb: 8,
          position: 'relative',
          zIndex: 1,
        }}
        className="page-fade-in"
      >
        <Container maxWidth="lg">
          <Fade in timeout={600}>
            <Box>
              {/* Page header */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    background: 'linear-gradient(135deg, #ededed 0%, #a1a1aa 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Export Your Icons
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 500, mx: 'auto' }}
                >
                  Customize your icon bundle and download platform-ready assets.
                </Typography>
              </Box>

              {/* Main grid layout */}
              <Grid container spacing={4}>
                {/* Left column - Logo Preview */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Card
                    sx={{
                      backgroundColor: alpha('#171717', 0.8),
                      border: '1px solid',
                      borderColor: alpha('#262626', 1),
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 3,
                          color: 'text.primary',
                        }}
                      >
                        Preview
                      </Typography>

                      {/* Logo preview with checkered background */}
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: 280,
                          aspectRatio: '1 / 1',
                          mx: 'auto',
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: alpha('#fff', 0.1),
                          position: 'relative',
                        }}
                      >
                        {/* Checkered background */}
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: checkeredBackground,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                            backgroundColor: '#1a1a1a',
                          }}
                        />

                        {/* Logo image */}
                        <Box
                          component="img"
                          src={`data:${selectedLogo.mimeType};base64,${selectedLogo.base64}`}
                          alt="Selected logo"
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            p: `${padding}%`,
                          }}
                        />
                      </Box>

                      {/* Selected indicator */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mt: 3 }}
                      >
                        <CheckCircleIcon
                          sx={{ fontSize: 18, color: 'success.main' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Logo selected from results
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Right column - Export Options */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Card
                    sx={{
                      backgroundColor: alpha('#171717', 0.8),
                      border: '1px solid',
                      borderColor: alpha('#262626', 1),
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      {/* Platform Selection */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: 'text.primary',
                        }}
                      >
                        Select Platforms
                      </Typography>

                      <FormGroup>
                        {PLATFORMS.map((platform) => {
                          const Icon = platform.icon;
                          const isChecked = selectedPlatforms.includes(platform.id);

                          return (
                            <FormControlLabel
                              key={platform.id}
                              control={
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => handlePlatformChange(platform.id)}
                                  sx={{
                                    color: alpha('#fff', 0.3),
                                    '&.Mui-checked': {
                                      color: '#6366f1',
                                    },
                                  }}
                                />
                              }
                              label={
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Icon
                                    sx={{
                                      fontSize: 24,
                                      color: isChecked
                                        ? 'primary.light'
                                        : 'text.secondary',
                                      transition: 'color 0.2s ease',
                                    }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 500,
                                        color: isChecked
                                          ? 'text.primary'
                                          : 'text.secondary',
                                        transition: 'color 0.2s ease',
                                      }}
                                    >
                                      {platform.label}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      {platform.description}
                                    </Typography>
                                  </Box>
                                </Stack>
                              }
                              sx={{
                                mx: 0,
                                py: 1.5,
                                px: 2,
                                borderRadius: 2,
                                mb: 1,
                                backgroundColor: isChecked
                                  ? alpha('#6366f1', 0.08)
                                  : 'transparent',
                                border: '1px solid',
                                borderColor: isChecked
                                  ? alpha('#6366f1', 0.3)
                                  : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: isChecked
                                    ? alpha('#6366f1', 0.12)
                                    : alpha('#fff', 0.02),
                                },
                              }}
                            />
                          );
                        })}
                      </FormGroup>

                      <Divider sx={{ my: 3, borderColor: alpha('#fff', 0.08) }} />

                      {/* Background Color */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        Background Color
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        For non-transparent contexts (leave empty for transparent)
                      </Typography>

                      <TextField
                        fullWidth
                        placeholder="#ffffff"
                        value={backgroundColor}
                        onChange={handleBackgroundColorChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 1,
                                  border: '2px solid',
                                  borderColor: alpha('#fff', 0.2),
                                  backgroundColor: backgroundColor || 'transparent',
                                  backgroundImage: !backgroundColor
                                    ? checkeredBackground
                                    : 'none',
                                  backgroundSize: '8px 8px',
                                  backgroundPosition:
                                    '0 0, 0 4px, 4px -4px, -4px 0px',
                                }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: backgroundColor && (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                onClick={() => setBackgroundColor('')}
                                sx={{
                                  minWidth: 'auto',
                                  px: 1,
                                  color: 'text.secondary',
                                  '&:hover': {
                                    color: 'text.primary',
                                  },
                                }}
                              >
                                Clear
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: alpha('#0a0a0a', 0.5),
                          },
                        }}
                      />

                      <Divider sx={{ my: 3, borderColor: alpha('#fff', 0.08) }} />

                      {/* Padding Slider */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        Safe Area Padding
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Add padding around your logo for better visibility
                      </Typography>

                      <Box sx={{ px: 1 }}>
                        <Slider
                          value={padding}
                          onChange={handlePaddingChange}
                          min={0}
                          max={20}
                          step={1}
                          marks={[
                            { value: 0, label: '0%' },
                            { value: 10, label: '10%' },
                            { value: 20, label: '20%' },
                          ]}
                          valueLabelDisplay="on"
                          valueLabelFormat={(value) => `${value}%`}
                          sx={{
                            color: '#6366f1',
                            '& .MuiSlider-track': {
                              background:
                                'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                              border: 'none',
                            },
                            '& .MuiSlider-thumb': {
                              backgroundColor: '#fff',
                              border: '2px solid #6366f1',
                              '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0 0 0 8px ${alpha('#6366f1', 0.2)}`,
                              },
                            },
                            '& .MuiSlider-rail': {
                              backgroundColor: alpha('#fff', 0.1),
                            },
                            '& .MuiSlider-mark': {
                              backgroundColor: alpha('#fff', 0.3),
                            },
                            '& .MuiSlider-markLabel': {
                              color: 'text.secondary',
                              fontSize: '0.75rem',
                            },
                            '& .MuiSlider-valueLabel': {
                              backgroundColor: '#6366f1',
                              borderRadius: 1,
                            },
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 3, borderColor: alpha('#fff', 0.08) }} />

                      {/* Error message */}
                      {exportError && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'error.main',
                            mb: 2,
                            textAlign: 'center',
                          }}
                        >
                          {exportError}
                        </Typography>
                      )}

                      {/* Download Button */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={
                          isExporting ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <FileDownloadIcon />
                          )
                        }
                        onClick={handleExport}
                        disabled={isExportDisabled}
                        sx={{
                          py: 1.75,
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: !isExportDisabled
                            ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                            : undefined,
                          boxShadow: !isExportDisabled
                            ? `0 4px 20px ${alpha('#f59e0b', 0.4)}`
                            : 'none',
                          '&:hover': {
                            background: !isExportDisabled
                              ? 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)'
                              : undefined,
                            transform: !isExportDisabled
                              ? 'translateY(-2px)'
                              : 'none',
                            boxShadow: !isExportDisabled
                              ? `0 6px 25px ${alpha('#f59e0b', 0.5)}`
                              : 'none',
                          },
                          '&:disabled': {
                            backgroundColor: alpha('#fff', 0.1),
                            color: alpha('#fff', 0.3),
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isExporting
                          ? 'Preparing Download...'
                          : `Download ${selectedPlatforms.length > 0 ? `(${selectedPlatforms.length} Platform${selectedPlatforms.length > 1 ? 's' : ''})` : 'All Selected'}`}
                      </Button>

                      {/* Platform count hint */}
                      {selectedPlatforms.length === 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'center', mt: 2 }}
                        >
                          Select at least one platform to download
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
