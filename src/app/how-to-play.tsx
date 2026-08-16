/**
 * HowToPlayScreen — Rules explanation.
 *
 * Displays the game rules in a friendly, easy-to-read format
 * with emojis for visual scanning in a dark bar environment.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface RuleCardProps {
  emoji: string;
  title: string;
  description: string;
}

function RuleCard({ emoji, title, description }: RuleCardProps) {
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

        <RuleCard
          emoji="🎲"
          title="O Número Secreto"
          description="No início de cada rodada, o celular sorteia um número secreto entre 1 e 60. Ninguém sabe qual é!"
        />

        <RuleCard
          emoji="👆"
          title="Sua Vez"
          description="Na sua vez, escolha um número no grid. Se você acertar o número secreto... você bebe! 🍺"
        />

        <RuleCard
          emoji="🔽"
          title="Palpite Menor que o Secreto"
          description="Se o número que você escolheu é menor que o secreto, todos os números iguais ou menores ao seu palpite são eliminados. O jogo continua!"
        />

        <RuleCard
          emoji="🔼"
          title="Palpite Maior que o Secreto"
          description="Se o número que você escolheu é maior que o secreto, todos os números iguais ou maiores ao seu palpite são eliminados. O jogo continua!"
        />

        <RuleCard
          emoji="🎯"
          title="Caso Especial"
          description="Quando sobram apenas dois números consecutivos e alguém escolhe o errado, o número secreto é revelado! Nesse caso, quem bebe não é quem jogou por último, mas sim quem iniciou a rodada."
        />

        <RuleCard
          emoji="🔄"
          title="Próxima Rodada"
          description="Quem perdeu (bebeu) começa a próxima rodada. Um novo número secreto é sorteado e todos os 60 números voltam a ficar disponíveis."
        />

        <RuleCard
          emoji="🏆"
          title="Objetivo"
          description="Sobreviva o máximo de rodadas sem beber! Vai com calma nos palpites e tenta empurrar a bomba para os outros. 😄"
        />
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
