import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NumberCell } from './NumberCell';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { useCallback } from 'react';

interface NumberGridProps {
  disabledNumbers: Set<number>;
  onSelectNumber: (number: number) => void;
  minAvailable: number | null;
  maxAvailable: number | null;
}

const NUMBERS = Array.from({ length: 60 }, (_, i) => i + 1);
const NUM_COLUMNS = 6;

export function NumberGrid({
  disabledNumbers,
  onSelectNumber,
  minAvailable,
  maxAvailable,
}: NumberGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <NumberCell
        number={item}
        disabled={disabledNumbers.has(item)}
        onPress={onSelectNumber}
      />
    ),
    [disabledNumbers, onSelectNumber]
  );

  const keyExtractor = useCallback(
    (item: number) => item.toString(),
    []
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

      <FlatList
        data={NUMBERS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
  },
  row: {
    justifyContent: 'center',
  },
});
