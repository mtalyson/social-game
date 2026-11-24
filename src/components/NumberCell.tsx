import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';
import { useRef } from 'react';

interface NumberCellProps {
  number: number;
  disabled: boolean;
  onPress: (number: number) => void;
}

export function NumberCell({ number, disabled, onPress }: NumberCellProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onPress(number);
    }
  };

  const cellStyle: ViewStyle = disabled
    ? styles.cellDisabled
    : styles.cellAvailable;

  return (
    <Animated.View style={{ transform: [{ scale: disabled ? 1 : scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.cell, cellStyle]}
        onPress={handlePress}
        onPressIn={disabled ? undefined : handlePressIn}
        onPressOut={disabled ? undefined : handlePressOut}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityLabel={`Número ${number}${disabled ? ', indisponível' : ''}`}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text
          style={[
            styles.text,
            disabled ? styles.textDisabled : styles.textAvailable,
          ]}
        >
          {number}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    margin: 3,
  },
  cellAvailable: {
    backgroundColor: colors.numberAvailable,
    borderWidth: 1,
    borderColor: colors.numberAvailableBorder,
  },
  cellDisabled: {
    backgroundColor: colors.numberDisabled,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    ...typography.gridNumber,
  },
  textAvailable: {
    color: colors.textPrimary,
  },
  textDisabled: {
    color: colors.numberDisabledText,
  },
});
