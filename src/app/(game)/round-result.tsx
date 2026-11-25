import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/features/game/context/gameContext';
import { EGamePhase, ELossReason } from '@/types/game/enums/game';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export default function RoundResultScreen() {
  const router = useRouter();
  const { state, nextRound, changePlayers, resetGame } = useGame();
  const isLeavingRef = useRef(false);

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.9));

  const result =
    state.phase === EGamePhase.ROUND_RESULT ? state.roundResult : null;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 6,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (!isLeavingRef.current && state.phase === EGamePhase.SETUP) {
      router.replace('/');
    }
  }, [state.phase, router]);

  if (!result) return null;

  const reasonConfig: {
    icon: ComponentProps<typeof Ionicons>['name'];
    text: string;
  } = (() => {
    switch (result.reason) {
      case ELossReason.GUESSED_SECRET:
        return {
          icon: 'locate',
          text: `${result.loser.name} escolheu o número sorteado!`,
        };
      case ELossReason.LAST_NUMBER_REMAINING:
        return {
          icon: 'alert-circle',
          text: `Sobrou apenas o número ${result.secretNumber}! ${result.loser.name} era o jogador da vez e não teve outra escolha!`,
        };
      case ELossReason.REVEALED_BY_ELIMINATION:
        return {
          icon: 'search',
          text: `O palpite revelou que o número sorteado só podia ser ${result.secretNumber}. Quem iniciou a rodada paga!`,
        };
    }
  })();

  const handleNextRound = () => {
    isLeavingRef.current = true;
    nextRound();
    router.replace('/game');
  };

  const handleChangePlayers = () => {
    isLeavingRef.current = true;
    changePlayers();
    router.replace('/setup');
  };

  const handleEndGame = () => {
    isLeavingRef.current = true;
    resetGame();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.resultCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{result.loser.name}</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>Bebe!</Text>
            <Ionicons name="beer" size={26} color={colors.dangerLight} />
          </View>

          <View style={styles.secretContainer}>
            <Text style={styles.secretLabel}>O número sorteado era:</Text>
            <Text style={styles.secretNumber}>{result.secretNumber}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.reasonCard, { opacity: fadeAnim }]}>
          <Ionicons
            name={reasonConfig.icon}
            size={24}
            color={colors.primary}
            style={styles.reasonIcon}
          />
          <Text style={styles.reasonText}>{reasonConfig.text}</Text>
        </Animated.View>

        <Animated.View style={[styles.nextRoundInfo, { opacity: fadeAnim }]}>
          <Text style={styles.nextRoundText}>
            {result.loser.name} começa a próxima rodada
          </Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Próxima Rodada"
          iconName="refresh"
          onPress={handleNextRound}
          variant="primary"
        />

        <View style={styles.buttonSpacer} />

        <PrimaryButton
          title="Mudar Jogadores"
          iconName="people"
          onPress={handleChangePlayers}
          variant="secondary"
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
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
  },
  resultCard: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
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
    marginTop: spacing.xxxl,
    backgroundColor: colors.dangerMuted,
    paddingHorizontal: spacing.xxl,
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
  reasonIcon: {
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
