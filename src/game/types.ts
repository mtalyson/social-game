/**
 * Core types for the "Jogo do Número" bar game.
 *
 * These types are intentionally decoupled from React so the game logic
 * can be reused on a future backend (e.g. Cloud Function).
 */

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

export interface Player {
  id: string;
  name: string;
}

/**
 * Describes the current phase of the game lifecycle.
 * - `setup`       → players are being registered
 * - `playing`     → a round is in progress
 * - `roundResult` → a round just ended and the result is being displayed
 */
export type GamePhase = 'setup' | 'playing' | 'roundResult';

/**
 * Why the loser lost:
 * - `guessedSecret`          → the player picked the secret number directly
 * - `revealedByElimination`  → only two adjacent numbers remained and the
 *                               player picked the wrong one, revealing the
 *                               secret by elimination — the round starter loses
 */
export type LossReason = 'guessedSecret' | 'revealedByElimination';

export interface RoundResult {
  /** The player who lost (drinks). */
  loser: Player;
  /** Why they lost. */
  reason: LossReason;
  /** The secret number that was in play. */
  secretNumber: number;
  /** The player who started (initiated) the round. */
  roundStarter: Player;
  /** The last number that was guessed (the one that ended the round). */
  lastGuess: number;
}

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------

export interface GameState {
  /** All players in the current game session. */
  players: Player[];
  /** Index into `players` for whose turn it currently is. */
  currentPlayerIndex: number;
  /** The secret number for the current round (1–60). Never shown to players. */
  secretNumber: number;
  /** Numbers that have been eliminated and can no longer be chosen. */
  disabledNumbers: Set<number>;
  /** The player who started the current round (loses on elimination reveal). */
  roundStarter: Player;
  /** Result of the round, populated when the round ends. */
  roundResult: RoundResult | null;
  /** Current lifecycle phase. */
  phase: GamePhase;
  /** 1-indexed round counter. */
  roundNumber: number;
}

// ---------------------------------------------------------------------------
// Reducer actions
// ---------------------------------------------------------------------------

export type GameAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'MAKE_GUESS'; number: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_GAME' };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MIN_NUMBER = 1;
export const MAX_NUMBER = 60;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 12;
