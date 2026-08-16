/**
 * Game Engine — processes guesses and produces new game states.
 *
 * This is the core "brain" of the game. It takes the current state and a
 * guess, validates it, applies the rules, and returns the resulting state.
 *
 * Completely decoupled from React — works with plain objects and Sets.
 */

import {
  GameState,
  RoundResult,
  Player,
  MIN_NUMBER,
  MAX_NUMBER,
} from './types';
import {
  isNumberAvailable,
  getNumbersToDisable,
  checkTwoAdjacentRemaining,
  getRandomSecretNumber,
  getAvailableBounds,
} from './gameRules';

// ---------------------------------------------------------------------------
// Engine errors
// ---------------------------------------------------------------------------

export class InvalidGuessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGuessError';
  }
}

// ---------------------------------------------------------------------------
// Core engine function
// ---------------------------------------------------------------------------

export interface GuessOutcome {
  /** The new game state after processing the guess. */
  newState: GameState;
  /** If the round ended, this contains the result. */
  roundResult: RoundResult | null;
}

/**
 * Processes a player's guess and returns the resulting game state.
 *
 * Flow:
 * 1. Validate the guess (in range, available).
 * 2. If guess === secretNumber → player loses (guessedSecret).
 * 3. Otherwise, disable the appropriate numbers.
 * 4. Check if exactly two adjacent numbers remain → roundStarter loses
 *    (revealedByElimination).
 * 5. Otherwise, advance the turn to the next player.
 */
export function processGuess(state: GameState, guess: number): GuessOutcome {
  const currentPlayer = state.players[state.currentPlayerIndex];

  // --- Validation ---
  if (guess < MIN_NUMBER || guess > MAX_NUMBER) {
    throw new InvalidGuessError(
      `Guess ${guess} is out of range [${MIN_NUMBER}, ${MAX_NUMBER}].`
    );
  }

  if (!isNumberAvailable(guess, state.disabledNumbers)) {
    throw new InvalidGuessError(
      `Number ${guess} has already been disabled and cannot be chosen.`
    );
  }

  // --- Case 1: Direct hit — player guessed the secret number ---
  if (guess === state.secretNumber) {
    const roundResult: RoundResult = {
      loser: currentPlayer,
      reason: 'guessedSecret',
      secretNumber: state.secretNumber,
      roundStarter: state.roundStarter,
      lastGuess: guess,
    };

    return {
      newState: {
        ...state,
        roundResult,
        phase: 'roundResult',
      },
      roundResult,
    };
  }

  // --- Case 2 & 3: Guess is not the secret — disable numbers ---
  const numbersToDisable = getNumbersToDisable(
    guess,
    state.secretNumber,
    state.disabledNumbers
  );

  const newDisabled = new Set(state.disabledNumbers);
  for (const n of numbersToDisable) {
    newDisabled.add(n);
  }

  // --- Case 4: Check for the "two adjacent remaining" special case ---
  // This check happens AFTER disabling numbers from the current guess.
  // If exactly two adjacent numbers remain as the bounds, the secret is
  // revealed by elimination and the round starter loses.
  const twoAdjacent = checkTwoAdjacentRemaining(newDisabled);

  if (twoAdjacent) {
    // The secret must be one of the two remaining adjacent numbers.
    // Since the player's guess was NOT the secret (we handled that above),
    // and the guess just narrowed the range to these two numbers,
    // the secret is now effectively known — the round starter loses.
    const roundResult: RoundResult = {
      loser: state.roundStarter,
      reason: 'revealedByElimination',
      secretNumber: state.secretNumber,
      roundStarter: state.roundStarter,
      lastGuess: guess,
    };

    return {
      newState: {
        ...state,
        disabledNumbers: newDisabled,
        roundResult,
        phase: 'roundResult',
      },
      roundResult,
    };
  }

  // --- Normal case: advance to the next player ---
  const nextPlayerIndex =
    (state.currentPlayerIndex + 1) % state.players.length;

  return {
    newState: {
      ...state,
      disabledNumbers: newDisabled,
      currentPlayerIndex: nextPlayerIndex,
      roundResult: null,
    },
    roundResult: null,
  };
}

// ---------------------------------------------------------------------------
// State factory helpers
// ---------------------------------------------------------------------------

/**
 * Creates the initial game state for a new game.
 */
export function createInitialGameState(players: Player[]): GameState {
  const secretNumber = getRandomSecretNumber();
  return {
    players,
    currentPlayerIndex: 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: players[0],
    roundResult: null,
    phase: 'playing',
    roundNumber: 1,
  };
}

/**
 * Creates the state for a new round after a round has ended.
 * The loser of the previous round becomes the round starter.
 */
export function createNextRoundState(state: GameState): GameState {
  if (!state.roundResult) {
    throw new Error('Cannot start next round: no round result available.');
  }

  const loser = state.roundResult.loser;
  const loserIndex = state.players.findIndex((p) => p.id === loser.id);
  const secretNumber = getRandomSecretNumber();

  return {
    ...state,
    currentPlayerIndex: loserIndex >= 0 ? loserIndex : 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: loser,
    roundResult: null,
    phase: 'playing',
    roundNumber: state.roundNumber + 1,
  };
}
