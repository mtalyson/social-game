import { createContext, useContext, useReducer, useCallback } from 'react';
import { GameState, GameAction, Player } from '@/game/types';
import { gameReducer, initialGameState } from '@/game/gameReducer';
import { getAvailableBounds } from '@/game/gameRules';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;

  startGame: (players: Player[]) => void;
  makeGuess: (number: number) => void;
  nextRound: () => void;
  resetGame: () => void;

  currentPlayer: Player | null;
  availableBounds: { min: number; max: number } | null;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const startGame = useCallback(
    (players: Player[]) => dispatch({ type: 'START_GAME', players }),
    []
  );

  const makeGuess = useCallback(
    (number: number) => dispatch({ type: 'MAKE_GUESS', number }),
    []
  );

  const nextRound = useCallback(
    () => dispatch({ type: 'NEXT_ROUND' }),
    []
  );

  const resetGame = useCallback(
    () => dispatch({ type: 'RESET_GAME' }),
    []
  );

  const currentPlayer =
    state.players.length > 0
      ? state.players[state.currentPlayerIndex] ?? null
      : null;

  const availableBounds = getAvailableBounds(state.disabledNumbers);

  const value: GameContextValue = {
    state,
    dispatch,
    startGame,
    makeGuess,
    nextRound,
    resetGame,
    currentPlayer,
    availableBounds,
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
