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
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  resultCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.danger,
    textAlign: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.title,
    color: colors.dangerLight,
    textAlign: 'center',
  },
  secretContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    backgroundColor: colors.dangerMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  secretLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  secretNumber: {
    ...typography.resultNumber,
    fontSize: 52,
    color: colors.danger,
  },
  scoreboardCard: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreboardTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  scoreboardList: {
    maxHeight: 150,
  },
  scoreboardListContent: {
    gap: spacing.sm,
  },
  scoreboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreboardName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  scoreboardNameHighlight: {
    color: colors.dangerLight,
    fontWeight: '700',
  },
  scoreboardDrinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreboardCount: {
    ...typography.bodyBold,
    color: colors.primary,
    minWidth: 18,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  buttonSpacer: {
    height: spacing.md,
  },
});
