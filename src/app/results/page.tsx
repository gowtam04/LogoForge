'use client';

import { useState, useCallback, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  alpha,
  Fade,
  LinearProgress,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import EditIcon from '@mui/icons-material/Edit';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LogoGrid from '@/components/LogoGrid';
import LogoPreviewDialog from '@/components/LogoPreviewDialog';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { GeneratedLogo, GenerationResponse, GenerationRequest } from '@/types';

const STORAGE_KEY = 'generationResult';
const SELECTED_LOGO_KEY = 'selectedLogo';
const REQUEST_STORAGE_KEY = 'generationRequest';

// Custom hook for reading sessionStorage using useSyncExternalStore
function useSessionStorage<T>(key: string): T | null {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    []
  );

  const getSnapshot = useCallback(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item;
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!rawValue) return null;
    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return null;
    }
  }, [rawValue]);
}

export default function ResultsPage() {
  const router = useRouter();

  // Read generation result from sessionStorage using sync external store
  const generationResult = useSessionStorage<GenerationResponse>(STORAGE_KEY);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<GeneratedLogo | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [localGenerationResult, setLocalGenerationResult] = useState<GenerationResponse | null>(null);

  // Sync local state with sessionStorage on mount
  useEffect(() => {
    if (generationResult && !localGenerationResult) {
      setLocalGenerationResult(generationResult);
    }
  }, [generationResult, localGenerationResult]);

  // Handle initial loading state and check for results
  useEffect(() => {
    // Small delay to ensure sessionStorage is checked
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!generationResult) {
        setShowEmptyState(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [generationResult]);

  // Use local state if available, otherwise fall back to sessionStorage
  const activeResult = localGenerationResult || generationResult;

  // Compute the effective selected ID - use first logo if none selected
  const effectiveSelectedId = useMemo(() => {
    if (selectedId) return selectedId;
    return activeResult?.logos?.[0]?.id ?? null;
  }, [selectedId, activeResult]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handlePreview = useCallback((logo: GeneratedLogo) => {
    setPreviewLogo(logo);
    setIsPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  const handleSelectFromPreview = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleRegenerateAll = useCallback(async () => {
    // Get stored request data
    const storedRequest = sessionStorage.getItem(REQUEST_STORAGE_KEY);
    if (!storedRequest) {
      // No stored request, fall back to navigating to create page
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SELECTED_LOGO_KEY);
      router.push('/create');
      return;
    }

    setIsRegenerating(true);
    setRegenerateError(null);
    setSelectedId(null); // Reset selection

    try {
      const requestData: GenerationRequest = JSON.parse(storedRequest);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate logos');
      }

      const result: GenerationResponse = await response.json();

      // Update both local state and sessionStorage
      setLocalGenerationResult(result);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      sessionStorage.removeItem(SELECTED_LOGO_KEY);
    } catch (err) {
      setRegenerateError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsRegenerating(false);
    }
  }, [router]);

  const handleEditPrompt = useCallback(() => {
    // Navigate to create page - request data stays in sessionStorage
    router.push('/create');
  }, [router]);

  const handleExportIcons = useCallback(() => {
    if (!effectiveSelectedId || !activeResult) return;

    // Find the selected logo
    const logo = activeResult.logos.find((l) => l.id === effectiveSelectedId);
    if (!logo) return;

    // Store selected logo in sessionStorage for export page
    sessionStorage.setItem(SELECTED_LOGO_KEY, JSON.stringify(logo));
    router.push('/export');
  }, [effectiveSelectedId, activeResult, router]);

  // Memoize logos array for stability
  const logos = useMemo(() => activeResult?.logos ?? [], [activeResult]);

  // Loading state while checking sessionStorage
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
        <Box sx={{ flexGrow: 1, pt: { xs: 12, md: 14 }, pb: 8 }}>
          <Container maxWidth="lg">
            {/* Loading header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <LoadingSkeleton variant="text" count={2} />
            </Box>
            {/* Loading grid */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4 },
                backgroundColor: alpha('#171717', 0.6),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                mb: 4,
              }}
            >
              <LoadingSkeleton variant="grid" count={4} />
            </Paper>
            {/* Loading buttons */}
            <LoadingSkeleton variant="button" count={2} />
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  // Empty state when no results found
  if (showEmptyState || !activeResult) {
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
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                backgroundColor: alpha('#171717', 0.6),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <EmptyState
                icon={ImageSearchIcon}
                title="No Logos Generated Yet"
                description="Start by creating your brand identity. Generate unique logos with AI and find the perfect design for your project."
                action={{
                  label: 'Create Logo',
                  href: '/create',
                }}
              />
            </Paper>
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
          top: '20%',
          left: '-10%',
          width: '40%',
          height: '40%',
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
          bottom: '10%',
          right: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#f59e0b', 0.05)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Header />

      {/* Regeneration loading bar */}
      {isRegenerating && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 70,
            left: 0,
            right: 0,
            zIndex: 1200,
            height: 3,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1 0%, #f59e0b 50%, #6366f1 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear',
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '200% 0' },
                '100%': { backgroundPosition: '-200% 0' },
              },
            },
          }}
        />
      )}

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
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    backgroundColor: alpha('#6366f1', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#6366f1', 0.2),
                    mb: 2,
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography
                    variant="body2"
                    sx={{ color: 'primary.light', fontWeight: 500 }}
                  >
                    Generation Complete
                  </Typography>
                </Box>

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
                  Choose Your Logo
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 500, mx: 'auto' }}
                >
                  Click to select a logo, click again or double-click to preview.
                  {effectiveSelectedId && ' Selected logo is highlighted.'}
                </Typography>
              </Box>

              {/* Logo grid */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 4 },
                  backgroundColor: alpha('#171717', 0.6),
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  mb: 4,
                }}
              >
                <LogoGrid
                  logos={logos}
                  selectedId={effectiveSelectedId}
                  onSelect={handleSelect}
                  onPreview={handlePreview}
                />
              </Paper>

              {/* Error alert */}
              {regenerateError && (
                <Alert
                  severity="error"
                  onClose={() => setRegenerateError(null)}
                  sx={{
                    mb: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  {regenerateError}
                </Alert>
              )}

              {/* Action buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRegenerateAll}
                  disabled={isRegenerating}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: alpha('#fff', 0.2),
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: alpha('#fff', 0.4),
                      backgroundColor: alpha('#fff', 0.05),
                      color: 'text.primary',
                    },
                    '&:disabled': {
                      borderColor: alpha('#fff', 0.1),
                      color: alpha('#fff', 0.3),
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate All'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditPrompt}
                  disabled={isRegenerating}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: alpha('#fff', 0.2),
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: alpha('#fff', 0.4),
                      backgroundColor: alpha('#fff', 0.05),
                      color: 'text.primary',
                    },
                    '&:disabled': {
                      borderColor: alpha('#fff', 0.1),
                      color: alpha('#fff', 0.3),
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Edit Prompt
                </Button>

                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportIcons}
                  disabled={!effectiveSelectedId || isRegenerating}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: effectiveSelectedId && !isRegenerating
                      ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                      : undefined,
                    boxShadow: effectiveSelectedId && !isRegenerating
                      ? `0 4px 20px ${alpha('#f59e0b', 0.4)}`
                      : 'none',
                    '&:hover': {
                      background: effectiveSelectedId && !isRegenerating
                        ? 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)'
                        : undefined,
                      transform: effectiveSelectedId && !isRegenerating ? 'translateY(-2px)' : 'none',
                      boxShadow: effectiveSelectedId && !isRegenerating
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
                  Export Icons
                </Button>
              </Stack>

              {/* Hint text */}
              {!effectiveSelectedId && !isRegenerating && (
                <Fade in>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', mt: 2 }}
                  >
                    Select a logo above to enable export
                  </Typography>
                </Fade>
              )}

              {/* Regeneration loading message */}
              {isRegenerating && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      animation: 'fadeInOut 2s ease-in-out infinite',
                      '@keyframes fadeInOut': {
                        '0%, 100%': { opacity: 0.5 },
                        '50%': { opacity: 1 },
                      },
                    }}
                  >
                    Forging new logos... This may take a moment.
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>

      <Footer />

      {/* Preview dialog */}
      <LogoPreviewDialog
        open={isPreviewOpen}
        onClose={handleClosePreview}
        logo={previewLogo}
        onSelect={handleSelectFromPreview}
        isSelected={previewLogo?.id === effectiveSelectedId}
      />
    </Box>
  );
}
