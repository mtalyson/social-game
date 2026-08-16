/**
 * GameScreen — Main gameplay screen.
 *
 * Displays the number grid, player turn banner, and handles the
 * confirmation modal before a guess is finalized. Navigates to
 * RoundResultScreen when a round ends.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { NumberGrid } from '@/components/NumberGrid';
import { PlayerTurnBanner } from '@/components/PlayerTurnBanner';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useGame } from '@/hooks/useGame';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export default function GameScreen() {
  const router = useRouter();
  const { state, makeGuess, currentPlayer, availableBounds } = useGame();
  const [confirmNumber, setConfirmNumber] = useState<number | null>(null);

  // Navigate to round-result when a round ends
  useEffect(() => {
    if (state.phase === 'roundResult' && state.roundResult) {
      router.replace('/round-result');
    }
  }, [state.phase, state.roundResult, router]);

  // Redirect to home if game state is invalid (e.g. user navigated directly)
  useEffect(() => {
    if (state.phase === 'setup' || state.players.length === 0) {
      router.replace('/');
    }
  }, [state.phase, state.players.length, router]);

  // Prevent accidental back navigation
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Sair do jogo?',
          'Você perderá o progresso da partida.',
          [
            { text: 'Continuar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: () => router.replace('/') },
          ]
        );
        return true;
      }
    );
    return () => backHandler.remove();
  }, [router]);

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

  if (!currentPlayer) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Player turn banner */}
        <PlayerTurnBanner
          playerName={currentPlayer.name}
          roundNumber={state.roundNumber}
        />

        {/* Number grid */}
        <View style={styles.gridContainer}>
          <NumberGrid
            disabledNumbers={state.disabledNumbers}
            onSelectNumber={handleSelectNumber}
            minAvailable={availableBounds?.min ?? null}
            maxAvailable={availableBounds?.max ?? null}
          />
        </View>
      </ScrollView>

      {/* Confirmation modal */}
      <Modal
        visible={confirmNumber !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelGuess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🤔</Text>
            <Text style={styles.modalTitle}>Tem certeza?</Text>
            <Text style={styles.modalDescription}>
              Você quer escolher o número{' '}
              <Text style={styles.modalNumber}>{confirmNumber}</Text>?
            </Text>
            <Text style={styles.modalWarning}>
              Essa decisão é irreversível!
            </Text>

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Confirmar"
                onPress={handleConfirmGuess}
                variant="primary"
                style={styles.modalButton}
              />
              <PrimaryButton
                title="Cancelar"
                onPress={handleCancelGuess}
                variant="ghost"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  modalContent: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  modalDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalNumber: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 20,
  },
  modalWarning: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  modalButtons: {
    width: '100%',
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  modalButton: {
    width: '100%',
  },
});
