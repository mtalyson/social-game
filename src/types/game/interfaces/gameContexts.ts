import type { Dispatch } from 'react';
import type {
  IPlayer,
  TGameAction,
  TGameState,
} from '@/types/game/interfaces/game';

export interface IGameContextValue {
  state: TGameState;
  dispatch: Dispatch<TGameAction>;
  startGame: (players: IPlayer[]) => void;
  makeGuess: (number: number) => void;
  nextRound: () => void;
  resetGame: () => void;
  currentPlayer: IPlayer | null;
  availableBounds: { min: number; max: number } | null;
}
