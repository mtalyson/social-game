import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const GRID_ROWS = Math.ceil(GRID_NUMBERS.length / GRID_COLUMNS);
const RESERVED_VERTICAL_SPACE = 245;

export function NumberGrid({
  disabledNumbers,
  onSelectNumber,
  minAvailable,
  maxAvailable,
}: INumberGridProps) {
  const { width, height } = useWindowDimensions();

  const maxWidthBased = Math.floor(
    (width - spacing.lg * 2 - GRID_COLUMNS * GRID_CELL_MARGIN) / GRID_COLUMNS,
  );

  const maxHeightBased =
    Math.floor((height - RESERVED_VERTICAL_SPACE) / GRID_ROWS) -
    GRID_CELL_MARGIN;

  const cellSize = Math.max(
    36,
    Math.min(54, Math.min(maxWidthBased, maxHeightBased)),
  );

  return (
    <View style={styles.container}>
      {minAvailable !== null && maxAvailable !== null && (
        <View style={styles.rangeIndicator}>
          <Ionicons name="locate" size={16} color={colors.primary} />
          <Text style={styles.rangeText}>
            Pode ser entre{' '}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  rangeText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rangeHighlight: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.primary,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
