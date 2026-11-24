import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();

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
          <Text style={styles.emoji}>🍺</Text>

          <Text style={styles.title}>Jogo do{'\n'}Número</Text>

          <Text style={styles.subtitle}>
            Escolha um número. Não acerte o secreto.{'\n'}
            Quem acertar... bebe!
          </Text>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <PrimaryButton
            title="Novo Jogo"
            onPress={() => router.push('/setup')}
            variant="primary"
          />

          <View style={styles.buttonSpacer} />

          <PrimaryButton
            title="Como Jogar"
            onPress={() => router.push('/how-to-play')}
            variant="ghost"
          />
        </View>

        <Text style={styles.footer}>Um jogo para amigos no bar 🍻</Text>
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
  emoji: {
    fontSize: 80,
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
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.huge,
  },
});
