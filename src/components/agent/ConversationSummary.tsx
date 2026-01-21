'use client';

import {
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

interface ConversationSummaryProps {
  questions: string[];
  answers: string[];
  finalPrompt: string;
  style: string;
  appName?: string;
  colorHints?: string;
  onEditAnswer: (index: number, newAnswer: string) => void;
  onEditPrompt: (newPrompt: string) => void;
}

export default function ConversationSummary({
  questions,
  answers,
  finalPrompt,
  style,
  appName,
  colorHints,
  onEditAnswer,
  onEditPrompt,
}: ConversationSummaryProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleStartEditAnswer = (index: number) => {
    setEditingIndex(index);
    setEditValue(answers[index] || '');
  };

  const handleSaveAnswer = () => {
    if (editingIndex !== null) {
      onEditAnswer(editingIndex, editValue);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingPrompt(false);
    setEditValue('');
  };

  const handleStartEditPrompt = () => {
    setEditingPrompt(true);
    setEditValue(finalPrompt);
  };

  const handleSavePrompt = () => {
    onEditPrompt(editValue);
    setEditingPrompt(false);
    setEditValue('');
  };

  return (
    <Box>
      {/* Questions and Answers Review */}
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: 'text.secondary',
          fontWeight: 500,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
        }}
      >
        Your Answers
      </Typography>

      <Box sx={{ mb: 4 }}>
        {questions.map((question, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid',
              borderColor: editingIndex === index ? '#6366f1' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                mb: 1,
              }}
            >
              Q{index + 1}: {question}
            </Typography>

            {editingIndex === index ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  size="small"
                  InputProps={{
                    sx: {
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      fontSize: '0.875rem',
                    },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleSaveAnswer}
                  sx={{ color: '#22c55e' }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleCancelEdit}
                  sx={{ color: 'text.secondary' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: answers[index] ? 'text.primary' : 'text.secondary',
                    fontStyle: answers[index] ? 'normal' : 'italic',
                    flex: 1,
                  }}
                >
                  {answers[index] || 'Skipped'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleStartEditAnswer(index)}
                  sx={{
                    ml: 1,
                    color: 'text.secondary',
                    '&:hover': { color: '#818cf8' },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Generated Metadata */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label={`Style: ${style}`}
          size="small"
          sx={{
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            fontWeight: 500,
          }}
        />
        {appName && (
          <Chip
            label={`App: ${appName}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              fontWeight: 500,
            }}
          />
        )}
        {colorHints && (
          <Chip
            label={`Colors: ${colorHints}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              fontWeight: 500,
            }}
          />
        )}
      </Box>

      {/* Generated Prompt */}
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
        Generated Prompt
      </Typography>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid',
          borderColor: editingPrompt ? '#6366f1' : 'rgba(99, 102, 241, 0.2)',
          transition: 'all 0.2s ease',
        }}
      >
        {editingPrompt ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              size="small"
              InputProps={{
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  fontSize: '0.875rem',
                },
              }}
            />
            <IconButton
              size="small"
              onClick={handleSavePrompt}
              sx={{ color: '#22c55e' }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleCancelEdit}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {finalPrompt}
            </Typography>
            <IconButton
              size="small"
              onClick={handleStartEditPrompt}
              sx={{
                ml: 1,
                color: 'text.secondary',
                '&:hover': { color: '#818cf8' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
