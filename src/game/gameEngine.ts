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

export class InvalidGuessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGuessError';
  }
}

export interface GuessOutcome {
  newState: GameState;
  roundResult: RoundResult | null;
}

export function processGuess(state: GameState, guess: number): GuessOutcome {
  const currentPlayer = state.players[state.currentPlayerIndex];

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

  const numbersToDisable = getNumbersToDisable(
    guess,
    state.secretNumber,
    state.disabledNumbers
  );

  const newDisabled = new Set(state.disabledNumbers);
  for (const n of numbersToDisable) {
    newDisabled.add(n);
  }

  const twoAdjacent = checkTwoAdjacentRemaining(newDisabled);

  if (twoAdjacent) {
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
