import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface PlayerTurnBannerProps {
  playerName: string;
  roundNumber: number;
}

/**
 * Banner displayed at the top of the GameScreen indicating whose turn it is.
 * Features a subtle entrance animation when the player changes.
 */
export function PlayerTurnBanner({
  playerName,
  roundNumber,
}: PlayerTurnBannerProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
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
        <Text style={styles.turnLabel}>Vez de</Text>
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
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  roundLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  bannerContent: {
    alignItems: 'center',
  },
  turnLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  playerName: {
    ...typography.title,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
