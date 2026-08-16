/**
 * Game Reducer — manages state transitions for the game.
 *
 * Uses the pure functions from gameEngine to process game logic.
 * This reducer is designed to be used with React's useReducer hook.
 */

import { GameState, GameAction, GamePhase } from './types';
import {
  processGuess,
  createInitialGameState,
  createNextRoundState,
} from './gameEngine';

/**
 * The initial state before any game has started.
 * This is a "blank slate" used as the default for useReducer.
 */
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

/**
 * Reducer function for the game state machine.
 *
 * Actions:
 * - START_GAME  → initializes the game with players, picks a secret number
 * - MAKE_GUESS  → processes a guess via the game engine
 * - NEXT_ROUND  → starts a new round (loser becomes round starter)
 * - RESET_GAME  → returns to the initial setup state
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return createInitialGameState(action.players);
    }

    case 'MAKE_GUESS': {
      if (state.phase !== 'playing') {
        // Ignore guesses when not in the playing phase.
        return state;
      }

      try {
        const { newState } = processGuess(state, action.number);
        return newState;
      } catch {
        // Invalid guess — return state unchanged.
        // In the UI layer, we prevent invalid guesses from being dispatched,
        // but this is a safety net.
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
