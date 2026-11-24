import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/primaryButton';
import type { IRuleItem } from '@/types/rules/interfaces/rules';
import { HOW_TO_PLAY_RULES } from '@/constants/rules/rules';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

function RuleCard({ emoji, title, description }: IRuleItem) {
  return (
    <View style={styles.ruleCard}>
      <Text style={styles.ruleEmoji}>{emoji}</Text>
      <View style={styles.ruleContent}>
        <Text style={styles.ruleTitle}>{title}</Text>
        <Text style={styles.ruleDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function HowToPlayScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Como Jogar 🎮</Text>
        <Text style={styles.subtitle}>
          Um jogo simples para beber com os amigos!
        </Text>

        {HOW_TO_PLAY_RULES.map((rule) => (
          <RuleCard key={rule.title} {...rule} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Entendi! Vamos jogar"
          onPress={() => router.back()}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
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
  ruleEmoji: {
    fontSize: 28,
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
