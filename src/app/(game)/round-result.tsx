import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/features/game/context/gameContext';
import { EGamePhase, ELossReason } from '@/types/game/enums/game';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export default function RoundResultScreen() {
  const router = useRouter();
  const { state, nextRound, resetGame } = useGame();

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.5));
  const [slideAnim] = useState(() => new Animated.Value(50));

  const result =
    state.phase === EGamePhase.ROUND_RESULT ? state.roundResult : null;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 8,
        }),
      ]),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 10,
        bounciness: 4,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

  if (!result) return null;

  const isDirectHit = result.reason === ELossReason.GUESSED_SECRET;

  const reasonText = isDirectHit
    ? `${result.loser.name} escolheu o número secreto!`
    : `O palpite revelou que o número secreto só podia ser ${result.secretNumber}. Quem iniciou a rodada paga!`;

  const handleNextRound = () => {
    nextRound();
    router.replace('/game');
  };

  const handleEndGame = () => {
    resetGame();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.resultCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.emoji}>🍺</Text>
          <Text style={styles.title}>{result.loser.name}</Text>
          <Text style={styles.subtitle}>bebe!</Text>

          <View style={styles.secretContainer}>
            <Text style={styles.secretLabel}>O número secreto era</Text>
            <Text style={styles.secretNumber}>{result.secretNumber}</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.reasonCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.reasonEmoji}>{isDirectHit ? '🎯' : '🔍'}</Text>
          <Text style={styles.reasonText}>{reasonText}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.nextRoundInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.nextRoundText}>
            {result.loser.name} começa a próxima rodada
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Próxima Rodada 🔄"
          onPress={handleNextRound}
          variant="primary"
        />
        <View style={styles.buttonSpacer} />
        <PrimaryButton
          title="Encerrar Jogo"
          onPress={handleEndGame}
          variant="ghost"
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  resultCard: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.danger,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.title,
    color: colors.dangerLight,
    marginTop: spacing.xs,
  },
  secretContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    backgroundColor: colors.dangerMuted,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
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
    color: colors.danger,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  reasonText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  nextRoundInfo: {
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  nextRoundText: {
    ...typography.caption,
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  buttonSpacer: {
    height: spacing.md,
  },
});
