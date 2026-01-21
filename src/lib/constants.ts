/**
 * Centralized storage keys for sessionStorage
 * This prevents typos and makes it easy to track storage usage
 */
export const STORAGE_KEYS = {
  GENERATION_RESULT: 'generationResult',
  SELECTED_LOGO: 'selectedLogo',
  GENERATION_REQUEST: 'generationRequest',
  AGENT_WIZARD_STATE: 'agentWizardState',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
