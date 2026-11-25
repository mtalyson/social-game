import type {
  IPlayingGameState,
  IRoundResultGameState,
  IRoundResult,
  IPlayer,
  IGuessOutcome,
} from '@/types/game/interfaces/game';
import { EGamePhase, ELossReason } from '@/types/game/enums/game';
import {
  MIN_NUMBER,
  MAX_NUMBER,
  MIN_PLAYERS,
  MAX_PLAYERS,
} from '@/constants/game/game';
import {
  isNumberAvailable,
  getNumbersToDisable,
  checkTwoAdjacentRemaining,
  checkSingleRemaining,
  getRandomSecretNumber,
} from '../gameRules/gameRules';

export class InvalidGuessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGuessError';
  }
}

function incrementScore(
  scoreboard: Record<string, number>,
  loserId: string,
): Record<string, number> {
  return {
    ...scoreboard,
    [loserId]: (scoreboard[loserId] ?? 0) + 1,
  };
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
        scoreboard: incrementScore(state.scoreboard, currentPlayer.id),
      },
      roundResult,
    };
  }

  const wasTwoAdjacentRemaining =
    checkTwoAdjacentRemaining(state.disabledNumbers) !== null;

  const numbersToDisable = getNumbersToDisable(
    guess,
    state.secretNumber,
    state.disabledNumbers,
  );

  const newDisabled = new Set(state.disabledNumbers);
  for (const n of numbersToDisable) {
    newDisabled.add(n);
  }

  if (wasTwoAdjacentRemaining) {
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
        scoreboard: incrementScore(state.scoreboard, state.roundStarter.id),
      },
      roundResult,
    };
  }

  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  const singleRemaining = checkSingleRemaining(newDisabled);

  if (singleRemaining !== null) {
    const loser = state.players[nextPlayerIndex];
    const roundResult: IRoundResult = {
      loser,
      reason: ELossReason.LAST_NUMBER_REMAINING,
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
        scoreboard: incrementScore(state.scoreboard, loser.id),
      },
      roundResult,
    };
  }

  return {
    newState: {
      ...state,
      disabledNumbers: newDisabled,
      currentPlayerIndex: nextPlayerIndex,
    },
    roundResult: null,
  };
}

export function createInitialGameState(players: IPlayer[]): IPlayingGameState {
  if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
    throw new Error(
      `Game requires between ${MIN_PLAYERS} and ${MAX_PLAYERS} players.`,
    );
  }

  const secretNumber = getRandomSecretNumber();
  const scoreboard: Record<string, number> = {};
  for (const player of players) {
    scoreboard[player.id] = 0;
  }

  return {
    phase: EGamePhase.PLAYING,
    players,
    currentPlayerIndex: 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: players[0],
    roundNumber: 1,
    scoreboard,
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
    scoreboard: state.scoreboard,
  };
}
