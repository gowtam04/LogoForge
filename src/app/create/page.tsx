'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  TextFields as TextIcon,
  Collections as ReferenceIcon,
  SmartToy as AgentIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TextInputForm from '@/components/TextInputForm';
import ReferenceInputForm from '@/components/ReferenceInputForm';
import AgentInputForm from '@/components/AgentInputForm';
import { TextFormState, ReferenceFormState, GenerationRequest } from '@/types';

const REQUEST_STORAGE_KEY = 'generationRequest';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{
        opacity: value === index ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </Box>
  );
}

// Initial values for pre-filling forms from stored request
interface TextInitialValues {
  prompt: string;
  appName: string;
  style: string;
  colorHints: string;
}

interface ReferenceInitialValues {
  prompt: string;
  style: string;
  images: string[]; // Base64 images
}

export default function CreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInitialValues, setTextInitialValues] = useState<TextInitialValues | undefined>(undefined);
  const [referenceInitialValues, setReferenceInitialValues] = useState<ReferenceInitialValues | undefined>(undefined);

  // Load stored request data on mount
  useEffect(() => {
    const storedRequest = sessionStorage.getItem(REQUEST_STORAGE_KEY);
    if (storedRequest) {
      try {
        const requestData: GenerationRequest = JSON.parse(storedRequest);

        if (requestData.mode === 'text') {
          setActiveTab(0);
          setTextInitialValues({
            prompt: requestData.prompt,
            appName: requestData.options.appName || '',
            style: requestData.options.style,
            colorHints: requestData.options.colorHints || '',
          });
        } else if (requestData.mode === 'reference') {
          setActiveTab(1);
          setReferenceInitialValues({
            prompt: requestData.prompt === 'Create a logo inspired by these reference images' ? '' : requestData.prompt,
            style: requestData.options.style,
            images: requestData.images || [],
          });
        }
      } catch {
        // Invalid stored data, ignore
      }
    }
  }, []);

  const handleTextSubmit = async (data: TextFormState) => {
    setIsLoading(true);
    setError(null);

    try {
      // Store request data for regeneration/editing
      const requestData: GenerationRequest = {
        mode: 'text',
        prompt: data.prompt,
        options: {
          style: data.style,
          appName: data.appName || undefined,
          colorHints: data.colorHints || undefined,
        },
      };
      sessionStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requestData));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate logo');
      }

      const result = await response.json();
      // Store result in sessionStorage for the results page
      sessionStorage.setItem('generationResult', JSON.stringify(result));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceSubmit = async (data: ReferenceFormState) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert images to base64
      const imagePromises = data.images.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      // Store request data for regeneration/editing
      const requestData: GenerationRequest = {
        mode: 'reference',
        prompt: data.prompt || 'Create a logo inspired by these reference images',
        images: base64Images,
        options: {
          style: data.style,
        },
      };
      sessionStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requestData));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate logo');
      }

      const result = await response.json();
      sessionStorage.setItem('generationResult', JSON.stringify(result));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '30%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Header />

      {/* Loading bar */}
      {isLoading && (
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 12, md: 14 },
          pb: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm">
          {/* Page header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                mb: 1.5,
              }}
            >
              Create Your Logo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Describe your vision, upload references, or let AI guide you.
            </Typography>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                mb: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Main card */}
          <Card
            sx={{
              backgroundColor: 'rgba(23, 23, 23, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #262626',
              boxShadow: '0 4px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{
                  borderBottom: '1px solid #262626',
                  mb: 1,
                  '& .MuiTab-root': {
                    py: 2,
                    minHeight: 56,
                    color: 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    },
                    '&.Mui-selected': {
                      color: '#818cf8',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                  },
                }}
              >
                <Tab
                  icon={<TextIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Describe with Text"
                  disabled={isLoading}
                />
                <Tab
                  icon={<ReferenceIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Upload References"
                  disabled={isLoading}
                />
                <Tab
                  icon={<AgentIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="AI Interview"
                  disabled={isLoading}
                />
              </Tabs>

              {/* Tab panels */}
              <TabPanel value={activeTab} index={0}>
                <TextInputForm
                  onSubmit={handleTextSubmit}
                  isLoading={isLoading}
                  initialValues={textInitialValues}
                />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <ReferenceInputForm
                  onSubmit={handleReferenceSubmit}
                  isLoading={isLoading}
                  initialValues={referenceInitialValues}
                />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <AgentInputForm
                  onSubmit={handleTextSubmit}
                  isLoading={isLoading}
                />
              </TabPanel>
            </CardContent>
          </Card>

          {/* Loading message */}
          {isLoading && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
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
                Forging your logo... This may take a moment.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
