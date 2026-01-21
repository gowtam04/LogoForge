/**
 * Icon size configurations for iOS, Android, and Web platforms
 * Used by the export system to generate properly sized icons
 */

import type { ExportPlatform, IconSize, PlatformIconConfig } from '@/types';

// ============================================================================
// iOS Icon Configurations (AppIcon.appiconset)
// ============================================================================

export interface IOSIconSize extends IconSize {
  idiom: 'iphone' | 'ipad' | 'ios-marketing' | 'universal';
  scale: '1x' | '2x' | '3x';
  platform?: 'ios';
}

export const IOS_ICON_SIZES: IOSIconSize[] = [
  // App Store (required)
  { size: 1024, filename: 'AppIcon-1024.png', idiom: 'ios-marketing', scale: '1x' },

  // iPhone icons
  { size: 180, filename: 'AppIcon-60@3x.png', idiom: 'iphone', scale: '3x' },
  { size: 120, filename: 'AppIcon-60@2x.png', idiom: 'iphone', scale: '2x' },
  { size: 120, filename: 'AppIcon-40@3x.png', idiom: 'iphone', scale: '3x' },
  { size: 87, filename: 'AppIcon-29@3x.png', idiom: 'iphone', scale: '3x' },
  { size: 80, filename: 'AppIcon-40@2x.png', idiom: 'iphone', scale: '2x' },
  { size: 58, filename: 'AppIcon-29@2x.png', idiom: 'iphone', scale: '2x' },
  { size: 40, filename: 'AppIcon-20@2x.png', idiom: 'iphone', scale: '2x' },

  // iPad icons
  { size: 167, filename: 'AppIcon-83.5@2x.png', idiom: 'ipad', scale: '2x' },
  { size: 152, filename: 'AppIcon-76@2x.png', idiom: 'ipad', scale: '2x' },
  { size: 80, filename: 'AppIcon-40@2x-ipad.png', idiom: 'ipad', scale: '2x' },
  { size: 76, filename: 'AppIcon-76@1x.png', idiom: 'ipad', scale: '1x' },
  { size: 40, filename: 'AppIcon-40@1x.png', idiom: 'ipad', scale: '1x' },
  { size: 40, filename: 'AppIcon-20@2x-ipad.png', idiom: 'ipad', scale: '2x' },
  { size: 29, filename: 'AppIcon-29@1x.png', idiom: 'ipad', scale: '1x' },
  { size: 20, filename: 'AppIcon-20@1x.png', idiom: 'ipad', scale: '1x' },
];

// Point sizes for Contents.json (actual size = point * scale)
export const IOS_POINT_SIZES: { points: number; idioms: ('iphone' | 'ipad')[] }[] = [
  { points: 20, idioms: ['iphone', 'ipad'] },
  { points: 29, idioms: ['iphone', 'ipad'] },
  { points: 40, idioms: ['iphone', 'ipad'] },
  { points: 60, idioms: ['iphone'] },
  { points: 76, idioms: ['ipad'] },
  { points: 83.5, idioms: ['ipad'] },
];

// ============================================================================
// Android Icon Configurations (mipmap folders)
// ============================================================================

export type AndroidDensity = 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi';

export interface AndroidIconSize extends IconSize {
  density: AndroidDensity;
  folder: string;
}

// Standard launcher icons
export const ANDROID_LAUNCHER_SIZES: AndroidIconSize[] = [
  { size: 48, filename: 'ic_launcher.png', density: 'mdpi', folder: 'mipmap-mdpi' },
  { size: 72, filename: 'ic_launcher.png', density: 'hdpi', folder: 'mipmap-hdpi' },
  { size: 96, filename: 'ic_launcher.png', density: 'xhdpi', folder: 'mipmap-xhdpi' },
  { size: 144, filename: 'ic_launcher.png', density: 'xxhdpi', folder: 'mipmap-xxhdpi' },
  { size: 192, filename: 'ic_launcher.png', density: 'xxxhdpi', folder: 'mipmap-xxxhdpi' },
];

// Round launcher icons (Android 7.1+)
export const ANDROID_ROUND_SIZES: AndroidIconSize[] = [
  { size: 48, filename: 'ic_launcher_round.png', density: 'mdpi', folder: 'mipmap-mdpi' },
  { size: 72, filename: 'ic_launcher_round.png', density: 'hdpi', folder: 'mipmap-hdpi' },
  { size: 96, filename: 'ic_launcher_round.png', density: 'xhdpi', folder: 'mipmap-xhdpi' },
  { size: 144, filename: 'ic_launcher_round.png', density: 'xxhdpi', folder: 'mipmap-xxhdpi' },
  { size: 192, filename: 'ic_launcher_round.png', density: 'xxxhdpi', folder: 'mipmap-xxxhdpi' },
];

// Adaptive icon foreground (108dp with 72dp safe zone, scaled per density)
// The foreground layer is 108dp, where the inner 72dp is the safe zone
export const ANDROID_ADAPTIVE_SIZES: AndroidIconSize[] = [
  { size: 108, filename: 'ic_launcher_foreground.png', density: 'mdpi', folder: 'mipmap-mdpi' },
  { size: 162, filename: 'ic_launcher_foreground.png', density: 'hdpi', folder: 'mipmap-hdpi' },
  { size: 216, filename: 'ic_launcher_foreground.png', density: 'xhdpi', folder: 'mipmap-xhdpi' },
  { size: 324, filename: 'ic_launcher_foreground.png', density: 'xxhdpi', folder: 'mipmap-xxhdpi' },
  { size: 432, filename: 'ic_launcher_foreground.png', density: 'xxxhdpi', folder: 'mipmap-xxxhdpi' },
];

// Play Store icon
export const ANDROID_PLAYSTORE_SIZE = 512;

// Density multipliers for Android
export const ANDROID_DENSITY_MULTIPLIERS: Record<AndroidDensity, number> = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4,
};

// ============================================================================
// Web Icon Configurations
// ============================================================================

export interface WebIconSize extends IconSize {
  purpose?: 'any' | 'maskable' | 'monochrome';
  type?: string;
}

// Favicon sizes (for .ico file, contains multiple sizes)
export const WEB_FAVICON_ICO_SIZES = [16, 32, 48];

// Individual favicon PNG files
export const WEB_FAVICON_SIZES: WebIconSize[] = [
  { size: 16, filename: 'favicon-16x16.png' },
  { size: 32, filename: 'favicon-32x32.png' },
  { size: 48, filename: 'favicon-48x48.png' },
];

// Apple Touch Icon
export const WEB_APPLE_TOUCH_SIZE: WebIconSize = {
  size: 180,
  filename: 'apple-touch-icon.png',
};

// Web manifest icons (PWA)
export const WEB_MANIFEST_SIZES: WebIconSize[] = [
  { size: 192, filename: 'android-chrome-192x192.png', purpose: 'any' },
  { size: 512, filename: 'android-chrome-512x512.png', purpose: 'any' },
  { size: 192, filename: 'android-chrome-192x192-maskable.png', purpose: 'maskable' },
  { size: 512, filename: 'android-chrome-512x512-maskable.png', purpose: 'maskable' },
];

// Microsoft tile icons
export const WEB_MSTILE_SIZES: WebIconSize[] = [
  { size: 150, filename: 'mstile-150x150.png' },
  { size: 310, filename: 'mstile-310x310.png' },
];

// Safari pinned tab (SVG would be ideal, but we'll provide a PNG)
export const WEB_SAFARI_PINNED_SIZE: WebIconSize = {
  size: 512,
  filename: 'safari-pinned-tab.png',
};

// ============================================================================
// Combined Platform Configurations
// ============================================================================

export const PLATFORM_CONFIGS: Record<ExportPlatform, PlatformIconConfig> = {
  ios: {
    platform: 'ios',
    sizes: IOS_ICON_SIZES,
    metadata: {
      folderName: 'AppIcon.appiconset',
      contentsJsonRequired: true,
    },
  },
  android: {
    platform: 'android',
    sizes: [
      ...ANDROID_LAUNCHER_SIZES,
      ...ANDROID_ROUND_SIZES,
      ...ANDROID_ADAPTIVE_SIZES,
      { size: ANDROID_PLAYSTORE_SIZE, filename: 'playstore-icon.png' } as AndroidIconSize,
    ],
    metadata: {
      folders: ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'],
      xmlConfigRequired: true,
    },
  },
  web: {
    platform: 'web',
    sizes: [
      ...WEB_FAVICON_SIZES,
      WEB_APPLE_TOUCH_SIZE,
      ...WEB_MANIFEST_SIZES,
      ...WEB_MSTILE_SIZES,
    ],
    metadata: {
      faviconIcoSizes: WEB_FAVICON_ICO_SIZES,
      manifestRequired: true,
      browserConfigRequired: true,
    },
  },
};

// ============================================================================
// Helper Functions for Configuration Generation
// ============================================================================

/**
 * Get all unique sizes needed for a platform
 */
export function getUniqueSizes(platform: ExportPlatform): number[] {
  const config = PLATFORM_CONFIGS[platform];
  const sizes = new Set(config.sizes.map(s => s.size));
  return Array.from(sizes).sort((a, b) => b - a);
}

/**
 * Get the folder structure for a platform
 */
export function getFolderStructure(platform: ExportPlatform): string[] {
  switch (platform) {
    case 'ios':
      return ['ios/AppIcon.appiconset'];
    case 'android':
      return [
        'android/mipmap-mdpi',
        'android/mipmap-hdpi',
        'android/mipmap-xhdpi',
        'android/mipmap-xxhdpi',
        'android/mipmap-xxxhdpi',
      ];
    case 'web':
      return ['web'];
    default:
      return [];
  }
}

/**
 * Generate iOS Contents.json structure
 * Uses the actual IOS_ICON_SIZES configuration to ensure consistency
 */
export function generateIOSContentsJsonStructure(): object {
  const images: object[] = [];

  // Generate entries from the actual IOS_ICON_SIZES configuration
  for (const iconSize of IOS_ICON_SIZES) {
    // Calculate point size from actual size and scale
    const scaleMultiplier = iconSize.scale === '1x' ? 1 : iconSize.scale === '2x' ? 2 : 3;
    const pointSize = iconSize.size / scaleMultiplier;

    images.push({
      filename: iconSize.filename,
      idiom: iconSize.idiom,
      scale: iconSize.scale,
      size: `${pointSize}x${pointSize}`,
    });
  }

  return {
    images,
    info: {
      author: 'LogoForge',
      version: 1,
    },
  };
}

/**
 * Android ic_launcher.xml template for adaptive icons
 */
export const ANDROID_IC_LAUNCHER_XML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

/**
 * Android ic_launcher_round.xml template
 */
export const ANDROID_IC_LAUNCHER_ROUND_XML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

/**
 * Android colors.xml template for launcher background
 */
export function generateAndroidColorsXml(backgroundColor: string = '#FFFFFF'): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${backgroundColor}</color>
</resources>`;
}

/**
 * Web manifest.json structure
 */
export function generateWebManifestStructure(appName: string = 'App'): object {
  return {
    name: appName,
    short_name: appName,
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  };
}

/**
 * browserconfig.xml for Microsoft tiles
 */
export function generateBrowserConfigXml(tileColor: string = '#ffffff'): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <square310x310logo src="/mstile-310x310.png"/>
            <TileColor>${tileColor}</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
}

export default PLATFORM_CONFIGS;
