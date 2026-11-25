import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/hooks/useGame';
import { EGamePhase } from '@/types/game/enums/game';
import { colors } from '@/theme/colors';
import { styles } from './styles';

export default function RoundResultScreen() {
  const router = useRouter();
  const { state, nextRound, changePlayers, resetGame } = useGame();
  const isLeavingRef = useRef(false);

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.9));

  const result =
    state.phase === EGamePhase.ROUND_RESULT ? state.roundResult : null;

  const scoreboard =
    state.phase === EGamePhase.ROUND_RESULT ? state.scoreboard : {};

  const sortedPlayers = [...state.players].sort(
    (a, b) => (scoreboard[b.id] ?? 0) - (scoreboard[a.id] ?? 0),
  );

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 6,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (!isLeavingRef.current && state.phase === EGamePhase.SETUP) {
      router.replace('/');
    }
  }, [state.phase, router]);

  if (!result) return null;

  const handleNextRound = () => {
    isLeavingRef.current = true;
    nextRound();
    router.replace('/game');
  };

  const handleChangePlayers = () => {
    isLeavingRef.current = true;
    changePlayers();
    router.replace('/setup');
  };

  const handleEndGame = () => {
    isLeavingRef.current = true;
    resetGame();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.resultCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{result.loser.name}</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>Bebe!</Text>
            <Ionicons name="beer" size={26} color={colors.dangerLight} />
          </View>

          <View style={styles.secretContainer}>
            <Text style={styles.secretLabel}>O número sorteado era</Text>
            <Text style={styles.secretNumber}>{result.secretNumber}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.scoreboardCard, { opacity: fadeAnim }]}>
          <Text style={styles.scoreboardTitle}>Placar da Partida</Text>

          <ScrollView
            style={styles.scoreboardList}
            contentContainerStyle={styles.scoreboardListContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {sortedPlayers.map((player) => {
              const drinks = scoreboard[player.id] ?? 0;
              const isRoundLoser = player.id === result.loser.id;
              return (
                <View key={player.id} style={styles.scoreboardRow}>
                  <Text
                    style={[
                      styles.scoreboardName,
                      isRoundLoser && styles.scoreboardNameHighlight,
                    ]}
                    numberOfLines={1}
                  >
                    {player.name}
                  </Text>
                  <View style={styles.scoreboardDrinks}>
                    <Ionicons
                      name="beer"
                      size={16}
                      color={drinks > 0 ? colors.primary : colors.textMuted}
                    />
                    <Text style={styles.scoreboardCount}>{drinks}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Próxima Rodada"
          iconName="refresh"
          onPress={handleNextRound}
          variant="primary"
        />

        <View style={styles.buttonSpacer} />

        <PrimaryButton
          title="Mudar Jogadores"
          iconName="people"
          onPress={handleChangePlayers}
          variant="secondary"
        />

        <View style={styles.buttonSpacer} />

        <PrimaryButton
          title="Encerrar Jogo"
          onPress={handleEndGame}
          variant="ghost"
        />
      </View>
    </SafeAreaView>
  );
}
