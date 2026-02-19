// ─── Contest Configuration ─────────────────────────────────────
// Centralized config — no more magic numbers scattered across components

export const CONTEST_CONFIG = {
  name: 'Break the Loop',
  tagline: 'Debug. Decode. Deliver.',
  organizer: 'GDG on Campus VIT-M',
  orgUrl: 'https://github.com/GDGVITM',
  repoUrl: 'https://github.com/GDGVITM/women-centric-contest',

  // Timer
  roundOneDurationMinutes: 30,

  // Limits
  maxTeams: 20,
  membersPerTeam: 3,
  maxCodeSizeBytes: 50 * 1024, // 50KB
  maxUnlockAttempts: 10,

  // Input validation
  maxSolutionTitleLength: 200,
  maxSolutionTextLength: 5000,
  maxKeyFeaturesLength: 2000,
  maxDashboardUrlLength: 500,

  // Languages
  supportedLanguages: ['c', 'java', 'python'] as const,

  // GDG Brand Colors
  colors: {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC04',
    green: '#34A853',
  },
} as const;

export type SupportedLanguage = (typeof CONTEST_CONFIG.supportedLanguages)[number];
