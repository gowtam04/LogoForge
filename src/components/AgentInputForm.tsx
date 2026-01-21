'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  AutoAwesome as GenerateIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  SkipNext as SkipIcon,
} from '@mui/icons-material';
import ConversationSummary from './agent/ConversationSummary';
import { STORAGE_KEYS } from '@/lib/constants';
import type {
  TextFormState,
  LogoStyle,
  AgentInitialValues,
  AgentInterviewResponse,
  AgentFinalizeResponse,
  InterviewQuestion,
} from '@/types';

interface AgentInputFormProps {
  onSubmit: (data: TextFormState) => void;
  isLoading?: boolean;
  initialValues?: AgentInitialValues;
}

const MAX_ANSWER_LENGTH = 200;

interface WizardState {
  currentStep: number;
  questions: string[];
  answers: string[];
  isLoadingQuestion: boolean;
  isLoadingFinalize: boolean;
  finalData: AgentFinalizeResponse | null;
  error: string | null;
}

const initialWizardState: WizardState = {
  currentStep: 0,
  questions: [],
  answers: [],
  isLoadingQuestion: false,
  isLoadingFinalize: false,
  finalData: null,
  error: null,
};

export default function AgentInputForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: AgentInputFormProps) {
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    // Try to restore from sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEYS.AGENT_WIZARD_STATE);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Invalid stored data
        }
      }
    }

    // Use initial values if provided
    if (initialValues?.questions && initialValues?.answers) {
      return {
        ...initialWizardState,
        questions: initialValues.questions,
        answers: initialValues.answers,
        currentStep: initialValues.questions.length,
      };
    }

    return initialWizardState;
  });

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  // Persist state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.AGENT_WIZARD_STATE, JSON.stringify(wizardState));
    }
  }, [wizardState]);

  // Fetch the first question on mount if we don't have any
  useEffect(() => {
    if (wizardState.questions.length === 0 && !wizardState.isLoadingQuestion) {
      fetchNextQuestion([], [], 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNextQuestion = useCallback(async (
    questions: string[],
    answers: string[],
    step: number
  ) => {
    setWizardState(prev => ({ ...prev, isLoadingQuestion: true, error: null }));

    try {
      const previousAnswers: InterviewQuestion[] = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || '',
      }));

      const response = await fetch('/api/agent/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousAnswers,
          currentStep: step,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get next question');
      }

      const data: AgentInterviewResponse = await response.json();

      setWizardState(prev => ({
        ...prev,
        questions: [...prev.questions, data.question],
        isLoadingQuestion: false,
      }));
      setIsLastQuestion(data.isLastQuestion);
    } catch (error) {
      setWizardState(prev => ({
        ...prev,
        isLoadingQuestion: false,
        error: error instanceof Error ? error.message : 'Failed to get question',
      }));
    }
  }, []);

  const fetchFinalPrompt = useCallback(async (
    questions: string[],
    answers: string[]
  ) => {
    setWizardState(prev => ({ ...prev, isLoadingFinalize: true, error: null }));

    try {
      const answerData: InterviewQuestion[] = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || '',
      }));

      const response = await fetch('/api/agent/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data: AgentFinalizeResponse = await response.json();

      setWizardState(prev => ({
        ...prev,
        finalData: data,
        isLoadingFinalize: false,
      }));
    } catch (error) {
      setWizardState(prev => ({
        ...prev,
        isLoadingFinalize: false,
        error: error instanceof Error ? error.message : 'Failed to generate prompt',
      }));
    }
  }, []);

  const handleContinue = async () => {
    // Save the current answer
    const newAnswers = [...wizardState.answers];
    newAnswers[wizardState.currentStep] = currentAnswer.trim();
    const newStep = wizardState.currentStep + 1;

    setWizardState(prev => ({
      ...prev,
      answers: newAnswers,
      currentStep: newStep,
    }));
    setCurrentAnswer('');

    // Pass fresh state directly to avoid stale closure
    if (isLastQuestion) {
      fetchFinalPrompt(wizardState.questions, newAnswers);
    } else {
      fetchNextQuestion(wizardState.questions, newAnswers, newStep);
    }
  };

  const handleSkip = async () => {
    // Save empty answer for skipped question
    const newAnswers = [...wizardState.answers];
    newAnswers[wizardState.currentStep] = '';
    const newStep = wizardState.currentStep + 1;

    setWizardState(prev => ({
      ...prev,
      answers: newAnswers,
      currentStep: newStep,
    }));
    setCurrentAnswer('');

    // Pass fresh state directly to avoid stale closure
    if (isLastQuestion) {
      fetchFinalPrompt(wizardState.questions, newAnswers);
    } else {
      fetchNextQuestion(wizardState.questions, newAnswers, newStep);
    }
  };

  const handleBack = () => {
    if (wizardState.currentStep > 0) {
      setWizardState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        finalData: null, // Clear final data when going back
      }));
      setCurrentAnswer(wizardState.answers[wizardState.currentStep - 1] || '');
    }
  };

  const handleEditAnswer = (index: number, newAnswer: string) => {
    const newAnswers = [...wizardState.answers];
    newAnswers[index] = newAnswer;
    setWizardState(prev => ({
      ...prev,
      answers: newAnswers,
      finalData: null, // Invalidate final data when editing
    }));
  };

  const handleEditPrompt = (newPrompt: string) => {
    if (wizardState.finalData) {
      setWizardState(prev => ({
        ...prev,
        finalData: {
          ...prev.finalData!,
          prompt: newPrompt,
        },
      }));
    }
  };

  const handleGenerate = () => {
    if (wizardState.finalData) {
      const formData: TextFormState = {
        prompt: wizardState.finalData.prompt,
        appName: wizardState.finalData.appName || '',
        style: wizardState.finalData.style as LogoStyle,
        colorHints: wizardState.finalData.colorHints || '',
      };

      // Clear the wizard state
      sessionStorage.removeItem(STORAGE_KEYS.AGENT_WIZARD_STATE);

      onSubmit(formData);
    }
  };

  const handleStartOver = () => {
    sessionStorage.removeItem(STORAGE_KEYS.AGENT_WIZARD_STATE);
    setWizardState(initialWizardState);
    setCurrentAnswer('');
    setIsLastQuestion(false);
    // Fetch first question with empty state
    fetchNextQuestion([], [], 0);
  };

  const charCount = currentAnswer.length;
  const isOverLimit = charCount > MAX_ANSWER_LENGTH;
  const isInSummaryStep = wizardState.currentStep >= wizardState.questions.length && wizardState.questions.length > 0;
  const totalSteps = wizardState.questions.length + 1; // +1 for summary step

  // Regenerate final prompt when coming back to summary after editing
  useEffect(() => {
    if (isInSummaryStep && !wizardState.finalData && !wizardState.isLoadingFinalize) {
      fetchFinalPrompt(wizardState.questions, wizardState.answers);
    }
  }, [isInSummaryStep, wizardState.finalData, wizardState.isLoadingFinalize, wizardState.questions, wizardState.answers]);

  return (
    <Box>
      <Stack spacing={3.5}>
        {/* Stepper */}
        <Stepper
          activeStep={wizardState.currentStep}
          alternativeLabel
          sx={{
            '& .MuiStepLabel-root': {
              '& .MuiStepLabel-iconContainer': {
                '& .MuiSvgIcon-root': {
                  fontSize: 28,
                },
                '& .Mui-active': {
                  color: '#6366f1',
                },
                '& .Mui-completed': {
                  color: '#22c55e',
                },
              },
            },
            '& .MuiStepConnector-line': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
              borderColor: '#6366f1',
            },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
              borderColor: '#22c55e',
            },
          }}
        >
          {wizardState.questions.map((_, index) => (
            <Step key={index}>
              <StepLabel />
            </Step>
          ))}
          {/* Summary step indicator */}
          <Step key="summary">
            <StepLabel />
          </Step>
        </Stepper>

        {/* Error Alert */}
        {wizardState.error && (
          <Alert
            severity="error"
            onClose={() => setWizardState(prev => ({ ...prev, error: null }))}
            sx={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {wizardState.error}
          </Alert>
        )}

        {/* Loading Question State */}
        {wizardState.isLoadingQuestion && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#6366f1', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Thinking of the next question...
            </Typography>
          </Box>
        )}

        {/* Question Step */}
        {!wizardState.isLoadingQuestion && !isInSummaryStep && wizardState.questions.length > 0 && (
          <>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: 'text.secondary',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                }}
              >
                Question {wizardState.currentStep + 1} of ~{totalSteps - 1}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  lineHeight: 1.4,
                }}
              >
                {wizardState.questions[wizardState.currentStep]}
              </Typography>
            </Box>

            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                error={isOverLimit}
                disabled={isLoading}
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: isOverLimit ? 'error.main' : 'text.secondary',
                    fontWeight: isOverLimit ? 500 : 400,
                  }}
                >
                  {charCount}/{MAX_ANSWER_LENGTH}
                </Typography>
              </Box>
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={handleBack}
                disabled={wizardState.currentStep === 0 || isLoading}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Back
              </Button>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="text"
                  endIcon={<SkipIcon />}
                  onClick={handleSkip}
                  disabled={isLoading}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    },
                  }}
                >
                  Skip
                </Button>

                <Button
                  variant="contained"
                  endIcon={<ForwardIcon />}
                  onClick={handleContinue}
                  disabled={!currentAnswer.trim() || isOverLimit || isLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                    },
                    '&.Mui-disabled': {
                      background: '#262626',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </>
        )}

        {/* Summary Step */}
        {isInSummaryStep && (
          <>
            {wizardState.isLoadingFinalize ? (
              <Box sx={{ py: 4 }}>
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={80}
                    sx={{ mb: 2, borderRadius: 2 }}
                  />
                ))}
                <Skeleton variant="text" width="50%" height={24} sx={{ mt: 3, mb: 1 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Box>
            ) : wizardState.finalData ? (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  Review Your Answers
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Edit any answers or the generated prompt before generating your logo.
                </Typography>

                <ConversationSummary
                  questions={wizardState.questions}
                  answers={wizardState.answers}
                  finalPrompt={wizardState.finalData.prompt}
                  style={wizardState.finalData.style}
                  appName={wizardState.finalData.appName}
                  colorHints={wizardState.finalData.colorHints}
                  onEditAnswer={handleEditAnswer}
                  onEditPrompt={handleEditPrompt}
                />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    startIcon={<BackIcon />}
                    onClick={handleBack}
                    disabled={isLoading}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      },
                    }}
                  >
                    Back to Questions
                  </Button>

                  <Button
                    variant="contained"
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
                    onClick={handleGenerate}
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: '0 0 35px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&.Mui-disabled': {
                        background: '#262626',
                        boxShadow: 'none',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isLoading ? 'Forging...' : 'Generate Logo'}
                  </Button>
                </Box>
              </>
            ) : null}
          </>
        )}

        {/* Start Over Button (always visible) */}
        {wizardState.questions.length > 0 && !wizardState.isLoadingQuestion && (
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            <Button
              variant="text"
              size="small"
              onClick={handleStartOver}
              disabled={isLoading}
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                },
              }}
            >
              Start Over
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
