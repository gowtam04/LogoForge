import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateLogos } from '@/lib/google-ai';
import { createErrorResponse } from '@/lib/api-utils';
import type { GenerationRequest, GenerationResponse, LogoStyle } from '@/types';

// Valid logo styles for validation
const validStyles: LogoStyle[] = ['any', 'minimalist', 'playful', 'corporate', 'mascot'];

/**
 * POST /api/generate
 * Generates logo variations using Google Gemini AI
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(
        'Invalid JSON in request body',
        400,
        'INVALID_JSON'
      );
    }

    // Validate request body
    const validationError = validateRequest(body);
    if (validationError) {
      return createErrorResponse(validationError, 400, 'VALIDATION_ERROR');
    }

    const generationRequest = body as GenerationRequest;
    const { mode, prompt, images, options } = generationRequest;

    // Check for API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      return createErrorResponse(
        'Server configuration error. Please contact support.',
        500,
        'SERVER_CONFIG_ERROR'
      );
    }

    // Generate logos using Google AI with timeout handling
    let logos;
    try {
      logos = await Promise.race([
        generateLogos(mode, prompt, images, {
          style: options.style,
          appName: options.appName,
          colorHints: options.colorHints,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Request timeout')),
            120000 // 2 minute timeout
          )
        ),
      ]);
    } catch (error) {
      if (error instanceof Error && error.message === 'Request timeout') {
        return createErrorResponse(
          'Request timed out. Please try again.',
          504,
          'TIMEOUT'
        );
      }
      throw error;
    }

    // Build response
    const response: GenerationResponse = {
      id: uuidv4(),
      logos,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      // Check for network errors
      if (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ENOTFOUND')
      ) {
        return createErrorResponse(
          'Unable to connect to AI service. Please try again later.',
          503,
          'SERVICE_UNAVAILABLE'
        );
      }

      // Check for rate limiting or quota errors from upstream API
      if (
        error.message.includes('quota') ||
        error.message.includes('rate') ||
        error.message.includes('429')
      ) {
        return createErrorResponse(
          'Service temporarily unavailable due to high demand. Please try again later.',
          429,
          'UPSTREAM_RATE_LIMIT'
        );
      }

      // Check for API key errors
      if (
        error.message.includes('API key') ||
        error.message.includes('authentication') ||
        error.message.includes('401') ||
        error.message.includes('403')
      ) {
        return createErrorResponse(
          'Server configuration error. Please contact support.',
          500,
          'AUTH_ERROR'
        );
      }

      // Handle generation failures with sanitized message
      if (error.message.includes('Failed to generate')) {
        // Sanitize the error message to avoid leaking sensitive info
        const sanitizedMessage = error.message
          .replace(/API key[^.]*\./gi, '')
          .replace(/https?:\/\/[^\s]*/gi, '[URL]')
          .trim();
        return createErrorResponse(
          sanitizedMessage || 'Failed to generate logos. Please try again.',
          500,
          'GENERATION_ERROR'
        );
      }
    }

    // Generic server error - don't expose internal details
    return createErrorResponse(
      'An unexpected error occurred. Please try again.',
      500,
      'INTERNAL_ERROR'
    );
  }
}

/**
 * Validates the generation request body
 * @returns Error message if validation fails, null if valid
 */
function validateRequest(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a valid object';
  }

  const request = body as Record<string, unknown>;

  // Validate mode
  if (!request.mode) {
    return 'mode is required';
  }
  if (request.mode !== 'text' && request.mode !== 'reference') {
    return 'mode must be either "text" or "reference"';
  }

  // Validate prompt
  if (!request.prompt) {
    return 'prompt is required';
  }
  if (typeof request.prompt !== 'string') {
    return 'prompt must be a string';
  }
  if (request.prompt.trim().length === 0) {
    return 'prompt cannot be empty';
  }
  if (request.prompt.length > 2000) {
    return 'prompt must be 2000 characters or less';
  }

  // Validate images for reference mode
  if (request.mode === 'reference') {
    if (!request.images || !Array.isArray(request.images)) {
      return 'images array is required for reference mode';
    }
    if (request.images.length === 0) {
      return 'at least one image is required for reference mode';
    }
    if (request.images.length > 5) {
      return 'maximum 5 reference images allowed';
    }
    for (let i = 0; i < request.images.length; i++) {
      if (typeof request.images[i] !== 'string') {
        return `images[${i}] must be a base64 string`;
      }
    }
  }

  // Validate options
  if (!request.options) {
    return 'options is required';
  }
  if (typeof request.options !== 'object') {
    return 'options must be an object';
  }

  const options = request.options as Record<string, unknown>;

  // Validate style
  if (!options.style) {
    return 'options.style is required';
  }
  if (!validStyles.includes(options.style as LogoStyle)) {
    return `options.style must be one of: ${validStyles.join(', ')}`;
  }

  // Validate optional appName
  if (options.appName !== undefined) {
    if (typeof options.appName !== 'string') {
      return 'options.appName must be a string';
    }
    if (options.appName.length > 100) {
      return 'options.appName must be 100 characters or less';
    }
  }

  // Validate optional colorHints
  if (options.colorHints !== undefined) {
    if (typeof options.colorHints !== 'string') {
      return 'options.colorHints must be a string';
    }
    if (options.colorHints.length > 200) {
      return 'options.colorHints must be 200 characters or less';
    }
  }

  return null;
}
