import {
  processGuess,
  createInitialGameState,
  createNextRoundState,
  InvalidGuessError,
} from './gameEngine';
import type {
  IPlayingGameState,
  IRoundResultGameState,
  IPlayer,
} from '@/types/game/interfaces/game';

const players: IPlayer[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Carol' },
];

function createTestState(
  secretNumber: number,
  overrides: Partial<IPlayingGameState> = {},
): IPlayingGameState {
  return {
    phase: 'playing',
    players,
    currentPlayerIndex: 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: players[0],
    roundNumber: 1,
    lastError: null,
    ...overrides,
  };
}

function asPlaying(
  state: IPlayingGameState | IRoundResultGameState,
): IPlayingGameState {
  expect(state.phase).toBe('playing');
  return state as IPlayingGameState;
}

describe('processGuess — direct hit', () => {
  it('should end the round when player guesses the secret number', () => {
    const state = createTestState(25);
    const { newState, roundResult } = processGuess(state, 25);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.loser.id).toBe('1');
    expect(roundResult!.reason).toBe('guessedSecret');
    expect(roundResult!.secretNumber).toBe(25);
    expect(roundResult!.lastGuess).toBe(25);
    expect(newState.phase).toBe('roundResult');
  });

  it('should make current player lose when they guess secretNumber = 1', () => {
    const state = createTestState(1);
    const { roundResult } = processGuess(state, 1);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.loser.id).toBe('1');
    expect(roundResult!.reason).toBe('guessedSecret');
  });

  it('should make current player lose when they guess secretNumber = 60', () => {
    const state = createTestState(60);
    const { roundResult } = processGuess(state, 60);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.loser.id).toBe('1');
    expect(roundResult!.reason).toBe('guessedSecret');
  });
});

describe('processGuess — guess below secret', () => {
  it('should disable numbers <= guess and advance turn', () => {
    const state = createTestState(45);
    const { newState, roundResult } = processGuess(state, 30);

    expect(roundResult).toBeNull();
    expect(newState.phase).toBe('playing');
    for (let i = 1; i <= 30; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(true);
    }
    for (let i = 31; i <= 60; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(false);
    }
    expect(newState.currentPlayerIndex).toBe(1);
  });

  it('edge case: guess is 1 with secret > 1 — only disables 1', () => {
    const state = createTestState(30);
    const { newState, roundResult } = processGuess(state, 1);

    expect(roundResult).toBeNull();
    expect(newState.disabledNumbers.has(1)).toBe(true);
    expect(newState.disabledNumbers.size).toBe(1);
  });
});

describe('processGuess — guess above secret', () => {
  it('should disable numbers >= guess and advance turn', () => {
    const state = createTestState(20);
    const { newState, roundResult } = processGuess(state, 40);

    expect(roundResult).toBeNull();
    for (let i = 40; i <= 60; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(true);
    }
    for (let i = 1; i <= 39; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(false);
    }
    expect(newState.currentPlayerIndex).toBe(1);
  });

  it('edge case: guess is 60 with secret < 60 — only disables 60', () => {
    const state = createTestState(30);
    const { newState, roundResult } = processGuess(state, 60);

    expect(roundResult).toBeNull();
    expect(newState.disabledNumbers.has(60)).toBe(true);
    expect(newState.disabledNumbers.size).toBe(1);
  });
});

describe('processGuess — skipped numbers stay available', () => {
  it('numbers between guesses and the secret remain available', () => {
    let state = createTestState(45);

    const r1 = processGuess(state, 30);
    state = asPlaying(r1.newState);
    expect(r1.roundResult).toBeNull();

    const r2 = processGuess(state, 50);
    state = asPlaying(r2.newState);
    expect(r2.roundResult).toBeNull();

    for (let i = 31; i <= 49; i++) {
      expect(state.disabledNumbers.has(i)).toBe(false);
    }
  });
});

describe('processGuess — player rotation', () => {
  it('should cycle through all players correctly', () => {
    let state = createTestState(30);

    let result = processGuess(state, 10);
    state = asPlaying(result.newState);
    expect(state.currentPlayerIndex).toBe(1);

    result = processGuess(state, 20);
    state = asPlaying(result.newState);
    expect(state.currentPlayerIndex).toBe(2);

    result = processGuess(state, 25);
    state = asPlaying(result.newState);
    expect(state.currentPlayerIndex).toBe(0);
  });
});

describe('processGuess — invalid guesses', () => {
  it('should throw InvalidGuessError for out-of-range numbers', () => {
    const state = createTestState(30);
    expect(() => processGuess(state, 0)).toThrow(InvalidGuessError);
    expect(() => processGuess(state, 61)).toThrow(InvalidGuessError);
    expect(() => processGuess(state, -5)).toThrow(InvalidGuessError);
  });

  it('should throw InvalidGuessError for disabled numbers', () => {
    const state = createTestState(30, {
      disabledNumbers: new Set([15, 20, 25]),
    });
    expect(() => processGuess(state, 15)).toThrow(InvalidGuessError);
    expect(() => processGuess(state, 20)).toThrow(InvalidGuessError);
  });
});

describe('processGuess — two adjacent remaining', () => {
  it('should continue game when guess narrows to two adjacent numbers so next player chooses', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 17; i++) disabled.add(i);
    for (let i = 21; i <= 60; i++) disabled.add(i);

    const state = createTestState(20, {
      disabledNumbers: disabled,
      currentPlayerIndex: 1,
      roundStarter: players[0],
    });

    const { newState, roundResult } = processGuess(state, 18);

    expect(roundResult).toBeNull();
    expect(newState.phase).toBe('playing');
    expect(newState.currentPlayerIndex).toBe(2);
    expect(newState.disabledNumbers.has(19)).toBe(false);
    expect(newState.disabledNumbers.has(20)).toBe(false);
  });

  it('should end with direct hit if player picks the secret from two adjacent', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 18; i++) disabled.add(i);
    for (let i = 21; i <= 60; i++) disabled.add(i);

    const state = createTestState(20, {
      disabledNumbers: disabled,
      currentPlayerIndex: 1,
      roundStarter: players[0],
    });

    const { roundResult } = processGuess(state, 20);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
    expect(roundResult!.loser.id).toBe('2');
  });

  it('should trigger elimination when non-secret is chosen from two adjacent', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 18; i++) disabled.add(i);
    for (let i = 21; i <= 60; i++) disabled.add(i);

    const state = createTestState(19, {
      disabledNumbers: disabled,
      currentPlayerIndex: 2,
      roundStarter: players[0],
    });

    const { roundResult } = processGuess(state, 20);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('revealedByElimination');
    expect(roundResult!.loser.id).toBe('1');
    expect(roundResult!.secretNumber).toBe(19);
  });

  it('complete sequence: gradually narrow to two adjacent numbers and pick wrong', () => {
    let state = createTestState(35);

    let r = processGuess(state, 20);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 50);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 40);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 30);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 38);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 33);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 37);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 34);
    state = asPlaying(r.newState);
    expect(r.roundResult).toBeNull();

    r = processGuess(state, 36);

    expect(r.newState.phase).toBe('roundResult');
    expect(r.roundResult).not.toBeNull();
    expect(r.roundResult!.reason).toBe('revealedByElimination');
    expect(r.roundResult!.loser.id).toBe('1');
    expect(r.roundResult!.secretNumber).toBe(35);
  });

  it('complete sequence: player directly hits the secret from two remaining', () => {
    const state = createTestState(35, {
      disabledNumbers: (() => {
        const d = new Set<number>();
        for (let i = 1; i <= 34; i++) d.add(i);
        for (let i = 37; i <= 60; i++) d.add(i);
        return d;
      })(),
      currentPlayerIndex: 1,
      roundStarter: players[0],
    });

    const { roundResult } = processGuess(state, 35);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
    expect(roundResult!.loser.id).toBe('2');
  });
});

describe('createInitialGameState', () => {
  it('should create a valid initial state', () => {
    const state = createInitialGameState(players);

    expect(state.players).toHaveLength(3);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.secretNumber).toBeGreaterThanOrEqual(1);
    expect(state.secretNumber).toBeLessThanOrEqual(60);
    expect(state.disabledNumbers.size).toBe(0);
    expect(state.roundStarter.id).toBe('1');
    expect(state.lastError).toBeNull();
    expect(state.phase).toBe('playing');
    expect(state.roundNumber).toBe(1);
  });
});

describe('createNextRoundState', () => {
  it('should make the loser the round starter and current player', () => {
    const prevState: IRoundResultGameState = {
      phase: 'roundResult',
      players,
      currentPlayerIndex: 0,
      secretNumber: 25,
      disabledNumbers: new Set<number>(),
      roundStarter: players[0],
      roundNumber: 1,
      roundResult: {
        loser: players[1],
        reason: 'guessedSecret',
        secretNumber: 25,
        roundStarter: players[0],
        lastGuess: 25,
      },
    };

    const nextState = createNextRoundState(prevState);

    expect(nextState.roundStarter.id).toBe('2');
    expect(nextState.currentPlayerIndex).toBe(1);
    expect(nextState.disabledNumbers.size).toBe(0);
    expect(nextState.phase).toBe('playing');
    expect(nextState.roundNumber).toBe(2);
    expect(nextState.secretNumber).toBeGreaterThanOrEqual(1);
    expect(nextState.secretNumber).toBeLessThanOrEqual(60);
  });
});

describe('edge case — secret number is 1', () => {
  it('guess 1 → direct hit, player loses', () => {
    const state = createTestState(1);
    const { roundResult } = processGuess(state, 1);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
    expect(roundResult!.loser.id).toBe('1');
  });

  it('guess 2 → 2 > 1 → disable >= 2 → only 1 left → next player loses', () => {
    const state = createTestState(1);
    const { newState, roundResult } = processGuess(state, 2);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('lastNumberRemaining');
    expect(roundResult!.loser.id).toBe('2');
    expect(roundResult!.secretNumber).toBe(1);
    expect(newState.phase).toBe('roundResult');
    expect(newState.disabledNumbers.has(2)).toBe(true);
    expect(newState.disabledNumbers.has(1)).toBe(false);
  });

  it('narrowing to 1 and 2 with secret = 1 — guess 2 triggers revealedByElimination', () => {
    const disabled = new Set<number>();
    for (let i = 3; i <= 60; i++) disabled.add(i);

    const state = createTestState(1, { disabledNumbers: disabled });
    const { roundResult } = processGuess(state, 2);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('revealedByElimination');
    expect(roundResult!.loser.id).toBe('1');
    expect(roundResult!.secretNumber).toBe(1);
  });
});

describe('edge case — secret number is 60', () => {
  it('guess 60 → direct hit, player loses', () => {
    const state = createTestState(60);
    const { roundResult } = processGuess(state, 60);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
  });

  it('guess 59 → 59 < 60 → disable <= 59 → only 60 left → next player loses', () => {
    const state = createTestState(60);
    const { newState, roundResult } = processGuess(state, 59);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('lastNumberRemaining');
    expect(roundResult!.loser.id).toBe('2');
    expect(roundResult!.secretNumber).toBe(60);
    expect(newState.phase).toBe('roundResult');
    expect(newState.disabledNumbers.size).toBe(59);
    expect(newState.disabledNumbers.has(60)).toBe(false);
  });
});

describe('two player game', () => {
  const twoPlayers: IPlayer[] = [
    { id: 'p1', name: 'Player 1' },
    { id: 'p2', name: 'Player 2' },
  ];

  it('should alternate turns correctly', () => {
    let state = createTestState(30, {
      players: twoPlayers,
      roundStarter: twoPlayers[0],
    });

    let r = processGuess(state, 10);
    expect(r.newState.phase).toBe('playing');
    if (r.newState.phase === 'playing') state = r.newState;
    expect(state.currentPlayerIndex).toBe(1);

    r = processGuess(state, 50);
    expect(r.newState.phase).toBe('playing');
    if (r.newState.phase === 'playing') state = r.newState;
    expect(state.currentPlayerIndex).toBe(0);

    r = processGuess(state, 20);
    expect(r.newState.phase).toBe('playing');
    if (r.newState.phase === 'playing') state = r.newState;
    expect(state.currentPlayerIndex).toBe(1);
  });
});
