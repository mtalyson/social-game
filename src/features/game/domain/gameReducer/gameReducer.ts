import type {
  TGameState,
  TGameAction,
  ISetupGameState,
} from '@/types/game/interfaces/game';
import { EGamePhase, EGameActionType } from '@/types/game/enums/game';
import {
  processGuess,
  createInitialGameState,
  createNextRoundState,
} from '../gameEngine/gameEngine';

export const initialGameState: ISetupGameState = {
  phase: EGamePhase.SETUP,
  players: [],
  roundNumber: 0,
};

export function gameReducer(
  state: TGameState,
  action: TGameAction,
): TGameState {
  switch (action.type) {
    case EGameActionType.START_GAME: {
      return createInitialGameState(action.players);
    }

    case EGameActionType.MAKE_GUESS: {
      if (state.phase !== EGamePhase.PLAYING) {
        return state;
      }

      try {
        const { newState } = processGuess(state, action.number);
        return newState;
      } catch (error) {
        return {
          ...state,
          lastError: error instanceof Error ? error.message : 'Invalid guess.',
        };
      }
    }

    case EGameActionType.NEXT_ROUND: {
      if (state.phase !== EGamePhase.ROUND_RESULT) {
        return state;
      }
      return createNextRoundState(state);
    }

    case EGameActionType.CHANGE_PLAYERS: {
      return {
        phase: EGamePhase.SETUP,
        players: state.players,
        roundNumber: 0,
      };
    }

    case EGameActionType.RESET_GAME: {
      return initialGameState;
    }

    default:
      return state;
  }
}
