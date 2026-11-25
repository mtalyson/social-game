import {
  View,
  Text,
  Animated,
  BackHandler,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/hooks/useGame';
import { colors } from '@/theme/colors';
import { useCallback, useEffect, useState } from 'react';
import { styles } from './styles';

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

  const confirmExitApp = useCallback(() => {
    Alert.alert('Sair do app?', 'Deseja fechar o Perdeu, Bebeu?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        confirmExitApp();
        return true;
      },
    );

    return () => backHandler.remove();
  }, [confirmExitApp]);

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

        {Platform.OS === 'android' && (
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={confirmExitApp}
              style={styles.exitButton}
              accessibilityRole="button"
              accessibilityLabel="Sair do aplicativo"
            >
              <Ionicons
                name="log-out-outline"
                size={16}
                color={colors.textMuted}
              />
              <Text style={styles.exitText}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.footer}>Um jogo para amigos no bar</Text>
          <Ionicons name="beer-outline" size={16} color={colors.textMuted} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
