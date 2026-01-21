import { NextResponse } from 'next/server';

/**
 * Standard error response format for API routes
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
}

/**
 * Create a standardized error response for API routes
 */
export function createErrorResponse(
  message: string,
  status: number,
  code?: string
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = { error: message };
  if (code) {
    body.code = code;
  }
  return NextResponse.json(body, { status });
}
