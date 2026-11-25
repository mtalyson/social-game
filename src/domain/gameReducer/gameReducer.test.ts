import { gameReducer, initialGameState } from './gameReducer';
import type {
  IPlayer,
  IPlayingGameState,
  IRoundResultGameState,
} from '@/types/game/interfaces/game';

const players: IPlayer[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

describe('gameReducer', () => {
  it('START_GAME transitions from setup to playing with zeroed scoreboard', () => {
    const next = gameReducer(initialGameState, {
      type: 'START_GAME',
      players,
    });

    expect(next.phase).toBe('playing');
    expect(next.players).toEqual(players);
    expect(next.roundNumber).toBe(1);
    if (next.phase === 'playing') {
      expect(next.currentPlayerIndex).toBe(0);
      expect(next.disabledNumbers.size).toBe(0);
      expect(next.scoreboard).toEqual({ '1': 0, '2': 0 });
    }
  });

  it('MAKE_GUESS ignores action when phase is not playing', () => {
    const next = gameReducer(initialGameState, {
      type: 'MAKE_GUESS',
      number: 10,
    });

    expect(next).toBe(initialGameState);
  });

  it('MAKE_GUESS updates state on valid guess', () => {
    const playingState: IPlayingGameState = {
      phase: 'playing',
      players,
      currentPlayerIndex: 0,
      secretNumber: 40,
      disabledNumbers: new Set(),
      roundStarter: players[0],
      roundNumber: 1,
      scoreboard: { '1': 0, '2': 0 },
    };

    const next = gameReducer(playingState, { type: 'MAKE_GUESS', number: 20 });

    expect(next.phase).toBe('playing');
    if (next.phase === 'playing') {
      expect(next.currentPlayerIndex).toBe(1);
      expect(next.disabledNumbers.has(20)).toBe(true);
    }
  });

  it('MAKE_GUESS increments loser scoreboard when round ends', () => {
    const playingState: IPlayingGameState = {
      phase: 'playing',
      players,
      currentPlayerIndex: 1,
      secretNumber: 40,
      disabledNumbers: new Set(),
      roundStarter: players[0],
      roundNumber: 1,
      scoreboard: { '1': 0, '2': 0 },
    };

    const next = gameReducer(playingState, { type: 'MAKE_GUESS', number: 40 });

    expect(next.phase).toBe('roundResult');
    if (next.phase === 'roundResult') {
      expect(next.scoreboard).toEqual({ '1': 0, '2': 1 });
    }
  });

  it('MAKE_GUESS returns previous state on invalid guess', () => {
    const playingState: IPlayingGameState = {
      phase: 'playing',
      players,
      currentPlayerIndex: 0,
      secretNumber: 40,
      disabledNumbers: new Set([10]),
      roundStarter: players[0],
      roundNumber: 1,
      scoreboard: { '1': 0, '2': 0 },
    };

    const next = gameReducer(playingState, { type: 'MAKE_GUESS', number: 10 });

    expect(next).toBe(playingState);
  });

  it('NEXT_ROUND ignores action when phase is not roundResult', () => {
    const next = gameReducer(initialGameState, { type: 'NEXT_ROUND' });
    expect(next).toBe(initialGameState);
  });

  it('NEXT_ROUND starts a new round preserving scoreboard and making loser starter', () => {
    const roundResultState: IRoundResultGameState = {
      phase: 'roundResult',
      players,
      currentPlayerIndex: 1,
      secretNumber: 25,
      disabledNumbers: new Set([1, 2, 3]),
      roundStarter: players[0],
      roundNumber: 1,
      scoreboard: { '1': 0, '2': 1 },
      roundResult: {
        loser: players[1],
        reason: 'guessedSecret',
        secretNumber: 25,
        roundStarter: players[0],
        lastGuess: 25,
      },
    };

    const next = gameReducer(roundResultState, { type: 'NEXT_ROUND' });

    expect(next.phase).toBe('playing');
    expect(next.roundNumber).toBe(2);
    if (next.phase === 'playing') {
      expect(next.roundStarter.id).toBe('2');
      expect(next.currentPlayerIndex).toBe(1);
      expect(next.disabledNumbers.size).toBe(0);
      expect(next.scoreboard).toEqual({ '1': 0, '2': 1 });
    }
  });

  it('CHANGE_PLAYERS returns to setup preserving players', () => {
    const started = gameReducer(initialGameState, {
      type: 'START_GAME',
      players,
    });
    const next = gameReducer(started, { type: 'CHANGE_PLAYERS' });

    expect(next.phase).toBe('setup');
    expect(next.players).toEqual(players);
    expect(next.roundNumber).toBe(0);
  });

  it('RESET_GAME returns initialGameState', () => {
    const started = gameReducer(initialGameState, {
      type: 'START_GAME',
      players,
    });
    const reset = gameReducer(started, { type: 'RESET_GAME' });

    expect(reset).toEqual(initialGameState);
  });
});
