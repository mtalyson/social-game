/**
 * Spacing scale based on a 4px grid.
 *
 * Consistent spacing makes the UI feel cohesive and professional.
 */

export const spacing = {
  /** 4px — minimal padding, tight gaps */
  xs: 4,
  /** 8px — compact spacing */
  sm: 8,
  /** 12px — slightly above compact */
  md: 12,
  /** 16px — standard padding */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px — section spacing */
  xxl: 24,
  /** 32px — large section gaps */
  xxxl: 32,
  /** 48px — hero spacing */
  huge: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;
