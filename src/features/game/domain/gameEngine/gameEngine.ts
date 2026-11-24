import type {
  IPlayingGameState,
  IRoundResultGameState,
  IRoundResult,
  IPlayer,
  IGuessOutcome,
} from '@/types/game/interfaces/game';
import { EGamePhase, ELossReason } from '@/types/game/enums/game';
import { MIN_NUMBER, MAX_NUMBER } from '@/constants/game/game';
import {
  isNumberAvailable,
  getNumbersToDisable,
  checkTwoAdjacentRemaining,
  getRandomSecretNumber,
} from '../gameRules/gameRules';

export class InvalidGuessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGuessError';
  }
}

export function processGuess(
  state: IPlayingGameState,
  guess: number,
): IGuessOutcome {
  const currentPlayer = state.players[state.currentPlayerIndex];

  if (guess < MIN_NUMBER || guess > MAX_NUMBER) {
    throw new InvalidGuessError(
      `Guess ${guess} is out of range [${MIN_NUMBER}, ${MAX_NUMBER}].`,
    );
  }

  if (!isNumberAvailable(guess, state.disabledNumbers)) {
    throw new InvalidGuessError(
      `Number ${guess} has already been disabled and cannot be chosen.`,
    );
  }

  if (guess === state.secretNumber) {
    const roundResult: IRoundResult = {
      loser: currentPlayer,
      reason: ELossReason.GUESSED_SECRET,
      secretNumber: state.secretNumber,
      roundStarter: state.roundStarter,
      lastGuess: guess,
    };

    return {
      newState: {
        phase: EGamePhase.ROUND_RESULT,
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        secretNumber: state.secretNumber,
        disabledNumbers: state.disabledNumbers,
        roundStarter: state.roundStarter,
        roundResult,
        roundNumber: state.roundNumber,
      },
      roundResult,
    };
  }

  const numbersToDisable = getNumbersToDisable(
    guess,
    state.secretNumber,
    state.disabledNumbers,
  );

  const newDisabled = new Set(state.disabledNumbers);
  for (const n of numbersToDisable) {
    newDisabled.add(n);
  }

  const twoAdjacent = checkTwoAdjacentRemaining(newDisabled);

  if (twoAdjacent) {
    const roundResult: IRoundResult = {
      loser: state.roundStarter,
      reason: ELossReason.REVEALED_BY_ELIMINATION,
      secretNumber: state.secretNumber,
      roundStarter: state.roundStarter,
      lastGuess: guess,
    };

    return {
      newState: {
        phase: EGamePhase.ROUND_RESULT,
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        secretNumber: state.secretNumber,
        disabledNumbers: newDisabled,
        roundStarter: state.roundStarter,
        roundResult,
        roundNumber: state.roundNumber,
      },
      roundResult,
    };
  }

  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  return {
    newState: {
      ...state,
      disabledNumbers: newDisabled,
      currentPlayerIndex: nextPlayerIndex,
      lastError: null,
    },
    roundResult: null,
  };
}

export function createInitialGameState(players: IPlayer[]): IPlayingGameState {
  const secretNumber = getRandomSecretNumber();
  return {
    phase: EGamePhase.PLAYING,
    players,
    currentPlayerIndex: 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: players[0],
    roundNumber: 1,
    lastError: null,
  };
}

export function createNextRoundState(
  state: IRoundResultGameState,
): IPlayingGameState {
  const loser = state.roundResult.loser;
  const loserIndex = state.players.findIndex((p) => p.id === loser.id);
  const secretNumber = getRandomSecretNumber();

  return {
    phase: EGamePhase.PLAYING,
    players: state.players,
    currentPlayerIndex: loserIndex >= 0 ? loserIndex : 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: loser,
    roundNumber: state.roundNumber + 1,
    lastError: null,
  };
}
