/**
 * Export API endpoint
 * Generates icon bundles for iOS, Android, and Web platforms
 * Returns a ZIP file stream with proper folder structure
 */

import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import { Readable, PassThrough } from 'stream';
import type { ExportPlatform, ExportRequest } from '@/types';
import {
  processLogoForPlatforms,
  isValidBase64Image,
} from '@/lib/image-processing';

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Standard error response format
 */
interface ApiErrorResponse {
  error: string;
  code?: string;
}

/**
 * Create a standardized error response
 */
function createErrorResponse(
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

// ============================================================================
// Validation
// ============================================================================

interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

function validateExportRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required', code: 'MISSING_BODY' };
  }

  const request = body as Record<string, unknown>;

  // Validate logoBase64
  if (!request.logoBase64 || typeof request.logoBase64 !== 'string') {
    return {
      valid: false,
      error: 'logoBase64 is required and must be a string',
      code: 'INVALID_LOGO',
    };
  }

  if (!isValidBase64Image(request.logoBase64)) {
    return {
      valid: false,
      error: 'Invalid base64 image format',
      code: 'INVALID_IMAGE_FORMAT',
    };
  }

  // Validate platforms
  if (!request.platforms || !Array.isArray(request.platforms)) {
    return {
      valid: false,
      error: 'platforms is required and must be an array',
      code: 'INVALID_PLATFORMS',
    };
  }

  if (request.platforms.length === 0) {
    return {
      valid: false,
      error: 'At least one platform must be selected',
      code: 'NO_PLATFORMS',
    };
  }

  const validPlatforms: ExportPlatform[] = ['ios', 'android', 'web'];
  for (const platform of request.platforms) {
    if (!validPlatforms.includes(platform)) {
      return {
        valid: false,
        error: `Invalid platform: ${platform}. Must be one of: ${validPlatforms.join(', ')}`,
        code: 'INVALID_PLATFORM',
      };
    }
  }

  // Validate backgroundColor (optional)
  if (request.backgroundColor !== undefined) {
    if (typeof request.backgroundColor !== 'string') {
      return {
        valid: false,
        error: 'backgroundColor must be a string',
        code: 'INVALID_BACKGROUND_COLOR',
      };
    }

    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    if (!hexColorRegex.test(request.backgroundColor)) {
      return {
        valid: false,
        error: 'backgroundColor must be a valid hex color (e.g., #fff, #ffffff, or #ffffffff)',
        code: 'INVALID_HEX_COLOR',
      };
    }
  }

  // Validate padding (optional)
  if (request.padding !== undefined) {
    if (typeof request.padding !== 'number') {
      return {
        valid: false,
        error: 'padding must be a number',
        code: 'INVALID_PADDING_TYPE',
      };
    }

    if (request.padding < 0 || request.padding > 20) {
      return {
        valid: false,
        error: 'padding must be between 0 and 20 (percentage)',
        code: 'INVALID_PADDING_RANGE',
      };
    }
  }

  return { valid: true };
}

// ============================================================================
// ZIP Generation
// ============================================================================

/**
 * Create a ZIP archive with the processed images
 */
async function createZipArchive(
  files: Map<string, Buffer>
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    const chunks: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    archive.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    archive.on('error', (err) => {
      reject(err);
    });

    // Add all files to the archive with proper structure
    for (const [path, buffer] of files) {
      // Prepend root folder name
      const fullPath = `logoforge-icons/${path}`;
      archive.append(buffer, { name: fullPath });
    }

    // Finalize the archive
    archive.finalize();
  });
}

/**
 * Create a streaming ZIP archive response
 */
function createStreamingZipResponse(
  files: Map<string, Buffer>
): ReadableStream<Uint8Array> {
  const passThrough = new PassThrough();

  const archive = archiver('zip', {
    zlib: { level: 6 }, // Balanced compression for streaming
  });

  archive.on('error', (err) => {
    console.error('Archive error:', err);
    passThrough.destroy(err);
  });

  // Pipe archive to passThrough
  archive.pipe(passThrough);

  // Add all files to the archive
  for (const [path, buffer] of files) {
    const fullPath = `logoforge-icons/${path}`;
    archive.append(buffer, { name: fullPath });
  }

  // Finalize the archive
  archive.finalize();

  // Convert Node.js stream to Web ReadableStream
  return new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => {
        controller.enqueue(new Uint8Array(chunk));
      });

      passThrough.on('end', () => {
        controller.close();
      });

      passThrough.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      passThrough.destroy();
    },
  });
}

// ============================================================================
// API Route Handler
// ============================================================================

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

    // Validate request
    const validation = validateExportRequest(body);
    if (!validation.valid) {
      return createErrorResponse(
        validation.error || 'Validation failed',
        400,
        validation.code || 'VALIDATION_ERROR'
      );
    }

    const exportRequest = body as ExportRequest;

    // Process images for all requested platforms with timeout handling
    console.log(
      `Processing export for platforms: ${exportRequest.platforms.join(', ')}`
    );

    let files: Map<string, Buffer>;
    try {
      files = await Promise.race([
        processLogoForPlatforms(
          exportRequest.logoBase64,
          exportRequest.platforms,
          {
            backgroundColor: exportRequest.backgroundColor,
            padding: exportRequest.padding,
          }
        ),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Processing timeout')),
            60000 // 1 minute timeout for image processing
          )
        ),
      ]);
    } catch (error) {
      if (error instanceof Error && error.message === 'Processing timeout') {
        return createErrorResponse(
          'Image processing timed out. Please try with a smaller image.',
          504,
          'TIMEOUT'
        );
      }
      throw error;
    }

    console.log(`Generated ${files.size} files`);

    // Generate timestamp for filename
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `logoforge-icons-${timestamp}.zip`;

    // Create streaming response
    const stream = createStreamingZipResponse(files);

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Export error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Sharp errors - unsupported format
      if (
        error.message.includes('Input buffer contains unsupported image format')
      ) {
        return createErrorResponse(
          'Unsupported image format. Please use PNG, JPEG, or WebP.',
          400,
          'UNSUPPORTED_FORMAT'
        );
      }

      // Sharp errors - corrupt image
      if (
        error.message.includes('corrupt') ||
        error.message.includes('Invalid') ||
        error.message.includes('Could not')
      ) {
        return createErrorResponse(
          'The image appears to be corrupted. Please try uploading again.',
          400,
          'CORRUPT_IMAGE'
        );
      }

      // Memory/size errors
      if (
        error.message.includes('memory') ||
        error.message.includes('too large') ||
        error.message.includes('heap')
      ) {
        return createErrorResponse(
          'Image too large to process. Please use a smaller image (max 10MB recommended).',
          400,
          'IMAGE_TOO_LARGE'
        );
      }

      // File system errors (shouldn't happen with in-memory processing, but handle gracefully)
      if (
        error.message.includes('ENOENT') ||
        error.message.includes('EACCES') ||
        error.message.includes('EPERM')
      ) {
        return createErrorResponse(
          'Server error during export. Please try again.',
          500,
          'FILE_SYSTEM_ERROR'
        );
      }

      // Don't expose raw error messages that might contain paths or sensitive info
      const isSafeMessage =
        !error.message.includes('/') &&
        !error.message.includes('\\') &&
        error.message.length < 200;

      if (isSafeMessage) {
        return createErrorResponse(
          `Export failed: ${error.message}`,
          500,
          'EXPORT_ERROR'
        );
      }
    }

    // Generic server error - don't expose internal details
    return createErrorResponse(
      'An unexpected error occurred during export. Please try again.',
      500,
      'INTERNAL_ERROR'
    );
  }
}

// ============================================================================
// OPTIONS handler for CORS
// ============================================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ============================================================================
// GET handler for documentation
// ============================================================================

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/export',
    method: 'POST',
    description: 'Generate icon bundles for iOS, Android, and Web platforms',
    request: {
      body: {
        logoBase64: {
          type: 'string',
          required: true,
          description: 'Base64 encoded logo image (PNG, JPEG, or WebP)',
        },
        platforms: {
          type: 'array',
          required: true,
          items: ['ios', 'android', 'web'],
          description: 'Platforms to generate icons for',
        },
        backgroundColor: {
          type: 'string',
          required: false,
          description: 'Background color in hex format (e.g., #ffffff)',
        },
        padding: {
          type: 'number',
          required: false,
          description: 'Padding percentage (0-20)',
        },
      },
    },
    response: {
      success: 'ZIP file download',
      error: {
        status: 400,
        body: { error: 'Error message' },
      },
    },
    zipStructure: {
      'logoforge-icons/': {
        'ios/AppIcon.appiconset/': 'Contents.json + PNG files',
        'android/mipmap-*/': 'ic_launcher.png, ic_launcher_round.png, ic_launcher_foreground.png',
        'android/mipmap-anydpi-v26/': 'ic_launcher.xml, ic_launcher_round.xml',
        'android/values/': 'colors.xml',
        'web/': 'favicon.ico, favicon-*.png, apple-touch-icon.png, android-chrome-*.png, mstile-*.png, manifest.json, browserconfig.xml',
      },
    },
  });
}
