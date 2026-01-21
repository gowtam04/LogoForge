// Logo generation types
export type LogoStyle = 'any' | 'minimalist' | 'playful' | 'corporate' | 'mascot';

export interface GenerationRequest {
  mode: 'text' | 'reference';
  prompt: string;
  images?: string[]; // Base64 encoded images for reference mode
  options: {
    style: LogoStyle;
    appName?: string;
    colorHints?: string;
  };
}

export interface GeneratedLogo {
  id: string;
  base64: string;
  mimeType: string;
}

export interface GenerationResponse {
  id: string;
  logos: GeneratedLogo[];
  generatedAt: string;
}

// Export types
export type ExportPlatform = 'ios' | 'android' | 'web';

export interface IconSize {
  size: number;
  filename: string;
  scale?: string; // For iOS @2x, @3x
  purpose?: string; // For web manifest (any, maskable)
}

export interface PlatformIconConfig {
  platform: ExportPlatform;
  sizes: IconSize[];
  metadata?: Record<string, unknown>;
}

export interface ExportRequest {
  logoBase64: string;
  platforms: ExportPlatform[];
  backgroundColor?: string;
  padding?: number; // Percentage (0-20)
}

export interface ExportResponse {
  success: boolean;
  filename: string;
  // ZIP file will be streamed directly
}

// Form state types
export interface TextFormState {
  prompt: string;
  appName: string;
  style: LogoStyle;
  colorHints: string;
}

export interface ReferenceFormState {
  images: File[];
  prompt: string;
  style: LogoStyle;
}

// Generation state for results page
export interface GenerationState {
  request: GenerationRequest;
  response: GenerationResponse | null;
  selectedLogoId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Agent interview types
export interface InterviewQuestion {
  question: string;
  answer: string;
}

export interface AgentInterviewRequest {
  previousAnswers: InterviewQuestion[];
  currentStep: number;
}

export interface AgentInterviewResponse {
  question: string;
  isLastQuestion: boolean;
}

export interface AgentFinalizeRequest {
  answers: InterviewQuestion[];
}

export interface AgentFinalizeResponse {
  prompt: string;
  style: LogoStyle;
  appName?: string;
  colorHints?: string;
}

export interface AgentInitialValues {
  questions?: string[];
  answers?: string[];
  style?: string;
}
