import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { NumberGrid } from '@/features/game/components/numberGrid';
import { PlayerTurnBanner } from '@/features/game/components/playerTurnBanner';
import { ConfirmGuessModal } from '@/features/game/components/confirmGuessModal';
import { useGame } from '@/features/game/context/gameContext';
import { EGamePhase } from '@/types/game/enums/game';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function GameScreen() {
  const router = useRouter();

  const { state, makeGuess, resetGame, currentPlayer, availableBounds } =
    useGame();

  const [confirmNumber, setConfirmNumber] = useState<number | null>(null);

  useEffect(() => {
    if (state.phase === EGamePhase.ROUND_RESULT) {
      router.replace('/round-result');
    }
  }, [state.phase, router]);

  useEffect(() => {
    if (state.phase === EGamePhase.SETUP || state.players.length === 0) {
      router.replace('/');
    }
  }, [state.phase, state.players.length, router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Sair do jogo?', 'Você perderá o progresso da partida.', [
          { text: 'Continuar', style: 'cancel' },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: () => {
              resetGame();
              router.replace('/');
            },
          },
        ]);

        return true;
      },
    );

    return () => backHandler.remove();
  }, [resetGame, router]);

  const handleSelectNumber = useCallback((num: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setConfirmNumber(num);
  }, []);

  const handleConfirmGuess = useCallback(() => {
    if (confirmNumber === null) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    makeGuess(confirmNumber);
    setConfirmNumber(null);
  }, [confirmNumber, makeGuess]);

  const handleCancelGuess = useCallback(() => {
    setConfirmNumber(null);
  }, []);

  if (state.phase !== EGamePhase.PLAYING || !currentPlayer) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PlayerTurnBanner
          playerName={currentPlayer.name}
          roundNumber={state.roundNumber}
        />

        <View style={styles.gridContainer}>
          <NumberGrid
            disabledNumbers={state.disabledNumbers}
            onSelectNumber={handleSelectNumber}
            minAvailable={availableBounds?.min ?? null}
            maxAvailable={availableBounds?.max ?? null}
          />
        </View>
      </ScrollView>

      <ConfirmGuessModal
        selectedNumber={confirmNumber}
        onConfirm={handleConfirmGuess}
        onCancel={handleCancelGuess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.huge,
  },
  gridContainer: {
    marginTop: spacing.xl,
  },
});
