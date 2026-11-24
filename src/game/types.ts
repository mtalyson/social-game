export interface Player {
  id: string;
  name: string;
}

export type GamePhase = 'setup' | 'playing' | 'roundResult';

export type LossReason = 'guessedSecret' | 'revealedByElimination';

export interface RoundResult {
  loser: Player;
  reason: LossReason;
  secretNumber: number;
  roundStarter: Player;
  lastGuess: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  secretNumber: number;
  disabledNumbers: Set<number>;
  roundStarter: Player;
  roundResult: RoundResult | null;
  phase: GamePhase;
  roundNumber: number;
}

export type GameAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'MAKE_GUESS'; number: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_GAME' };

export const MIN_NUMBER = 1;
export const MAX_NUMBER = 60;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 12;
