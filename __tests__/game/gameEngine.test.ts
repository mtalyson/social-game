/**
 * Integration tests for gameEngine.ts
 *
 * Tests the processGuess function and state factory helpers with full
 * game scenarios, including:
 * - Direct hit (guessing the secret number)
 * - Guess below/above the secret
 * - Complete sequence narrowing to two adjacent numbers
 * - Both outcomes of the two-adjacent special case
 * - Player rotation and round transitions
 * - Invalid guess handling
 * - Edge cases with secret numbers 1 and 60
 */

import {
  processGuess,
  createInitialGameState,
  createNextRoundState,
  InvalidGuessError,
} from '../../src/game/gameEngine';
import { GameState, Player } from '../../src/game/types';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const players: Player[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Carol' },
];

/**
 * Creates a game state with a known secret number for deterministic testing.
 */
function createTestState(
  secretNumber: number,
  overrides: Partial<GameState> = {}
): GameState {
  return {
    players,
    currentPlayerIndex: 0,
    secretNumber,
    disabledNumbers: new Set<number>(),
    roundStarter: players[0],
    roundResult: null,
    phase: 'playing',
    roundNumber: 1,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Direct hit — player guesses the secret number
// ---------------------------------------------------------------------------

describe('processGuess — direct hit', () => {
  it('should end the round when player guesses the secret number', () => {
    const state = createTestState(25);
    const { newState, roundResult } = processGuess(state, 25);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.loser.id).toBe('1'); // Alice (current player)
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

// ---------------------------------------------------------------------------
// Guess below secret — disables numbers <= guess
// ---------------------------------------------------------------------------

describe('processGuess — guess below secret', () => {
  it('should disable numbers <= guess and advance turn', () => {
    const state = createTestState(45);
    const { newState, roundResult } = processGuess(state, 30);

    expect(roundResult).toBeNull();
    expect(newState.phase).toBe('playing');
    // Numbers 1–30 should be disabled
    for (let i = 1; i <= 30; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(true);
    }
    // Numbers 31–60 should still be available
    for (let i = 31; i <= 60; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(false);
    }
    // Turn should advance to Bob (index 1)
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

// ---------------------------------------------------------------------------
// Guess above secret — disables numbers >= guess
// ---------------------------------------------------------------------------

describe('processGuess — guess above secret', () => {
  it('should disable numbers >= guess and advance turn', () => {
    const state = createTestState(20);
    const { newState, roundResult } = processGuess(state, 40);

    expect(roundResult).toBeNull();
    // Numbers 40–60 should be disabled
    for (let i = 40; i <= 60; i++) {
      expect(newState.disabledNumbers.has(i)).toBe(true);
    }
    // Numbers 1–39 should still be available
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

// ---------------------------------------------------------------------------
// Skipped numbers in the middle remain available
// ---------------------------------------------------------------------------

describe('processGuess — skipped numbers stay available', () => {
  it('numbers between guesses and the secret remain available', () => {
    // Secret is 45.
    // Alice guesses 30 → disables 1–30
    // Bob guesses 50 → disables 50–60
    // Numbers 31–49 should all be available (including 31–44, not played)
    let state = createTestState(45);

    const r1 = processGuess(state, 30);
    state = r1.newState;
    expect(r1.roundResult).toBeNull();

    const r2 = processGuess(state, 50);
    state = r2.newState;
    expect(r2.roundResult).toBeNull();

    // Verify 31–49 are available
    for (let i = 31; i <= 49; i++) {
      expect(state.disabledNumbers.has(i)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// Player rotation
// ---------------------------------------------------------------------------

describe('processGuess — player rotation', () => {
  it('should cycle through all players correctly', () => {
    let state = createTestState(30);

    // Alice (index 0) guesses 10 → Bob's turn
    let result = processGuess(state, 10);
    state = result.newState;
    expect(state.currentPlayerIndex).toBe(1);

    // Bob (index 1) guesses 20 → Carol's turn
    result = processGuess(state, 20);
    state = result.newState;
    expect(state.currentPlayerIndex).toBe(2);

    // Carol (index 2) guesses 25 → back to Alice
    result = processGuess(state, 25);
    state = result.newState;
    expect(state.currentPlayerIndex).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Invalid guesses
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Two adjacent remaining — special case (Rule #4)
// ---------------------------------------------------------------------------

describe('processGuess — two adjacent remaining', () => {
  /**
   * Scenario: secret is 20, range narrows to 19 and 20.
   * Player guesses 19 (which is NOT the secret).
   * Since 19 < 20 (secret), numbers <= 19 are disabled.
   * Now only 20 remains, but wait — let's set up properly.
   *
   * Actually, let's carefully construct the state:
   * - Secret = 20
   * - Disabled: 1–18, 21–60 (only 19 and 20 available)
   * - Player guesses 19 → 19 < 20 → disable <= 19 → only 20 left
   *   But before disabling, after disabling 19, we have only 20.
   *   That's 1 number, not 2 adjacent.
   *
   * We need to think more carefully. The two-adjacent check happens
   * AFTER disabling. So let's construct a scenario where AFTER
   * disabling, two adjacent remain.
   */

  it('should trigger elimination when guess narrows to two adjacent numbers', () => {
    // Secret = 20
    // Available: 18, 19, 20 (rest disabled)
    // Player guesses 18 → 18 < 20 → disable <= 18 → remaining: 19, 20
    // Two adjacent! → roundStarter loses by elimination
    const disabled = new Set<number>();
    for (let i = 1; i <= 17; i++) disabled.add(i);
    for (let i = 21; i <= 60; i++) disabled.add(i);

    const state = createTestState(20, {
      disabledNumbers: disabled,
      currentPlayerIndex: 1, // Bob is guessing
      roundStarter: players[0], // Alice started the round
    });

    const { newState, roundResult } = processGuess(state, 18);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('revealedByElimination');
    // The round starter (Alice) should lose, NOT Bob who made the guess
    expect(roundResult!.loser.id).toBe('1'); // Alice
    expect(roundResult!.secretNumber).toBe(20);
    expect(newState.phase).toBe('roundResult');
  });

  it('should end with direct hit if player picks the secret from two adjacent', () => {
    // Secret = 20
    // Available: 19, 20 (rest disabled)
    // Player guesses 20 → direct hit → player loses
    const disabled = new Set<number>();
    for (let i = 1; i <= 18; i++) disabled.add(i);
    for (let i = 21; i <= 60; i++) disabled.add(i);

    const state = createTestState(20, {
      disabledNumbers: disabled,
      currentPlayerIndex: 1, // Bob is guessing
      roundStarter: players[0], // Alice started the round
    });

    const { roundResult } = processGuess(state, 20);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
    // Bob (who guessed) should lose, NOT Alice
    expect(roundResult!.loser.id).toBe('2'); // Bob
  });

  it('should trigger elimination when non-secret is chosen from two adjacent', () => {
    // Secret = 19
    // Available: 19, 20 (rest disabled)
    // Player guesses 20 → 20 > 19 → disable >= 20 → only 19 left
    // But check: after disabling 20, min=19, max=19 → not two adjacent
    // Hmm... this means the two-adjacent check doesn't trigger here.
    //
    // Wait, let me re-read the rules more carefully.
    // The check is for AFTER disabling. If player guesses 20 and secret is 19:
    // - 20 > 19 → disable >= 20 → now only 19 is left
    // - Bounds: min=19, max=19, diff=0 → NOT two adjacent
    //
    // The two-adjacent check triggers when the guess CREATES the 2-adjacent state,
    // not when it RESOLVES it. Let me fix this test.
    //
    // Correct scenario for elimination:
    // Secret = 20, Available: 18, 19, 20
    // Player guesses 18 → 18 < 20 → disable <= 18 → remaining: 19, 20
    // Now min=19, max=20, diff=1 → TWO ADJACENT → roundStarter loses
    //
    // Already tested above. Let me test the opposite: guess from above.

    // Secret = 19
    // Available: 19, 20, 21
    // Player guesses 21 → 21 > 19 → disable >= 21 → remaining: 19, 20
    // min=19, max=20, diff=1 → TWO ADJACENT → roundStarter loses
    const disabled = new Set<number>();
    for (let i = 1; i <= 18; i++) disabled.add(i);
    for (let i = 22; i <= 60; i++) disabled.add(i);

    const state = createTestState(19, {
      disabledNumbers: disabled,
      currentPlayerIndex: 2, // Carol is guessing
      roundStarter: players[0], // Alice started the round
    });

    const { roundResult } = processGuess(state, 21);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('revealedByElimination');
    // Alice (roundStarter) loses, not Carol
    expect(roundResult!.loser.id).toBe('1');
    expect(roundResult!.secretNumber).toBe(19);
  });

  it('complete sequence: gradually narrow to two adjacent numbers', () => {
    // Secret = 35
    // Play a realistic sequence of guesses that narrows the range
    let state = createTestState(35);

    // Alice guesses 20 → secret > 20 → disable 1–20
    let r = processGuess(state, 20);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Bob guesses 50 → secret < 50 → disable 50–60
    r = processGuess(state, 50);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Carol guesses 40 → secret < 40 → disable 40–49
    r = processGuess(state, 40);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Alice guesses 30 → secret > 30 → disable 21–30 (21–30 remaining from disabled)
    r = processGuess(state, 30);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Bob guesses 38 → secret < 38 → disable 38–39
    r = processGuess(state, 38);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Carol guesses 33 → secret > 33 → disable 31–33
    r = processGuess(state, 33);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Alice guesses 37 → secret < 37 → disable 37
    r = processGuess(state, 37);
    state = r.newState;
    expect(r.roundResult).toBeNull();

    // Now available: 34, 35, 36. Secret is 35.
    // Bob guesses 34 → secret > 34 → disable 34 → remaining: 35, 36
    // min=35, max=36, diff=1 → TWO ADJACENT → roundStarter (Alice) loses!
    r = processGuess(state, 34);
    state = r.newState;

    expect(r.roundResult).not.toBeNull();
    expect(r.roundResult!.reason).toBe('revealedByElimination');
    expect(r.roundResult!.loser.id).toBe('1'); // Alice (roundStarter)
    expect(r.roundResult!.secretNumber).toBe(35);
  });

  it('complete sequence: player directly hits the secret from two remaining', () => {
    // Secret = 35
    // Narrow down to 35, 36 available
    let state = createTestState(35, {
      disabledNumbers: (() => {
        const d = new Set<number>();
        for (let i = 1; i <= 34; i++) d.add(i);
        for (let i = 37; i <= 60; i++) d.add(i);
        return d;
      })(),
      currentPlayerIndex: 1,
      roundStarter: players[0],
    });

    // Bob guesses 35 → direct hit → Bob loses
    const { roundResult } = processGuess(state, 35);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
    expect(roundResult!.loser.id).toBe('2'); // Bob, not Alice
  });
});

// ---------------------------------------------------------------------------
// State factory helpers
// ---------------------------------------------------------------------------

describe('createInitialGameState', () => {
  it('should create a valid initial state', () => {
    const state = createInitialGameState(players);

    expect(state.players).toHaveLength(3);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.secretNumber).toBeGreaterThanOrEqual(1);
    expect(state.secretNumber).toBeLessThanOrEqual(60);
    expect(state.disabledNumbers.size).toBe(0);
    expect(state.roundStarter.id).toBe('1'); // First player
    expect(state.roundResult).toBeNull();
    expect(state.phase).toBe('playing');
    expect(state.roundNumber).toBe(1);
  });
});

describe('createNextRoundState', () => {
  it('should make the loser the round starter and current player', () => {
    const prevState = createTestState(25, {
      roundResult: {
        loser: players[1], // Bob lost
        reason: 'guessedSecret',
        secretNumber: 25,
        roundStarter: players[0],
        lastGuess: 25,
      },
      phase: 'roundResult',
    });

    const nextState = createNextRoundState(prevState);

    expect(nextState.roundStarter.id).toBe('2'); // Bob
    expect(nextState.currentPlayerIndex).toBe(1); // Bob's index
    expect(nextState.disabledNumbers.size).toBe(0);
    expect(nextState.roundResult).toBeNull();
    expect(nextState.phase).toBe('playing');
    expect(nextState.roundNumber).toBe(2);
    // New secret should be generated
    expect(nextState.secretNumber).toBeGreaterThanOrEqual(1);
    expect(nextState.secretNumber).toBeLessThanOrEqual(60);
  });

  it('should throw if no round result exists', () => {
    const state = createTestState(25);
    expect(() => createNextRoundState(state)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Edge case: secret = 1
// ---------------------------------------------------------------------------

describe('edge case — secret number is 1', () => {
  it('guess 1 → direct hit, player loses', () => {
    const state = createTestState(1);
    const { roundResult } = processGuess(state, 1);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
    expect(roundResult!.loser.id).toBe('1');
  });

  it('guess 2 → 2 > 1 → disable >= 2 → only 1 left (not two adjacent)', () => {
    const state = createTestState(1);
    const { newState, roundResult } = processGuess(state, 2);

    // After disabling 2–60, only 1 is left.
    // min=1, max=1, diff=0 → not two adjacent
    // BUT wait, 2 is > secret(1), so disable >= 2 means 2–60 disabled.
    // Only 1 left. That's one number, not two adjacent.
    // The round doesn't end by elimination here — but the next player
    // would be forced to pick 1 (the secret). That's handled normally.
    // Actually... with only 1 number left and it IS the secret,
    // the next player will pick it and lose.
    // But per the rules, we DON'T pre-emptively end the round.
    // Hmm, actually: min=max=1, diff=0, so checkTwoAdjacent returns null.
    // The round continues. Next player picks 1 → direct hit → they lose.

    // But let me re-read rule 4 more carefully.
    // Rule 4 says: when exactly two ADJACENT available numbers remain.
    // Here only 1 remains, so rule 4 doesn't apply.

    // Actually, let me reconsider: guess 2, secret 1.
    // 2 > 1 → disable >= 2 → disable 2-60.
    // Remaining: just 1. Only one number.
    // checkTwoAdjacent: min=1, max=1, diff=0 → null → no special case.
    // Round continues. Next player must pick 1 → it's the secret → they lose.
    expect(roundResult).toBeNull();
    expect(newState.disabledNumbers.has(2)).toBe(true);
    expect(newState.disabledNumbers.has(1)).toBe(false);
  });

  it('narrowing to 1 and 2 with secret = 1 — guess 2 = direct hit impossible since secret=1', () => {
    // Available: 1, 2. Secret = 1.
    // Player guesses 2 → 2 > 1 → disable >= 2 → only 1 left.
    // Not two adjacent after (only 1 remains). Round continues normally.
    // Next player picks 1 → direct hit → they lose.
    const disabled = new Set<number>();
    for (let i = 3; i <= 60; i++) disabled.add(i);

    const state = createTestState(1, { disabledNumbers: disabled });
    const { roundResult } = processGuess(state, 2);

    // 2 > secret(1), disable >=2, remaining just 1
    // Not two adjacent → round continues
    expect(roundResult).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Edge case: secret = 60
// ---------------------------------------------------------------------------

describe('edge case — secret number is 60', () => {
  it('guess 60 → direct hit, player loses', () => {
    const state = createTestState(60);
    const { roundResult } = processGuess(state, 60);

    expect(roundResult).not.toBeNull();
    expect(roundResult!.reason).toBe('guessedSecret');
  });

  it('guess 59 → 59 < 60 → disable <= 59 → only 60 left', () => {
    const state = createTestState(60);
    const { newState, roundResult } = processGuess(state, 59);

    // All 1–59 disabled, only 60 remains.
    // Not two adjacent (only 1 number). Round continues.
    expect(roundResult).toBeNull();
    expect(newState.disabledNumbers.size).toBe(59);
    expect(newState.disabledNumbers.has(60)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Two players only
// ---------------------------------------------------------------------------

describe('two player game', () => {
  const twoPlayers: Player[] = [
    { id: 'p1', name: 'Player 1' },
    { id: 'p2', name: 'Player 2' },
  ];

  it('should alternate turns correctly', () => {
    let state: GameState = {
      players: twoPlayers,
      currentPlayerIndex: 0,
      secretNumber: 30,
      disabledNumbers: new Set<number>(),
      roundStarter: twoPlayers[0],
      roundResult: null,
      phase: 'playing',
      roundNumber: 1,
    };

    let r = processGuess(state, 10);
    state = r.newState;
    expect(state.currentPlayerIndex).toBe(1);

    r = processGuess(state, 50);
    state = r.newState;
    expect(state.currentPlayerIndex).toBe(0);

    r = processGuess(state, 20);
    state = r.newState;
    expect(state.currentPlayerIndex).toBe(1);
  });
});
