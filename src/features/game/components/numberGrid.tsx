import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { NumberCell } from './numberCell';
import type { INumberGridProps } from '@/types/game/interfaces/game';
import {
  GRID_COLUMNS,
  GRID_CELL_MARGIN,
  GRID_NUMBERS,
} from '@/constants/game/game';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export function NumberGrid({
  disabledNumbers,
  onSelectNumber,
  minAvailable,
  maxAvailable,
}: INumberGridProps) {
  const { width } = useWindowDimensions();
  const availableWidth =
    width - spacing.lg * 2 - GRID_COLUMNS * GRID_CELL_MARGIN;
  const cellSize = Math.max(
    40,
    Math.min(56, Math.floor(availableWidth / GRID_COLUMNS)),
  );

  return (
    <View style={styles.container}>
      {minAvailable !== null && maxAvailable !== null && (
        <View style={styles.rangeIndicator}>
          <Text style={styles.rangeText}>
            🎯 Pode ser entre{' '}
            <Text style={styles.rangeHighlight}>{minAvailable}</Text>
            {' e '}
            <Text style={styles.rangeHighlight}>{maxAvailable}</Text>
          </Text>
        </View>
      )}

      <View
        style={[
          styles.gridContent,
          { maxWidth: GRID_COLUMNS * (cellSize + GRID_CELL_MARGIN) },
        ]}
      >
        {GRID_NUMBERS.map((num) => (
          <NumberCell
            key={num}
            number={num}
            disabled={disabledNumbers.has(num)}
            size={cellSize}
            onPress={onSelectNumber}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  rangeIndicator: {
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  rangeText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rangeHighlight: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
