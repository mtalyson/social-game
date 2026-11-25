import { useState, useRef, type ComponentRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/features/game/context/gameContext';
import type { IPlayer } from '@/types/game/interfaces/game';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/constants/game/game';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export default function SetupScreen() {
  const router = useRouter();
  const { state, startGame, resetGame } = useGame();

  const [players, setPlayers] = useState<IPlayer[]>(state.players);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const hasPendingInput = inputValue.trim().length > 0;
  const canAddMore = players.length < MAX_PLAYERS;
  const canStart = players.length >= MIN_PLAYERS && !hasPendingInput;

  const addPlayer = () => {
    const name = inputValue.trim();
    if (!name) return;

    if (players.length >= MAX_PLAYERS) {
      Alert.alert('Limite atingido', `Máximo de ${MAX_PLAYERS} jogadores.`);
      return;
    }

    const newPlayer: IPlayer = {
      id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStartGame = () => {
    if (!canStart) return;
    startGame(players);
    router.replace('/game');
  };

  const renderPlayer = ({ item, index }: { item: IPlayer; index: number }) => (
    <View style={styles.playerRow}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerIndex}>{index + 1}</Text>
        <Text style={styles.playerName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removePlayer(item.id)}
        style={styles.removeButton}
        accessibilityLabel={`Remover ${item.name}`}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                resetGame();
                router.replace('/');
              }
            }}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Quem vai jogar?</Text>
          <Text style={styles.subtitle}>
            Adicione de {MIN_PLAYERS} a {MAX_PLAYERS} jogadores
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Nome do jogador"
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={addPlayer}
            returnKeyType="done"
            maxLength={20}
            autoFocus
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              (!inputValue.trim() || !canAddMore) && styles.addButtonDisabled,
            ]}
            onPress={addPlayer}
            disabled={!inputValue.trim() || !canAddMore}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          style={styles.playerList}
          contentContainerStyle={styles.playerListContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum jogador adicionado ainda
            </Text>
          }
        />

        <Text style={styles.countText}>
          {players.length} jogador{players.length !== 1 ? 'es' : ''}
          {players.length < MIN_PLAYERS
            ? ` — falta${MIN_PLAYERS - players.length > 1 ? 'm' : ''} ${MIN_PLAYERS - players.length}`
            : hasPendingInput
              ? ' — adicione ou limpe o nome digitado'
              : ''}
        </Text>

        <View style={styles.footer}>
          <PrimaryButton
            title="Começar! 🍺"
            onPress={handleStartGame}
            disabled={!canStart}
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  header: {
    paddingTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 50,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...typography.body,
    lineHeight: undefined,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  playerList: {
    flex: 1,
  },
  playerListContent: {
    gap: spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playerIndex: {
    ...typography.caption,
    color: colors.textMuted,
    width: 24,
  },
  playerName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  removeText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '600',
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
