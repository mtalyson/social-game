import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { useEffect, useState } from 'react';
import type { IPlayerTurnBannerProps } from '@/types/game/interfaces/game';

export function PlayerTurnBanner({
  playerName,
  roundNumber,
}: IPlayerTurnBannerProps) {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(-10));

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-10);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, [playerName, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.roundLabel}>Rodada {roundNumber}</Text>

      <Animated.View
        style={[
          styles.bannerContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.turnLabel}>Vez de </Text>
        <Text style={styles.playerName} numberOfLines={1}>
          {playerName}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    gap: 8,
  },
  roundLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  turnLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  playerName: {
    ...typography.heading,
    color: colors.primary,
    flexShrink: 1,
  },
});
