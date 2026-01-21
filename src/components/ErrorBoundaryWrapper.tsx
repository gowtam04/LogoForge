'use client';

import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper for ErrorBoundary to use in server components
 */
export default function ErrorBoundaryWrapper({
  children,
}: ErrorBoundaryWrapperProps) {
  return <ErrorBoundary showHomeLink={true}>{children}</ErrorBoundary>;
}
