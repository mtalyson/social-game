import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  hero: {
    fontFamily,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  } as TextStyle,

  title: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,

  heading: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
  } as TextStyle,

  subtitle: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  bodyBold: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
  } as TextStyle,

  caption: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
  } as TextStyle,

  gridNumber: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
  } as TextStyle,

  resultNumber: {
    fontFamily,
    fontSize: 64,
    fontWeight: '800',
  } as TextStyle,

  button: {
    fontFamily,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as TextStyle,
} as const;
