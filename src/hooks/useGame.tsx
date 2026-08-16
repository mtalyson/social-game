/**
 * Game Context & Hook — provides game state and actions to all screens.
 *
 * Uses React Context + useReducer to share game state across the app
 * without prop drilling. This is the bridge between the pure game logic
 * (in src/game/) and the React UI layer.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GameState, GameAction, Player } from '@/game/types';
import { gameReducer, initialGameState } from '@/game/gameReducer';
import { getAvailableBounds } from '@/game/gameRules';

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;

  // Typed action helpers
  startGame: (players: Player[]) => void;
  makeGuess: (number: number) => void;
  nextRound: () => void;
  resetGame: () => void;

  // Derived data helpers
  currentPlayer: Player | null;
  availableBounds: { min: number; max: number } | null;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const GameContext = createContext<GameContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook to access the game state and actions.
 * Must be used within a GameProvider.
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
