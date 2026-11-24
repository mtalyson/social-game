import { GameState, GameAction, GamePhase } from './types';
import {
  processGuess,
  createInitialGameState,
  createNextRoundState,
} from './gameEngine';

export const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  secretNumber: 0,
  disabledNumbers: new Set<number>(),
  roundStarter: { id: '', name: '' },
  roundResult: null,
  phase: 'setup' as GamePhase,
  roundNumber: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return createInitialGameState(action.players);
    }

    case 'MAKE_GUESS': {
      if (state.phase !== 'playing') {
        return state;
      }

      try {
        const { newState } = processGuess(state, action.number);
        return newState;
      } catch {
        return state;
      }
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'roundResult') {
        return state;
      }
      return createNextRoundState(state);
    }

    case 'RESET_GAME': {
      return initialGameState;
    }

    default:
      return state;
  }
}
