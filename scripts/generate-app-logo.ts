/**
 * Script to generate LogoForge app logo using Gemini AI
 * Run with: npm run generate-logo
 *
 * Generates 4 logo variations, allows interactive selection,
 * then processes the selected logo into all required icon sizes.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import sharp from 'sharp';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const PREVIEW_DIR = '.logo-previews';
const OUTPUT_DIR = 'public';

// Icon specifications
const ICON_SPECS = [
  { filename: 'favicon-16x16.png', size: 16 },
  { filename: 'favicon-32x32.png', size: 32 },
  { filename: 'favicon-48x48.png', size: 48 },
  { filename: 'apple-touch-icon.png', size: 180 },
  { filename: 'android-chrome-192x192.png', size: 192 },
  { filename: 'android-chrome-512x512.png', size: 512 },
  { filename: 'mstile-150x150.png', size: 150 },
  { filename: 'mstile-310x310.png', size: 310 },
];

const MASKABLE_SPECS = [
  { filename: 'android-chrome-192x192-maskable.png', size: 192 },
  { filename: 'android-chrome-512x512-maskable.png', size: 512 },
];

const FAVICON_ICO_SIZES = [16, 32, 48];

// LogoForge brand prompt
const LOGO_PROMPT = `You are an expert logo designer. Generate a professional logo for "LogoForge".

## Brand Identity:
LogoForge is an AI-powered logo generation tool. The name evokes a blacksmith's forge -
a place where raw materials are transformed into refined, crafted items.

## Visual Theme - FORGE/ANVIL:
- Incorporate forge/smithing imagery: anvil, hammer, sparks, molten metal
- Suggest the transformation process (raw → refined)
- Modern interpretation of traditional craftsmanship
- The logo should feel powerful, creative, and transformative

## Color Palette:
- Primary: Indigo (#6366f1) - tech-forward, creative energy
- Accent: Amber/Orange (#f59e0b) - sparks, molten metal, warmth
- Use gradients between these to suggest heat and energy
- Dark elements are welcome (app uses dark theme)

## Requirements:
- Works at small (16px) and large (512px) sizes
- Square composition, centered
- Dark or transparent background (app uses dark theme)
- Bold, memorable, and distinctive
- No text/wordmark - icon only

Generate a single, complete logo image. Do not include any text explanation, just the image.`;

const VARIATION_PROMPTS = [
  'Focus on an anvil as the central element, with sparks flying. Modern geometric interpretation.',
  'Feature a hammer striking, creating a burst of energy. Dynamic and powerful.',
  'Show the transformation concept - raw material becoming refined. Abstract but clear.',
  'Combine forge elements (anvil, hammer, sparks) into a unified, balanced symbol.',
];

/**
 * Generate a single logo variation
 */
async function generateLogoVariation(variationPrompt: string): Promise<Buffer | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as Record<string, unknown>,
    });

    const fullPrompt = `${LOGO_PROMPT}\n\n## Variation Direction:\n${variationPrompt}`;
    const result = await model.generateContent(fullPrompt);
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
    console.error('Error generating logo variation:', error);
    return null;
  }
}

/**
 * Generate all logo variations
 */
async function generateLogoVariations(): Promise<Buffer[]> {
  const variations: Buffer[] = [];

  console.log('\nGenerating 4 logo variations...\n');

  for (let i = 0; i < VARIATION_PROMPTS.length; i++) {
    console.log(`  Generating variation ${i + 1}/4...`);
    const buffer = await generateLogoVariation(VARIATION_PROMPTS[i]);

    if (buffer) {
      variations.push(buffer);
      console.log(`  ✓ Variation ${i + 1} complete`);
    } else {
      console.log(`  ✗ Variation ${i + 1} failed`);
    }

    // Add delay between generations to avoid rate limiting
    if (i < VARIATION_PROMPTS.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return variations;
}

/**
 * Save preview images
 */
function savePreviewImages(variations: Buffer[]): string[] {
  // Ensure preview directory exists
  if (!fs.existsSync(PREVIEW_DIR)) {
    fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  }

  const previewPaths: string[] = [];

  for (let i = 0; i < variations.length; i++) {
    const filename = `preview-${i + 1}.png`;
    const filepath = path.join(PREVIEW_DIR, filename);
    fs.writeFileSync(filepath, variations[i]);
    previewPaths.push(filepath);
  }

  return previewPaths;
}

/**
 * Prompt user for selection
 */
async function promptUserSelection(previewPaths: string[]): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n' + '='.repeat(50));
  console.log('LOGO PREVIEW');
  console.log('='.repeat(50));
  console.log(`\nGenerated ${previewPaths.length} logo variations.`);
  console.log('\nPreview files saved to:');
  previewPaths.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p}`);
  });
  console.log('\nOpen these files in an image viewer to compare.\n');

  return new Promise((resolve) => {
    const askQuestion = () => {
      rl.question(`Select a logo (1-${previewPaths.length}): `, (answer) => {
        const selection = parseInt(answer, 10);
        if (selection >= 1 && selection <= previewPaths.length) {
          rl.close();
          resolve(selection - 1); // Convert to 0-indexed
        } else {
          console.log(`Please enter a number between 1 and ${previewPaths.length}`);
          askQuestion();
        }
      });
    };
    askQuestion();
  });
}

/**
 * Resize image to specific size
 */
async function resizeImage(buffer: Buffer, size: number): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, {
      fit: 'contain',
      position: 'center',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

/**
 * Generate maskable icon with padding
 */
async function generateMaskableIcon(
  buffer: Buffer,
  size: number,
  backgroundColor: string = '#0a0a0a'
): Promise<Buffer> {
  // 10% padding for maskable safe zone
  const paddingPercent = 10;
  const paddingPixels = Math.round((size * paddingPercent) / 100);
  const innerSize = size - paddingPixels * 2;

  // Parse background color
  const bgColor = hexToRgba(backgroundColor);

  // Resize logo to inner size
  const resizedLogo = await sharp(buffer)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      position: 'center',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Extend with padding and flatten
  return sharp(resizedLogo)
    .extend({
      top: paddingPixels,
      bottom: paddingPixels,
      left: paddingPixels,
      right: paddingPixels,
      background: bgColor,
    })
    .flatten({ background: bgColor })
    .png()
    .toBuffer();
}

/**
 * Generate multi-size ICO file
 */
async function generateFaviconIco(buffer: Buffer, sizes: number[]): Promise<Buffer> {
  // Generate PNG buffers for each size
  const pngBuffers: Buffer[] = await Promise.all(
    sizes.map((size) => resizeImage(buffer, size))
  );

  // Create ICO file manually
  // ICO format: header + directory entries + image data
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type
  icoHeader.writeUInt16LE(sizes.length, 4); // Number of images

  const directoryEntries: Buffer[] = [];
  const imageDataBuffers: Buffer[] = [];
  let imageOffset = 6 + sizes.length * 16; // Header + directory size

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const pngData = pngBuffers[i];

    // Directory entry (16 bytes each)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // Height (0 = 256)
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(pngData.length, 8); // Image size
    entry.writeUInt32LE(imageOffset, 12); // Image offset

    directoryEntries.push(entry);
    imageDataBuffers.push(pngData);
    imageOffset += pngData.length;
  }

  return Buffer.concat([icoHeader, ...directoryEntries, ...imageDataBuffers]);
}

/**
 * Convert hex color to RGBA object
 */
function hexToRgba(hex: string): { r: number; g: number; b: number; alpha: number } {
  const cleanHex = hex.replace(/^#/, '');
  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else {
    return { r: 10, g: 10, b: 10, alpha: 1 }; // Default dark
  }

  return { r, g, b, alpha: 1 };
}

/**
 * Process and save all icons
 */
async function processAndSaveIcons(selectedBuffer: Buffer): Promise<void> {
  console.log('\nProcessing icons...\n');

  // Generate standard icons
  for (const spec of ICON_SPECS) {
    const resized = await resizeImage(selectedBuffer, spec.size);
    const outputPath = path.join(OUTPUT_DIR, spec.filename);
    fs.writeFileSync(outputPath, resized);
    console.log(`  ✓ ${spec.filename} (${spec.size}x${spec.size})`);
  }

  // Generate maskable icons
  for (const spec of MASKABLE_SPECS) {
    const maskable = await generateMaskableIcon(selectedBuffer, spec.size);
    const outputPath = path.join(OUTPUT_DIR, spec.filename);
    fs.writeFileSync(outputPath, maskable);
    console.log(`  ✓ ${spec.filename} (${spec.size}x${spec.size} maskable)`);
  }

  // Generate favicon.ico
  const favicon = await generateFaviconIco(selectedBuffer, FAVICON_ICO_SIZES);
  const faviconPath = path.join(OUTPUT_DIR, 'favicon.ico');
  fs.writeFileSync(faviconPath, favicon);
  console.log(`  ✓ favicon.ico (${FAVICON_ICO_SIZES.join(', ')}px)`);
}

/**
 * Clean up preview files
 */
function cleanupPreviews(): void {
  if (fs.existsSync(PREVIEW_DIR)) {
    const files = fs.readdirSync(PREVIEW_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(PREVIEW_DIR, file));
    }
    fs.rmdirSync(PREVIEW_DIR);
    console.log('\n✓ Cleaned up preview files');
  }
}

/**
 * Main function
 */
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║       LogoForge App Logo Generator         ║');
  console.log('╚════════════════════════════════════════════╝');

  // Check for API key
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('\n✗ Error: GOOGLE_AI_API_KEY not found in environment');
    console.error('  Please set it in .env.local or .env');
    process.exit(1);
  }

  // Generate variations
  const variations = await generateLogoVariations();

  if (variations.length === 0) {
    console.error('\n✗ Failed to generate any logo variations');
    process.exit(1);
  }

  // Save previews
  const previewPaths = savePreviewImages(variations);

  // Prompt for selection
  const selectedIndex = await promptUserSelection(previewPaths);
  const selectedBuffer = variations[selectedIndex];

  console.log(`\n✓ Selected variation ${selectedIndex + 1}`);

  // Process and save icons
  await processAndSaveIcons(selectedBuffer);

  // Ask about cleanup
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise<void>((resolve) => {
    rl.question('\nDelete preview files? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        cleanupPreviews();
      } else {
        console.log(`\nPreview files kept at: ${PREVIEW_DIR}/`);
      }
      rl.close();
      resolve();
    });
  });

  console.log('\n' + '='.repeat(50));
  console.log('✓ Logo generation complete!');
  console.log('='.repeat(50));
  console.log('\nIcons saved to public/ directory.');
  console.log('\nNext steps:');
  console.log('  1. Run "npm run dev" to preview');
  console.log('  2. Check browser tab favicon');
  console.log('  3. Run "npm run build" to verify');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
