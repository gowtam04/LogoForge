# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Project Overview

LogoForge is an AI-powered logo generator that creates logos from text descriptions or reference images, then exports them as icon bundles for iOS, Android, and Web platforms.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Material UI, Google Generative AI (Gemini), Sharp for image processing.

## Architecture

### User Flow
1. **Landing** (`/`) → 2. **Create** (`/create`) → 3. **Results** (`/results`) → 4. **Export** (`/export`)

State between pages is passed via `sessionStorage`:
- `generationResult`: Stored after generation, read by results page
- `selectedLogo`: Stored after selection, read by export page

### API Routes

**POST `/api/generate`** - Logo generation
- Accepts `mode` ('text' | 'reference'), `prompt`, optional `images` (base64), and `options`
- Uses Gemini `gemini-2.0-flash-exp` model with image generation
- Returns 4 logo variations as base64

**POST `/api/export`** - Icon bundle export
- Accepts `logoBase64`, `platforms` array, optional `backgroundColor` and `padding`
- Uses Sharp for resizing, Archiver for ZIP creation
- Streams ZIP file with platform-specific folder structure

### Key Modules

**`src/lib/google-ai.ts`** - Gemini API integration with style-specific prompt engineering

**`src/lib/image-processing.ts`** - Sharp-based image resizing, padding, favicon.ico generation, and metadata file generation (Contents.json, manifest.json, etc.)

**`src/lib/icon-sizes.ts`** - Platform icon specifications for iOS (AppIcon.appiconset), Android (mipmap folders), and Web (favicons, PWA icons)

**`src/middleware.ts`** - Rate limiting for /api/generate (20 requests/hour per IP)

### Theme

Dark theme with indigo (`#6366f1`) as primary and amber/orange (`#f59e0b`) as accent. Configured in `src/theme/theme.ts`, applied via `ThemeRegistry` wrapper.

### Types

All shared types are in `src/types/index.ts`: `LogoStyle`, `GenerationRequest`, `GenerationResponse`, `ExportPlatform`, etc.

## Environment Variables

```
GOOGLE_AI_API_KEY=   # Required - Gemini API key from aistudio.google.com
```
