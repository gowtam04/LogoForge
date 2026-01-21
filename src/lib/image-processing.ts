/**
 * Image processing functions for logo export
 * Uses Sharp for all image operations
 */

import sharp from 'sharp';
import type { ExportPlatform } from '@/types';
import {
  IOS_ICON_SIZES,
  ANDROID_LAUNCHER_SIZES,
  ANDROID_ROUND_SIZES,
  ANDROID_ADAPTIVE_SIZES,
  ANDROID_PLAYSTORE_SIZE,
  WEB_FAVICON_SIZES,
  WEB_FAVICON_ICO_SIZES,
  WEB_APPLE_TOUCH_SIZE,
  WEB_MANIFEST_SIZES,
  WEB_MSTILE_SIZES,
  generateIOSContentsJsonStructure,
  ANDROID_IC_LAUNCHER_XML,
  ANDROID_IC_LAUNCHER_ROUND_XML,
  generateAndroidColorsXml,
  generateWebManifestStructure,
  generateBrowserConfigXml,
  type IOSIconSize,
  type AndroidIconSize,
} from './icon-sizes';

// ============================================================================
// Types
// ============================================================================

export interface ProcessingOptions {
  backgroundColor?: string;
  padding?: number; // 0-20 percentage
}

export interface ProcessedImage {
  filename: string;
  buffer: Buffer;
  path: string; // Full path within the ZIP
}

// ============================================================================
// Core Image Processing Functions
// ============================================================================

/**
 * Decode base64 image to buffer
 */
export function decodeBase64Image(base64String: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

/**
 * Resize image to specific size maintaining aspect ratio
 * Centers the image on a square canvas
 */
export async function resizeImage(
  buffer: Buffer,
  size: number,
  options: ProcessingOptions = {}
): Promise<Buffer> {
  const { backgroundColor } = options;

  // Get image metadata
  const metadata = await sharp(buffer).metadata();
  const hasAlpha = metadata.channels === 4 || metadata.hasAlpha;

  // Calculate the effective size after padding
  const effectiveSize = size;

  let pipeline = sharp(buffer).resize(effectiveSize, effectiveSize, {
    fit: 'contain',
    position: 'center',
    background: backgroundColor
      ? hexToRgba(backgroundColor)
      : hasAlpha
        ? { r: 0, g: 0, b: 0, alpha: 0 }
        : { r: 255, g: 255, b: 255, alpha: 1 },
  });

  // Flatten if background color is specified (removes transparency)
  if (backgroundColor) {
    pipeline = pipeline.flatten({ background: hexToRgba(backgroundColor) });
  }

  return pipeline.png().toBuffer();
}

/**
 * Add padding around the logo
 * Padding is a percentage of the final size
 */
export async function addPadding(
  buffer: Buffer,
  size: number,
  paddingPercent: number,
  backgroundColor?: string
): Promise<Buffer> {
  // Clamp padding to 0-20%
  const clampedPadding = Math.max(0, Math.min(20, paddingPercent));

  if (clampedPadding === 0) {
    return resizeImage(buffer, size, { backgroundColor });
  }

  // Calculate inner size (logo area) and padding
  const paddingPixels = Math.round((size * clampedPadding) / 100);
  const innerSize = size - paddingPixels * 2;

  // Get metadata
  const metadata = await sharp(buffer).metadata();
  const hasAlpha = metadata.channels === 4 || metadata.hasAlpha;

  const bgColor = backgroundColor
    ? hexToRgba(backgroundColor)
    : hasAlpha
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : { r: 255, g: 255, b: 255, alpha: 1 };

  // Resize logo to inner size
  const resizedLogo = await sharp(buffer)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      position: 'center',
      background: bgColor,
    })
    .png()
    .toBuffer();

  // Extend with padding
  let pipeline = sharp(resizedLogo).extend({
    top: paddingPixels,
    bottom: paddingPixels,
    left: paddingPixels,
    right: paddingPixels,
    background: bgColor,
  });

  // Flatten if background color specified
  if (backgroundColor) {
    pipeline = pipeline.flatten({ background: hexToRgba(backgroundColor) });
  }

  return pipeline.png().toBuffer();
}

/**
 * Create a round (circular) version of the image
 */
export async function createRoundImage(
  buffer: Buffer,
  size: number,
  options: ProcessingOptions = {}
): Promise<Buffer> {
  const { backgroundColor, padding = 0 } = options;

  // First resize with padding
  const resized = padding > 0
    ? await addPadding(buffer, size, padding, backgroundColor)
    : await resizeImage(buffer, size, { backgroundColor });

  // Create circular mask
  const circularMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`
  );

  // Apply mask and ensure PNG output
  return sharp(resized)
    .composite([
      {
        input: circularMask,
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();
}

/**
 * Generate multi-size ICO file for favicon
 */
export async function generateFavicon(
  buffer: Buffer,
  sizes: number[] = WEB_FAVICON_ICO_SIZES
): Promise<Buffer> {
  // Generate PNG buffers for each size
  const pngBuffers: Buffer[] = await Promise.all(
    sizes.map(size => resizeImage(buffer, size))
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

// ============================================================================
// Platform-Specific Processing Functions
// ============================================================================

/**
 * Process logo for iOS platform
 */
async function processForIOS(
  buffer: Buffer,
  options: ProcessingOptions = {}
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];
  const { padding = 0, backgroundColor } = options;

  // Generate all iOS icon sizes
  for (const iconConfig of IOS_ICON_SIZES) {
    const processedBuffer = padding > 0
      ? await addPadding(buffer, iconConfig.size, padding, backgroundColor)
      : await resizeImage(buffer, iconConfig.size, { backgroundColor });

    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `ios/AppIcon.appiconset/${iconConfig.filename}`,
    });
  }

  return results;
}

/**
 * Process logo for Android platform
 */
async function processForAndroid(
  buffer: Buffer,
  options: ProcessingOptions = {}
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];
  const { padding = 0, backgroundColor } = options;

  // Standard launcher icons
  for (const iconConfig of ANDROID_LAUNCHER_SIZES) {
    const processedBuffer = padding > 0
      ? await addPadding(buffer, iconConfig.size, padding, backgroundColor)
      : await resizeImage(buffer, iconConfig.size, { backgroundColor });

    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `android/${iconConfig.folder}/${iconConfig.filename}`,
    });
  }

  // Round launcher icons
  for (const iconConfig of ANDROID_ROUND_SIZES) {
    const processedBuffer = await createRoundImage(buffer, iconConfig.size, options);

    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `android/${iconConfig.folder}/${iconConfig.filename}`,
    });
  }

  // Adaptive icon foreground (logo centered in 72dp safe zone within 108dp canvas)
  for (const iconConfig of ANDROID_ADAPTIVE_SIZES) {
    // For adaptive icons, the logo should be in the center 66.67% (72/108)
    const safeZoneRatio = 72 / 108;
    const logoSize = Math.round(iconConfig.size * safeZoneRatio);
    const adaptivePadding = Math.round((iconConfig.size - logoSize) / 2);

    // Resize logo to safe zone size
    const resizedLogo = await resizeImage(buffer, logoSize, { backgroundColor: undefined });

    // Get metadata
    const metadata = await sharp(buffer).metadata();
    const hasAlpha = metadata.channels === 4 || metadata.hasAlpha;

    // Create transparent canvas and composite logo
    const bgColor = hasAlpha
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : { r: 255, g: 255, b: 255, alpha: 0 };

    const processedBuffer = await sharp(resizedLogo)
      .extend({
        top: adaptivePadding,
        bottom: adaptivePadding,
        left: adaptivePadding,
        right: adaptivePadding,
        background: bgColor,
      })
      .png()
      .toBuffer();

    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `android/${iconConfig.folder}/${iconConfig.filename}`,
    });
  }

  // Play Store icon (512x512)
  const playStoreBuffer = padding > 0
    ? await addPadding(buffer, ANDROID_PLAYSTORE_SIZE, padding, backgroundColor)
    : await resizeImage(buffer, ANDROID_PLAYSTORE_SIZE, { backgroundColor });

  results.push({
    filename: 'playstore-icon.png',
    buffer: playStoreBuffer,
    path: 'android/playstore-icon.png',
  });

  return results;
}

/**
 * Process logo for Web platform
 */
async function processForWeb(
  buffer: Buffer,
  options: ProcessingOptions = {}
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];
  const { padding = 0, backgroundColor } = options;

  // Favicon ICO file
  const faviconBuffer = await generateFavicon(buffer, WEB_FAVICON_ICO_SIZES);
  results.push({
    filename: 'favicon.ico',
    buffer: faviconBuffer,
    path: 'web/favicon.ico',
  });

  // Individual favicon PNGs
  for (const iconConfig of WEB_FAVICON_SIZES) {
    const processedBuffer = await resizeImage(buffer, iconConfig.size);
    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `web/${iconConfig.filename}`,
    });
  }

  // Apple Touch Icon
  const appleTouchBuffer = padding > 0
    ? await addPadding(buffer, WEB_APPLE_TOUCH_SIZE.size, padding, backgroundColor)
    : await resizeImage(buffer, WEB_APPLE_TOUCH_SIZE.size, { backgroundColor });
  results.push({
    filename: WEB_APPLE_TOUCH_SIZE.filename,
    buffer: appleTouchBuffer,
    path: `web/${WEB_APPLE_TOUCH_SIZE.filename}`,
  });

  // Web manifest icons (including maskable)
  for (const iconConfig of WEB_MANIFEST_SIZES) {
    let processedBuffer: Buffer;

    if (iconConfig.purpose === 'maskable') {
      // Maskable icons need more padding for safe zone (10% minimum)
      const maskablePadding = Math.max(padding, 10);
      processedBuffer = await addPadding(
        buffer,
        iconConfig.size,
        maskablePadding,
        backgroundColor || '#ffffff'
      );
    } else {
      processedBuffer = padding > 0
        ? await addPadding(buffer, iconConfig.size, padding, backgroundColor)
        : await resizeImage(buffer, iconConfig.size, { backgroundColor });
    }

    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `web/${iconConfig.filename}`,
    });
  }

  // Microsoft tile icons
  for (const iconConfig of WEB_MSTILE_SIZES) {
    const processedBuffer = padding > 0
      ? await addPadding(buffer, iconConfig.size, padding, backgroundColor)
      : await resizeImage(buffer, iconConfig.size, { backgroundColor });
    results.push({
      filename: iconConfig.filename,
      buffer: processedBuffer,
      path: `web/${iconConfig.filename}`,
    });
  }

  return results;
}

// ============================================================================
// Configuration Generation Functions
// ============================================================================

/**
 * Generate iOS Contents.json
 */
export function generateIOSContentsJson(): string {
  const structure = generateIOSContentsJsonStructure();
  return JSON.stringify(structure, null, 2);
}

/**
 * Generate Android XML configuration files
 */
export function generateAndroidXml(backgroundColor?: string): {
  icLauncher: string;
  icLauncherRound: string;
  colors: string;
} {
  return {
    icLauncher: ANDROID_IC_LAUNCHER_XML,
    icLauncherRound: ANDROID_IC_LAUNCHER_ROUND_XML,
    colors: generateAndroidColorsXml(backgroundColor || '#FFFFFF'),
  };
}

/**
 * Generate web manifest.json
 */
export function generateWebManifest(appName?: string): string {
  const structure = generateWebManifestStructure(appName || 'App');
  return JSON.stringify(structure, null, 2);
}

/**
 * Generate browserconfig.xml
 */
export function generateBrowserConfig(tileColor?: string): string {
  return generateBrowserConfigXml(tileColor || '#ffffff');
}

// ============================================================================
// Main Export Function
// ============================================================================

/**
 * Main function to process logo for specified platform
 * Returns a Map of filename -> Buffer for all generated images
 */
export async function processLogoForPlatform(
  logoBase64: string,
  platform: ExportPlatform,
  options: ProcessingOptions = {}
): Promise<Map<string, Buffer>> {
  const buffer = decodeBase64Image(logoBase64);
  const results = new Map<string, Buffer>();

  let processedImages: ProcessedImage[];

  switch (platform) {
    case 'ios':
      processedImages = await processForIOS(buffer, options);
      // Add Contents.json
      results.set('ios/AppIcon.appiconset/Contents.json', Buffer.from(generateIOSContentsJson()));
      break;

    case 'android':
      processedImages = await processForAndroid(buffer, options);
      // Add XML config files
      const androidXml = generateAndroidXml(options.backgroundColor);
      results.set('android/mipmap-anydpi-v26/ic_launcher.xml', Buffer.from(androidXml.icLauncher));
      results.set('android/mipmap-anydpi-v26/ic_launcher_round.xml', Buffer.from(androidXml.icLauncherRound));
      results.set('android/values/colors.xml', Buffer.from(androidXml.colors));
      break;

    case 'web':
      processedImages = await processForWeb(buffer, options);
      // Add manifest and browserconfig
      results.set('web/manifest.json', Buffer.from(generateWebManifest()));
      results.set('web/browserconfig.xml', Buffer.from(generateBrowserConfig(options.backgroundColor)));
      break;

    default:
      throw new Error(`Unknown platform: ${platform}`);
  }

  // Add all processed images to results
  for (const image of processedImages) {
    results.set(image.path, image.buffer);
  }

  return results;
}

/**
 * Process logo for multiple platforms
 */
export async function processLogoForPlatforms(
  logoBase64: string,
  platforms: ExportPlatform[],
  options: ProcessingOptions = {}
): Promise<Map<string, Buffer>> {
  const allResults = new Map<string, Buffer>();

  for (const platform of platforms) {
    const platformResults = await processLogoForPlatform(logoBase64, platform, options);
    for (const [path, buffer] of platformResults) {
      allResults.set(path, buffer);
    }
  }

  return allResults;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert hex color to RGBA object
 */
function hexToRgba(hex: string): { r: number; g: number; b: number; alpha: number } {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Parse hex values
  let r: number, g: number, b: number, alpha = 1;

  if (cleanHex.length === 3) {
    // Short format (#RGB)
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    // Standard format (#RRGGBB)
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else if (cleanHex.length === 8) {
    // With alpha (#RRGGBBAA)
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
    alpha = parseInt(cleanHex.slice(6, 8), 16) / 255;
  } else {
    // Default to white
    return { r: 255, g: 255, b: 255, alpha: 1 };
  }

  return { r, g, b, alpha };
}

/**
 * Validate base64 image string
 */
export function isValidBase64Image(base64String: string): boolean {
  // Check for data URL format
  const dataUrlMatch = base64String.match(/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/);

  if (dataUrlMatch) {
    // Extract the base64 part
    const base64Part = base64String.split(',')[1];
    return isValidBase64(base64Part);
  }

  // Check raw base64
  return isValidBase64(base64String);
}

/**
 * Check if string is valid base64
 */
function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) return false;

  try {
    // Check if it's valid base64 characters
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(str)) return false;

    // Try to decode
    const decoded = Buffer.from(str, 'base64');
    return decoded.length > 0;
  } catch {
    return false;
  }
}
