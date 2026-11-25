import { useState, useRef, type ComponentRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useGame } from '@/hooks/useGame';
import type { IPlayer } from '@/types/game/interfaces/game';
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  MIN_PLAYER_NAME_LENGTH,
} from '@/constants/game/game';
import { colors } from '@/theme/colors';
import { styles } from './styles';

export default function SetupScreen() {
  const router = useRouter();
  const { state, startGame, resetGame } = useGame();

  const [players, setPlayers] = useState<IPlayer[]>(state.players);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const hasPendingInput = inputValue.trim().length > 0;
  const canStart = players.length >= MIN_PLAYERS && !hasPendingInput;

  const addPlayer = () => {
    const name = inputValue.trim();
    if (!name) return;

    if (players.length >= MAX_PLAYERS) {
      Alert.alert(
        'Limite atingido',
        `O máximo de ${MAX_PLAYERS} jogadores já foi atingido.`,
      );
      return;
    }

    if (name.length < MIN_PLAYER_NAME_LENGTH) {
      Alert.alert(
        'Nome inválido',
        `O nome do jogador deve ter pelo menos ${MIN_PLAYER_NAME_LENGTH} caracteres.`,
      );
      return;
    }

    if (/^\d+$/.test(name)) {
      Alert.alert(
        'Nome inválido',
        'O nome do jogador não pode conter apenas números.',
      );
      return;
    }

    if (/^\d/.test(name)) {
      Alert.alert(
        'Nome inválido',
        'O nome do jogador não pode começar com números.',
      );
      return;
    }

    const normalizedName = name.toLocaleLowerCase();
    if (
      players.some(
        (player) => player.name.trim().toLocaleLowerCase() === normalizedName,
      )
    ) {
      Alert.alert('Nome repetido', 'Já existe um jogador com esse nome.');
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
        <Ionicons name="close" size={18} color={colors.danger} />
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
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={styles.backText}>Voltar</Text>
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
              !hasPendingInput && styles.addButtonDisabled,
            ]}
            onPress={addPlayer}
            disabled={!hasPendingInput}
          >
            <Ionicons
              name="add"
              size={26}
              color={!hasPendingInput ? colors.textMuted : colors.textOnPrimary}
            />
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
            title="Começar!"
            iconName="beer"
            onPress={handleStartGame}
            disabled={!canStart}
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
