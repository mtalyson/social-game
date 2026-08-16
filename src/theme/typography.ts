/**
 * Typography scale for the bar game UI.
 *
 * Uses system fonts for minimal bundle size in the MVP.
 * Sizes are optimized for readability in low-light bar environments.
 */

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  /** Big hero title — HomeScreen, game logo */
  hero: {
    fontFamily,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  } as TextStyle,

  /** Screen titles */
  title: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,

  /** Section headings */
  heading: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
  } as TextStyle,

  /** Subheadings and banners */
  subtitle: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,

  /** Default body text */
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  /** Body bold */
  bodyBold: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
  } as TextStyle,

  /** Small labels and captions */
  caption: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
  } as TextStyle,

  /** Numbers inside the grid cells */
  gridNumber: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
  } as TextStyle,

  /** Large result number reveal */
  resultNumber: {
    fontFamily,
    fontSize: 64,
    fontWeight: '800',
  } as TextStyle,

  /** Button labels */
  button: {
    fontFamily,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as TextStyle,
} as const;
