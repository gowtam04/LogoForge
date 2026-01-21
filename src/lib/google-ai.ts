import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LogoStyle, GeneratedLogo } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Style-specific guidance for logo generation
const styleGuidance: Record<LogoStyle, string> = {
  any: 'Create a versatile, professional logo that works across various contexts.',
  minimalist: 'Create a clean, simple logo with minimal elements. Use negative space effectively. Avoid gradients and complex details. Focus on essential shapes and forms.',
  playful: 'Create a fun, energetic logo with vibrant colors and dynamic shapes. Consider rounded edges, bouncy typography, and friendly elements.',
  corporate: 'Create a professional, trustworthy logo suitable for business contexts. Use clean lines, balanced composition, and sophisticated color palette.',
  mascot: 'Create a character-based logo with a memorable mascot. The character should be distinctive, friendly, and represent the brand personality.',
};

interface GenerateLogosOptions {
  style: LogoStyle;
  appName?: string;
  colorHints?: string;
}

/**
 * Generates logo images using Google Gemini AI
 * @param mode - 'text' for text-only prompts, 'reference' for prompts with reference images
 * @param prompt - The user's description of the desired logo
 * @param images - Optional array of base64-encoded reference images (for reference mode)
 * @param options - Additional options including style, app name, and color hints
 * @returns Array of generated logos with base64 data and mime types
 */
export async function generateLogos(
  mode: 'text' | 'reference',
  prompt: string,
  images: string[] | undefined,
  options: GenerateLogosOptions
): Promise<GeneratedLogo[]> {
  const { style, appName, colorHints } = options;

  // Build the system prompt for logo generation
  const systemPrompt = buildSystemPrompt(style, appName, colorHints);

  // Build the user prompt
  const userPrompt = buildUserPrompt(mode, prompt, images);

  // Get the model with image generation capabilities
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
    generationConfig: {
      responseModalities: ['image', 'text'],
    } as Record<string, unknown>,
  });

  const generatedLogos: GeneratedLogo[] = [];

  // Generate 4 logo variations (one at a time since each call produces one image)
  for (let i = 0; i < 4; i++) {
    try {
      const variationPrompt = `${systemPrompt}\n\n${userPrompt}\n\nThis is variation ${i + 1} of 4. Create a unique and distinct design for this variation.`;

      // Prepare content parts
      const contentParts: Array<string | { inlineData: { data: string; mimeType: string } }> = [
        variationPrompt,
      ];

      // Add reference images if in reference mode
      if (mode === 'reference' && images && images.length > 0) {
        for (const imageBase64 of images) {
          // Extract mime type and data from base64 string if it includes data URL prefix
          const { mimeType, data } = parseBase64Image(imageBase64);
          contentParts.push({
            inlineData: {
              data,
              mimeType,
            },
          });
        }
      }

      const result = await model.generateContent(contentParts);
      const response = result.response;

      // Extract image from response
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content?.parts;
        if (parts) {
          for (const part of parts) {
            // Check if this part contains inline image data
            if (part.inlineData) {
              generatedLogos.push({
                id: uuidv4(),
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType || 'image/png',
              });
              break; // Only take the first image from each generation
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error generating logo variation ${i + 1}:`, error);
      // Continue with remaining variations even if one fails
    }
  }

  // Ensure we have at least one logo
  if (generatedLogos.length === 0) {
    throw new Error('Failed to generate any logos. Please try again.');
  }

  return generatedLogos;
}

/**
 * Builds the system prompt with style-specific guidance
 */
function buildSystemPrompt(
  style: LogoStyle,
  appName?: string,
  colorHints?: string
): string {
  const parts: string[] = [
    'You are an expert logo designer. Generate a professional, high-quality logo image.',
    '',
    '## Design Requirements:',
    '- Create a logo that is visually striking and memorable',
    '- Ensure the design works well at different sizes (scalable)',
    '- Use a clean, transparent or simple background',
    '- The logo should be centered and well-composed',
    '- Output a square image suitable for app icons and branding',
    '',
    `## Style Direction:`,
    styleGuidance[style],
  ];

  if (appName) {
    parts.push('', `## Brand Name:`, `The logo is for: "${appName}". Consider incorporating the name or initials tastefully if appropriate.`);
  }

  if (colorHints) {
    parts.push('', `## Color Preferences:`, `Preferred colors or color scheme: ${colorHints}. Use these as guidance while ensuring good contrast and visual appeal.`);
  }

  parts.push(
    '',
    '## Output:',
    'Generate a single, complete logo image. Do not include any text explanation, just the image.'
  );

  return parts.join('\n');
}

/**
 * Builds the user prompt based on mode
 */
function buildUserPrompt(
  mode: 'text' | 'reference',
  prompt: string,
  images?: string[]
): string {
  if (mode === 'reference' && images && images.length > 0) {
    return `Using the provided reference image(s) as inspiration for style, colors, or concept, create a new and original logo based on this description:\n\n${prompt}\n\nDo not copy the reference images directly. Instead, use them to inform the design direction while creating something unique.`;
  }

  return `Create a logo based on this description:\n\n${prompt}`;
}

/**
 * Parses a base64 image string, handling both raw base64 and data URLs
 */
function parseBase64Image(imageBase64: string): { mimeType: string; data: string } {
  // Check if it's a data URL (e.g., "data:image/png;base64,...")
  const dataUrlMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/);

  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      data: dataUrlMatch[2],
    };
  }

  // Assume raw base64 with PNG mime type as default
  return {
    mimeType: 'image/png',
    data: imageBase64,
  };
}
