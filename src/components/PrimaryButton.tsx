import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  const getGradientColors = (): readonly [string, string] => {
    if (isDisabled) return ['#2A2A4A', '#1E1E3A'] as const;
    switch (variant) {
      case 'primary':
        return colors.gradientPrimary;
      case 'danger':
        return colors.gradientDanger;
      case 'secondary':
        return [colors.surfaceLight, colors.surfaceElevated] as const;
      case 'ghost':
        return ['transparent', 'transparent'] as const;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[style]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          variant === 'ghost' && styles.ghostButton,
          variant === 'secondary' && styles.secondaryButton,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Text
            style={[
              styles.text,
              variant === 'primary' && !isDisabled && styles.textPrimary,
              variant === 'ghost' && styles.textGhost,
              isDisabled && styles.textDisabled,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.button,
    color: colors.textPrimary,
  },
  textPrimary: {
    color: colors.textOnPrimary,
  },
  textGhost: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
