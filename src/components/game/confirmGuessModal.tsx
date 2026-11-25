import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import type { IConfirmGuessModalProps } from '@/types/game/interfaces/game';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export function ConfirmGuessModal({
  selectedNumber,
  onConfirm,
  onCancel,
}: IConfirmGuessModalProps) {
  return (
    <Modal
      visible={selectedNumber !== null}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons
            name="help-circle"
            size={48}
            color={colors.primary}
            style={styles.modalIcon}
          />
          <Text style={styles.modalTitle}>Tem certeza?</Text>
          <Text style={styles.modalDescription}>
            Você quer escolher o número{' '}
            <Text style={styles.modalNumber}>{selectedNumber}</Text>?
          </Text>
          <Text style={styles.modalWarning}>Essa decisão é irreversível!</Text>

          <View style={styles.modalButtons}>
            <PrimaryButton
              title="Confirmar"
              onPress={onConfirm}
              variant="primary"
              style={styles.modalButton}
            />
            <PrimaryButton
              title="Cancelar"
              onPress={onCancel}
              variant="ghost"
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalIcon: {
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
