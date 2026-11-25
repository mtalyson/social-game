import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ruleIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  ruleDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
});
