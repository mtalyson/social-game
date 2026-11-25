import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import type { IPlayer } from '@/types/game/interfaces/game';
import type { IGameContextValue } from '@/types/game/interfaces/gameContexts';
import { EGamePhase, EGameActionType } from '@/types/game/enums/game';
import {
  gameReducer,
  initialGameState,
} from '@/features/game/domain/gameReducer/gameReducer';
import { getAvailableBounds } from '@/features/game/domain/gameRules/gameRules';

const GameContext = createContext<IGameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const startGame = useCallback(
    (players: IPlayer[]) =>
      dispatch({ type: EGameActionType.START_GAME, players }),
    [],
  );

  const makeGuess = useCallback(
    (number: number) => dispatch({ type: EGameActionType.MAKE_GUESS, number }),
    [],
  );

  const nextRound = useCallback(
    () => dispatch({ type: EGameActionType.NEXT_ROUND }),
    [],
  );

  const changePlayers = useCallback(
    () => dispatch({ type: EGameActionType.CHANGE_PLAYERS }),
    [],
  );

  const resetGame = useCallback(
    () => dispatch({ type: EGameActionType.RESET_GAME }),
    [],
  );

  const currentPlayer =
    state.phase !== EGamePhase.SETUP && state.players.length > 0
      ? (state.players[state.currentPlayerIndex] ?? null)
      : null;

  const availableBounds =
    state.phase === EGamePhase.SETUP
      ? null
      : getAvailableBounds(state.disabledNumbers);

  const value: IGameContextValue = {
    state,
    dispatch,
    startGame,
    makeGuess,
    nextRound,
    changePlayers,
    resetGame,
    currentPlayer,
    availableBounds,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): IGameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
