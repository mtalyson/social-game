/**
 * Color palette for "Jogo do Número" — Dark bar theme.
 *
 * Designed for low-light environments (bars, pubs) with high contrast
 * and warm amber/gold tones reminiscent of beer and bar ambiance.
 */

export const colors = {
  // Backgrounds
  background: '#0A0A12',
  surface: '#14142B',
  surfaceLight: '#1C1C3A',
  surfaceElevated: '#242448',

  // Primary — warm amber/gold (beer color)
  primary: '#E6A817',
  primaryLight: '#F0C44A',
  primaryDark: '#C48A00',
  primaryMuted: 'rgba(230, 168, 23, 0.15)',

  // Accent — warm orange
  accent: '#FF6B35',
  accentLight: '#FF8F63',

  // Text
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0B8',
  textMuted: '#666680',
  textOnPrimary: '#0A0A12',

  // Number grid states
  numberAvailable: '#1E1E44',
  numberAvailableBorder: '#3A3A6E',
  numberDisabled: '#111120',
  numberDisabledText: '#333350',

  // Semantic
  danger: '#FF4455',
  dangerLight: '#FF6B78',
  dangerMuted: 'rgba(255, 68, 85, 0.15)',
  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.15)',

  // Utility
  overlay: 'rgba(0, 0, 0, 0.7)',
  border: '#2A2A4A',
  divider: '#1E1E3A',

  // Gradient presets (for LinearGradient)
  gradientPrimary: ['#E6A817', '#FF6B35'] as const,
  gradientDark: ['#0A0A12', '#14142B'] as const,
  gradientDanger: ['#FF4455', '#FF6B35'] as const,
} as const;
