'use client';

import { Box, Card, Grid, Skeleton, Stack, alpha } from '@mui/material';

type SkeletonVariant = 'card' | 'grid' | 'text' | 'button';

interface LoadingSkeletonProps {
  variant: SkeletonVariant;
  count?: number;
}

// Indigo-tinted shimmer animation keyframes
const shimmerAnimation = {
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },
};

// Shared skeleton styles with indigo tint
const skeletonStyles = {
  bgcolor: alpha('#6366f1', 0.08),
  '&::after': {
    background: `linear-gradient(
      90deg,
      transparent,
      ${alpha('#6366f1', 0.12)},
      transparent
    )`,
  },
};

// Card skeleton - for logo cards in grid
function CardSkeleton() {
  return (
    <Card
      sx={{
        aspectRatio: '1',
        backgroundColor: alpha('#171717', 0.8),
        border: '1px solid',
        borderColor: alpha('#262626', 1),
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        ...shimmerAnimation,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            90deg,
            ${alpha('#6366f1', 0.02)} 0%,
            ${alpha('#6366f1', 0.08)} 50%,
            ${alpha('#6366f1', 0.02)} 100%
          )`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 4,
        }}
      >
        <Skeleton
          variant="rounded"
          width="70%"
          height="70%"
          animation="wave"
          sx={{
            ...skeletonStyles,
            borderRadius: 2,
          }}
        />
      </Box>
    </Card>
  );
}

// Grid skeleton - for displaying multiple card skeletons in a grid
function GridSkeleton({ count = 4 }: { count: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }, (_, index) => (
        <Grid size={{ xs: 12, sm: 6 }} key={index}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

// Text skeleton - for text content loading
function TextSkeleton({ count = 3 }: { count: number }) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          animation="wave"
          width={index === count - 1 ? '60%' : '100%'}
          height={24}
          sx={skeletonStyles}
        />
      ))}
    </Stack>
  );
}

// Button skeleton - for button loading states
function ButtonSkeleton({ count = 1 }: { count: number }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          animation="wave"
          width={140}
          height={44}
          sx={{
            ...skeletonStyles,
            borderRadius: 2,
          }}
        />
      ))}
    </Stack>
  );
}

export default function LoadingSkeleton({
  variant,
  count = variant === 'grid' ? 4 : variant === 'text' ? 3 : 1,
}: LoadingSkeletonProps) {
  switch (variant) {
    case 'card':
      return (
        <>
          {Array.from({ length: count }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </>
      );
    case 'grid':
      return <GridSkeleton count={count} />;
    case 'text':
      return <TextSkeleton count={count} />;
    case 'button':
      return <ButtonSkeleton count={count} />;
    default:
      return null;
  }
}
