import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/features/game/context/gameContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { resetGame } = useGame();

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 8,
        bounciness: 4,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.heroContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Ionicons
            name="beer"
            size={76}
            color={colors.primary}
            style={styles.heroIcon}
          />

          <Text style={styles.title}>Perdeu,{'\n'}Bebeu!</Text>

          <Text style={styles.subtitle}>
            Escolha um número de 1 a 60{'\n'}
            Quem acertar... bebe!
          </Text>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <PrimaryButton
            title="Novo Jogo"
            variant="primary"
            onPress={() => {
              resetGame();
              router.push('/setup');
            }}
          />

          <View style={styles.buttonSpacer} />

          <PrimaryButton
            title="Como Jogar"
            onPress={() => router.push('/how-to-play')}
            variant="ghost"
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footer}>Um jogo para amigos no bar</Text>
          <Ionicons name="beer-outline" size={16} color={colors.textMuted} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  heroIcon: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 48,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
  },
  buttonSpacer: {
    height: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.huge,
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
