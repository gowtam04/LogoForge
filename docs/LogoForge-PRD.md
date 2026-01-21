# Product Requirements Document (PRD)
# LogoForge — AI Logo & App Icon Generator

**Product Name:** LogoForge  
**Version:** 1.0  
**Last Updated:** January 13, 2026  
**Status:** Draft  
**Platform:** Web (Primary)  
**AI Backend:** Google Nano Banana Pro (Gemini 3 Pro Image)

---

## 1. Executive Summary

LogoForge is a free, AI-powered web application that enables app developers to generate professional logos and export-ready app icon bundles for all major platforms. Built on Google's Nano Banana Pro model, LogoForge transforms text descriptions, rough sketches, or reference images into polished, production-ready assets in seconds.

### Key Value Proposition

> From idea to App Store-ready icons in under 5 minutes — no design skills required.

---

## 2. Problem Statement

### Developer Pain Points

| Problem | Impact |
|---------|--------|
| Professional logo design is expensive ($500–$5,000+) | Indie developers skip branding or use low-quality alternatives |
| Icon export requirements are complex and platform-specific | Developers waste hours manually resizing and formatting |
| Design iteration is slow | Weeks of back-and-forth with designers delays launches |
| Generic logo makers produce cookie-cutter results | Apps look unprofessional and fail to stand out |

### Market Opportunity

- 30M+ developers globally building mobile and web apps
- 80% of indie developers handle their own branding
- Existing AI image generators lack app-specific export workflows

---

## 3. Target Users

### Primary Persona: Indie App Developer

- **Who:** Solo developers or small teams (1–5 people)
- **Goal:** Ship apps quickly with professional-looking branding
- **Tech comfort:** High — comfortable with APIs and dev tools
- **Design comfort:** Low to medium — knows good design when they see it, but can't create it
- **Budget:** Limited — prefers free or low-cost tools

### Secondary Personas

| Persona | Use Case |
|---------|----------|
| Startup Founders | Rapid MVP branding before fundraising |
| Hackathon Participants | Quick branding for demo day |
| Design Agencies | Rapid concept exploration for clients |
| Hobbyist Developers | Side project branding |

---

## 4. Product Goals & Success Metrics

### Goals (V1.0)

1. Enable users to generate a logo from any input type (text, sketch, reference) in under 60 seconds
2. Provide one-click export of complete icon bundles for iOS, Android, and web
3. Achieve user satisfaction score of 4.5+/5 on generated output quality

### Key Performance Indicators (KPIs)

| Metric | Target (Month 1) | Target (Month 6) |
|--------|------------------|------------------|
| Monthly Active Users | 5,000 | 50,000 |
| Logos Generated | 25,000 | 500,000 |
| Icon Bundles Exported | 10,000 | 200,000 |
| Average Session Duration | 8+ minutes | 10+ minutes |
| User Satisfaction (CSAT) | 4.0/5 | 4.5/5 |

---

## 5. Core Features & Requirements

### 5.1 Input Methods

#### Text-to-Logo Generation

**Description:** User describes their app/brand in natural language; AI generates logo concepts.

**Requirements:**
- Text input field with 500-character limit
- Support for style hints (e.g., "minimalist," "playful," "corporate")
- Optional fields: app name, tagline, industry/category
- Generate 4 variations per request

**Example Prompts:**
- "A fitness tracking app called FitPulse — modern, energetic, uses orange and black"
- "Minimalist logo for a note-taking app named Scribble"
- "Playful mascot logo for a kids' educational game about dinosaurs"

#### Sketch-to-Logo Generation

**Description:** User uploads or draws a rough sketch; AI refines it into a polished logo.

**Requirements:**
- Support image upload (PNG, JPG, WebP) up to 10MB
- Built-in canvas for freehand drawing (using Nano Banana's doodle feature)
- AI interprets sketch intent and generates refined versions
- Generate 4 variations per sketch

#### Reference-Based Generation

**Description:** User uploads 1–3 inspiration images; AI creates original logos in similar style.

**Requirements:**
- Multi-image upload (1–3 reference images)
- Style extraction from references (color palette, visual style, mood)
- Original output — not copies of references
- Optional text prompt to guide generation
- Generate 4 variations per request

### 5.2 Generation Engine

**Backend:** Google Nano Banana Pro API (Gemini 3 Pro Image)

**Requirements:**
- API integration via Google AI Studio / Vertex AI
- System prompts optimized for logo/icon generation
- Output resolution: 1024×1024 minimum (native)
- Support for transparent backgrounds (PNG with alpha)
- Generation time target: <10 seconds per batch of 4

**Nano Banana Pro Capabilities to Leverage:**
- Advanced text rendering (for logos with wordmarks)
- Style transfer from reference images
- Doodle-to-image refinement
- High-fidelity output with precise control
- Aspect ratio flexibility

### 5.3 Results & Selection

**Requirements:**
- Display 4 generated variations in a grid
- Click to expand/preview at full size
- "Regenerate" button to create 4 new variations (same input)
- "Regenerate Similar" to create variations of a selected favorite
- Simple selection UI — click to select, then proceed to export

### 5.4 Icon Bundle Export

**Description:** One-click export of selected logo as complete app icon bundles for all platforms.

#### iOS Export Bundle

| Asset | Size(s) | Format |
|-------|---------|--------|
| App Store Icon | 1024×1024 | PNG |
| iPhone App Icon | 180×180, 120×120, 87×87, 80×80, 60×60, 58×58, 40×40, 29×29, 20×20 | PNG |
| iPad App Icon | 167×167, 152×152, 83.5×83.5, 80×80, 76×76, 58×58, 40×40, 29×29, 20×20 | PNG |
| Spotlight & Settings | Various sizes | PNG |
| Contents.json | — | JSON (Xcode-compatible) |

**Delivery:** ZIP file named `iOS-AppIcons.zip`

#### Android Export Bundle

| Asset | Size(s) | Format |
|-------|---------|--------|
| Adaptive Icon Foreground | 432×432 | PNG |
| Adaptive Icon Background | 432×432 | PNG (solid or gradient) |
| Legacy Icons (mdpi–xxxhdpi) | 48, 72, 96, 144, 192, 512 | PNG |
| Play Store Icon | 512×512 | PNG |
| Round Icons | All densities | PNG |
| ic_launcher.xml | — | XML |

**Delivery:** ZIP file named `Android-AppIcons.zip`

#### Web Favicon Bundle

| Asset | Size(s) | Format |
|-------|---------|--------|
| favicon.ico | 16×16, 32×32, 48×48 (multi-size) | ICO |
| Apple Touch Icons | 180×180, 152×152, 120×120 | PNG |
| Android Chrome | 192×192, 512×512 | PNG |
| MS Tile | 150×150, 310×310 | PNG |
| site.webmanifest | — | JSON |
| browserconfig.xml | — | XML |

**Delivery:** ZIP file named `Web-Favicons.zip`

#### macOS & Windows Desktop (Optional/Future)

| Platform | Assets |
|----------|--------|
| macOS | .icns file (16–1024px) |
| Windows | .ico file (16–256px) |

#### Export Options

- **Download All:** Single ZIP containing all platform bundles
- **Download Individual:** Select specific platform(s)
- **Logo Only:** High-res PNG/SVG of logo without icon formatting

### 5.5 User Interface Requirements

#### Pages/Views

| Page | Purpose |
|------|---------|
| Landing/Home | Hero, value prop, CTA to start generating |
| Create | Input selection (text/sketch/reference) and generation interface |
| Results | Display generated logos, selection, regeneration |
| Export | Platform selection, preview, download |

#### Design Principles

- Clean, minimal interface — the logos are the focus
- Dark mode by default (developer preference) — MUI's `ThemeProvider` with dark theme
- Mobile-responsive but optimized for desktop workflow
- Instant feedback — loading states, progress indicators
- Zero sign-up required for basic usage (v1)

#### Material UI Components to Use

| Component | Use Case |
|-----------|----------|
| `Button` | Primary CTAs, regenerate, download |
| `TextField` | Text prompt entry (with multiline) |
| `ImageList` | Logo results display (2×2 grid) |
| `Card`, `CardMedia` | Individual logo containers |
| `Dialog` | Full-size logo preview |
| `Tabs`, `Tab` | Input method selection (text/sketch/reference) |
| `LinearProgress`, `CircularProgress` | Generation loading state |
| `Snackbar`, `Alert` | Success/error notifications |
| `Menu`, `MenuItem` | Platform selection dropdown |
| `Checkbox`, `FormControlLabel` | Multi-platform export selection |
| `Skeleton` | Loading placeholders for logos |
| `IconButton` | Secondary actions (regenerate, expand) |

---

## 6. Technical Architecture

### 6.1 System Overview

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Web Client    │────▶│  Next.js API Routes │────▶│  Nano Banana Pro    │
│   (Material UI)   │◀────│  (Vercel Serverless)│◀────│  (Google AI API)    │
└─────────────────┘     └─────────────────────┘     └─────────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Sharp (in /tmp) │
                        │  Process & ZIP   │
                        └─────────────────┘
                               │
                               ▼
                        Stream ZIP directly
                        to user's browser
```

### 6.2 Architecture Principles

- **No persistent storage:** All image processing happens in-memory or in `/tmp`
- **Stateless:** Each request is self-contained; no sessions required
- **Stream to client:** ZIP files stream directly to browser download, no intermediate storage
- **Minimal infrastructure:** Single Vercel deployment handles everything

### 6.3 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (React), TypeScript, Material UI (MUI) |
| Backend | Next.js API Routes (Vercel Serverless Functions) |
| AI Integration | Google AI Studio API (Nano Banana Pro) |
| Image Processing | Sharp (runs in serverless `/tmp` directory) |
| ZIP Creation | Archiver (streams ZIP directly to response) |
| Hosting | Vercel (free tier sufficient for launch) |
| Storage | None (all ephemeral/in-memory) |
| CDN | Vercel Edge Network (included by default) |

### 6.4 Why This Stack?

| Decision | Rationale |
|----------|-----------|
| **Material UI** | Mature ecosystem, extensive components, great theming, large community |
| **No Cloud Storage** | Generate → select → download flow doesn't need persistence |
| **No separate CDN** | Vercel includes global CDN automatically |
| **Sharp in /tmp** | Fast image resizing in serverless; no external service needed |
| **Stream ZIP** | Lower memory usage; user sees download start immediately |

### 6.5 Estimated Costs

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | 100GB bandwidth, 100 hours compute | Sufficient for ~10,000 users/month |
| Google AI Studio | Free tier available | Rate limited; upgrade for production |
| **Total** | **$0/month** | Until significant scale |

### 6.6 API Design

#### Generate Logo

```
POST /api/generate

Request Body:
{
  "mode": "text" | "sketch" | "reference",
  "prompt": "string (for text mode)",
  "images": ["base64 or URL (for sketch/reference mode)"],
  "options": {
    "style": "any" | "minimalist" | "playful" | "corporate" | "mascot",
    "includeText": true,
    "appName": "string (optional)",
    "colorHints": ["#hex"] (optional)
  }
}

Response:
{
  "id": "generation-uuid",
  "logos": [
    { "id": "logo-1", "url": "https://...", "thumbnail": "https://..." },
    { "id": "logo-2", "url": "https://...", "thumbnail": "https://..." },
    { "id": "logo-3", "url": "https://...", "thumbnail": "https://..." },
    { "id": "logo-4", "url": "https://...", "thumbnail": "https://..." }
  ],
  "generatedAt": "ISO timestamp"
}
```

#### Export Icons

```
POST /api/export

Request Body:
{
  "logoUrl": "https://... (URL from generation response)",
  "platforms": ["ios", "android", "web"],
  "options": {
    "backgroundColor": "#hex (for non-transparent platforms)",
    "padding": 10 (percentage, for safe area)
  }
}

Response:
- Content-Type: application/zip
- Content-Disposition: attachment; filename="LogoForge-icons.zip"
- Body: Streamed ZIP file containing all platform bundles

Note: ZIP streams directly to browser — no intermediate storage.
```

### 6.7 Nano Banana Pro Integration

**API Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent`

**System Prompt Template (Text-to-Logo):**

```
You are a world-class logo designer. Generate a professional, memorable logo based on the following description. The logo should:
- Be simple and recognizable at small sizes (app icons)
- Work on both light and dark backgrounds
- Have a balanced composition suitable for square cropping
- Use the style hints provided
- Include the app name if specified, rendered with clear, legible typography

Description: {user_prompt}
App Name: {app_name}
Style: {style}
```

**Output Requirements:**
- Request 1024×1024 resolution minimum
- Request transparent background (PNG)
- Use temperature 0.8–1.0 for creative variety
- Request 4 variations per call

---

## 7. User Flows

### 7.1 Primary Flow: Text-to-Logo → Export

```
1. User lands on homepage
   ↓
2. Clicks "Create Logo" CTA
   ↓
3. Selects "Describe with Text" input method
   ↓
4. Enters app name + description + optional style
   ↓
5. Clicks "Generate"
   ↓
6. Views 4 generated logos (loading: ~8 seconds)
   ↓
7. Clicks favorite logo to select
   ↓
8. Clicks "Export Icons"
   ↓
9. Selects platforms (iOS, Android, Web — all selected by default)
   ↓
10. Clicks "Download Bundle"
    ↓
11. ZIP file downloads automatically
```

### 7.2 Regeneration Flow

```
User views results → Not satisfied → Clicks "Regenerate All"
                                      ↓
                     4 new logos generated (same prompt)
                                      ↓
                     OR: Clicks "More Like This" on one logo
                                      ↓
                     4 variations of selected logo generated
```

---

## 8. Non-Functional Requirements

### Performance

| Metric | Requirement |
|--------|-------------|
| Logo generation time | < 12 seconds (95th percentile) |
| Export processing time | < 8 seconds for all platforms |
| Page load time (LCP) | < 2.5 seconds |
| Time to interactive | < 3.5 seconds |

### Scalability

- Support 1,000 concurrent users at launch
- Auto-scale to 10,000+ concurrent users
- Rate limit: 20 generations per user per hour (IP-based for free tier)

### Reliability

- 99.5% uptime target (Vercel SLA)
- Graceful degradation if Nano Banana Pro API is unavailable
- Clear error messages guide users to retry

### Security

- HTTPS everywhere (Vercel default)
- Sanitize all user inputs
- No permanent storage of user-generated content
- Rate limiting via Vercel middleware (IP-based)

---

## 9. Future Roadmap

### Version 1.1 (Month 2–3)

- [ ] User accounts (optional) with generation history
- [ ] Save and revisit previous logos
- [ ] Color palette extraction and customization
- [ ] SVG export option

### Version 1.2 (Month 4–6)

- [ ] Basic editing: adjust colors, add/edit text
- [ ] Brand kit: save colors, fonts, and style preferences
- [ ] Social media asset exports (OG images, banners)
- [ ] Figma plugin for direct export

### Version 2.0 (Month 6+)

- [ ] Premium tier with higher limits and advanced features
- [ ] API access for developers
- [ ] Team workspaces
- [ ] Animation: animated logos and icons
- [ ] AI-powered brand guidelines generation

---

## 10. Competitive Analysis

| Competitor | Strengths | Weaknesses | LogoForge Advantage |
|------------|-----------|------------|---------------------|
| Looka | Polished UI, brand kits | Expensive ($20–$65+), not app-focused | Free, app icon bundles |
| Hatchful (Shopify) | Free | Limited customization, dated | Nano Banana Pro quality |
| Midjourney | High quality | No icon exports, complex workflow | One-click app bundles |
| DALL-E / Ideogram | Good text rendering | No icon exports | Complete developer workflow |
| Canva | Versatile | Not AI-native, manual resizing | AI-first, auto-export |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Nano Banana Pro API rate limits | Medium | High | Implement queuing and user rate limits |
| Low-quality outputs for complex prompts | Medium | Medium | Provide prompt templates and examples |
| Copyright/trademark issues | Low | High | Add disclaimer; do not allow trademarked names |
| Vercel function timeout (10s limit) | Medium | Medium | Optimize Sharp processing; use streaming |
| Competitors launch similar features | High | Medium | Move fast; focus on developer-specific workflow |

---

## 12. Launch Plan

### Phase 1: Private Beta (Week 1–2)

- Deploy to limited audience (100 users)
- Gather feedback on generation quality and UX
- Iterate on prompts and export formats

### Phase 2: Public Beta (Week 3–4)

- Open access with rate limits
- Launch on Product Hunt, Hacker News, Reddit (r/webdev, r/androiddev, r/iOSProgramming)
- Social media campaign with example outputs

### Phase 3: General Availability (Week 5+)

- Remove beta label
- SEO optimization and content marketing
- Developer blog posts and tutorials

---

## 13. Success Criteria for V1 Launch

| Criterion | Target |
|-----------|--------|
| Successful logo generations | 90%+ success rate |
| Export bundle correctness | 100% valid for Xcode/Android Studio |
| User satisfaction | 4.0+/5 average rating |
| Organic growth | 20% week-over-week user growth post-launch |

---

## 14. Open Questions

1. **Monetization timeline:** When to introduce premium tier?
2. **API access:** Offer public API for developers to integrate?
3. **Asset licensing:** What license applies to generated logos?
4. **Trademark screening:** Integrate trademark database checks?

---

## Appendix A: Icon Size Reference

### iOS App Icon Sizes (Complete)

| Device | Size | Scale | Filename |
|--------|------|-------|----------|
| App Store | 1024×1024 | 1x | AppIcon-1024.png |
| iPhone | 180×180 | 3x | AppIcon-60@3x.png |
| iPhone | 120×120 | 2x | AppIcon-60@2x.png |
| iPad Pro | 167×167 | 2x | AppIcon-83.5@2x.png |
| iPad | 152×152 | 2x | AppIcon-76@2x.png |
| Spotlight | 120×120 | 3x | AppIcon-40@3x.png |
| Spotlight | 80×80 | 2x | AppIcon-40@2x.png |
| Settings | 87×87 | 3x | AppIcon-29@3x.png |
| Settings | 58×58 | 2x | AppIcon-29@2x.png |
| Notification | 60×60 | 3x | AppIcon-20@3x.png |
| Notification | 40×40 | 2x | AppIcon-20@2x.png |

### Android Adaptive Icon Sizes

| Density | Legacy Size | Foreground/Background |
|---------|-------------|----------------------|
| mdpi | 48×48 | 108×108 |
| hdpi | 72×72 | 162×162 |
| xhdpi | 96×96 | 216×216 |
| xxhdpi | 144×144 | 324×324 |
| xxxhdpi | 192×192 | 432×432 |
| Play Store | 512×512 | — |

---

## Appendix B: Sample Prompts for Testing

```
1. "Minimalist logo for a meditation app called 'Calm Harbor' — uses blue and white, ocean wave motif"

2. "Playful mascot logo for a kids' coding education app named 'CodeMonkey' — friendly cartoon monkey with glasses"

3. "Professional logo for a B2B invoicing app called 'QuickBooks Alternative' — modern, trustworthy, green accent color"

4. "Retro pixel art style logo for an indie game called 'Dungeon Dash'"

5. "Abstract geometric logo for a productivity app named 'Focus' — clean lines, no text, works as app icon"
```

---

*End of Document*
