import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { NumberGrid } from '@/components/game/numberGrid';
import { PlayerTurnBanner } from '@/components/game/playerTurnBanner';
import { ConfirmGuessModal } from '@/components/game/confirmGuessModal';
import { useGame } from '@/hooks/useGame';
import { EGamePhase } from '@/types/game/enums/game';
import { colors } from '@/theme/colors';
import { styles } from './styles';

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

  const confirmExitGame = useCallback(() => {
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
  }, [resetGame, router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        confirmExitGame();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [confirmExitGame]);

  const isTwoNumbersRemaining =
    availableBounds !== null && availableBounds.max - availableBounds.min === 1;

  const handleSelectNumber = useCallback(
    (num: number) => {
      if (isTwoNumbersRemaining) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setConfirmNumber(num);
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      makeGuess(num);
    },
    [isTwoNumbersRemaining, makeGuess],
  );

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
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={confirmExitGame}
            style={styles.exitButton}
            accessibilityRole="button"
            accessibilityLabel="Sair do jogo"
          >
            <Ionicons
              name="log-out-outline"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.exitText}>Sair</Text>
          </TouchableOpacity>
        </View>

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
