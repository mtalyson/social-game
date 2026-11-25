import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  heroIcon: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 48,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
  },
  buttonSpacer: {
    height: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  exitText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.huge,
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
