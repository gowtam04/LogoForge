/**
 * Script to generate showcase logos for the landing page
 * Run with: npx tsx scripts/generate-showcase-logos.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface LogoPrompt {
  filename: string;
  description: string;
  style: 'minimalist' | 'playful' | 'corporate' | 'mascot';
  appName: string;
  colorHints?: string;
}

// 8 diverse showcase logos covering different styles and industries
const showcasePrompts: LogoPrompt[] = [
  {
    filename: 'logo-fintech-minimal.png',
    description: 'A modern payment app logo. Abstract geometric shape suggesting speed and security. Clean lines, professional feel.',
    style: 'minimalist',
    appName: 'PayFlow',
    colorHints: 'Deep blue and silver, gradient accents',
  },
  {
    filename: 'logo-fitness-playful.png',
    description: 'A fitness tracking app logo. Dynamic, energetic design with motion implied. Fun and motivating.',
    style: 'playful',
    appName: 'FitBurst',
    colorHints: 'Bright orange and coral, energetic gradients',
  },
  {
    filename: 'logo-legal-corporate.png',
    description: 'A law firm digital services logo. Scales of justice or pillar motif, refined and trustworthy.',
    style: 'corporate',
    appName: 'LexisCounsel',
    colorHints: 'Navy blue and gold, classic elegant colors',
  },
  {
    filename: 'logo-game-mascot.png',
    description: 'A mobile gaming app logo featuring a cute robot character. Friendly and appealing to all ages.',
    style: 'mascot',
    appName: 'RoboRun',
    colorHints: 'Teal and purple, futuristic neon accents',
  },
  {
    filename: 'logo-eco-minimal.png',
    description: 'A carbon footprint tracker app logo. Leaf or eco symbol, sustainability focused, modern and clean.',
    style: 'minimalist',
    appName: 'GreenStep',
    colorHints: 'Forest green and white, natural earth tones',
  },
  {
    filename: 'logo-food-playful.png',
    description: 'A food delivery app logo. Appetizing, fun design with food or delivery motif. Inviting and cheerful.',
    style: 'playful',
    appName: 'NomNom',
    colorHints: 'Warm red and yellow, appetizing food colors',
  },
  {
    filename: 'logo-cloud-corporate.png',
    description: 'A cloud storage enterprise app logo. Abstract cloud or data center motif, reliable and professional.',
    style: 'corporate',
    appName: 'VaultCloud',
    colorHints: 'Sky blue and charcoal, tech-forward palette',
  },
  {
    filename: 'logo-pet-mascot.png',
    description: 'A pet care app logo featuring a friendly dog or cat character. Warm, lovable, approachable.',
    style: 'mascot',
    appName: 'PawPal',
    colorHints: 'Warm browns, soft pink, friendly pastels',
  },
];

const styleGuidance: Record<string, string> = {
  minimalist: 'Create a clean, simple logo with minimal elements. Use negative space effectively. Avoid gradients and complex details. Focus on essential shapes and forms.',
  playful: 'Create a fun, energetic logo with vibrant colors and dynamic shapes. Consider rounded edges, bouncy typography, and friendly elements.',
  corporate: 'Create a professional, trustworthy logo suitable for business contexts. Use clean lines, balanced composition, and sophisticated color palette.',
  mascot: 'Create a character-based logo with a memorable mascot. The character should be distinctive, friendly, and represent the brand personality.',
};

async function generateLogo(prompt: LogoPrompt): Promise<Buffer | null> {
  const systemPrompt = `You are an expert logo designer. Generate a professional, high-quality logo image.

## Design Requirements:
- Create a logo that is visually striking and memorable
- Ensure the design works well at different sizes (scalable)
- Use a clean, dark transparent or simple dark background that works well on dark themed websites
- The logo should be centered and well-composed
- Output a square image suitable for app icons and branding

## Style Direction:
${styleGuidance[prompt.style]}

## Brand Name:
The logo is for: "${prompt.appName}". Consider incorporating the name or initials tastefully if appropriate.

## Color Preferences:
Preferred colors or color scheme: ${prompt.colorHints || 'Modern, appealing colors'}. Use these as guidance while ensuring good contrast and visual appeal.

## Output:
Generate a single, complete logo image. Do not include any text explanation, just the image.`;

  const userPrompt = `Create a logo based on this description:\n\n${prompt.description}`;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as Record<string, unknown>,
    });

    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const response = result.response;

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            return Buffer.from(part.inlineData.data, 'base64');
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error generating ${prompt.filename}:`, error);
    return null;
  }
}

async function main() {
  const outputDir = path.join(process.cwd(), 'public', 'logos', 'showcase');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting showcase logo generation...\n');

  for (const prompt of showcasePrompts) {
    console.log(`Generating: ${prompt.filename} (${prompt.appName} - ${prompt.style})...`);

    const imageBuffer = await generateLogo(prompt);

    if (imageBuffer) {
      const outputPath = path.join(outputDir, prompt.filename);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  Saved: ${outputPath}`);
    } else {
      console.log(`  Failed to generate ${prompt.filename}`);
    }

    // Add delay between generations to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log('\nShowcase logo generation complete!');
}

main().catch(console.error);
