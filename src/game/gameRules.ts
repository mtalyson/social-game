/**
 * Pure game rules for "Jogo do Número".
 *
 * Every function here is a pure function (no side-effects, no React imports).
 * They encode the rules of the game and are designed to be easily testable
 * and reusable on a future server-side implementation.
 */

import { MIN_NUMBER, MAX_NUMBER } from './types';

// ---------------------------------------------------------------------------
// Random number generation
// ---------------------------------------------------------------------------

/**
 * Generates a random secret number between MIN_NUMBER and MAX_NUMBER (inclusive).
 *
 * Extracted as a standalone function so it can be easily replaced with a
 * server-side implementation in the future (e.g. using a cryptographic RNG).
 */
export function getRandomSecretNumber(): number {
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
}

// ---------------------------------------------------------------------------
// Number availability helpers
// ---------------------------------------------------------------------------

/**
 * Returns the list of numbers that are still available (not disabled).
 */
export function getAvailableNumbers(disabledNumbers: Set<number>): number[] {
  const available: number[] = [];
  for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
    if (!disabledNumbers.has(i)) {
      available.push(i);
    }
  }
  return available;
}

/**
 * Returns the smallest and largest numbers that are still available.
 * Returns null if no numbers are available.
 */
export function getAvailableBounds(
  disabledNumbers: Set<number>
): { min: number; max: number } | null {
  let min: number | null = null;
  let max: number | null = null;

  for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
    if (!disabledNumbers.has(i)) {
      if (min === null) min = i;
      max = i;
    }
  }

  if (min === null || max === null) return null;
  return { min, max };
}

/**
 * Checks whether a specific number is still available for guessing.
 */
export function isNumberAvailable(
  n: number,
  disabledNumbers: Set<number>
): boolean {
  return n >= MIN_NUMBER && n <= MAX_NUMBER && !disabledNumbers.has(n);
}

// ---------------------------------------------------------------------------
// Disable logic
// ---------------------------------------------------------------------------

/**
 * Given a guess and the secret number, returns the set of numbers that
 * should be disabled after this guess.
 *
 * Rules:
 * - If guess < secretNumber → disable all available numbers <= guess
 * - If guess > secretNumber → disable all available numbers >= guess
 * - If guess === secretNumber → the round ends immediately; no numbers
 *   need to be disabled (the caller handles this case before reaching here).
 */
export function getNumbersToDisable(
  guess: number,
  secretNumber: number,
  disabledNumbers: Set<number>
): number[] {
  const toDisable: number[] = [];

  if (guess < secretNumber) {
    // Secret is higher → eliminate everything at or below the guess
    for (let i = MIN_NUMBER; i <= guess; i++) {
      if (!disabledNumbers.has(i)) {
        toDisable.push(i);
      }
    }
  } else if (guess > secretNumber) {
    // Secret is lower → eliminate everything at or above the guess
    for (let i = guess; i <= MAX_NUMBER; i++) {
      if (!disabledNumbers.has(i)) {
        toDisable.push(i);
      }
    }
  }
  // If guess === secretNumber, nothing to disable (round ends).

  return toDisable;
}

// ---------------------------------------------------------------------------
// Two-adjacent-remaining check (Rule #4 – special case)
// ---------------------------------------------------------------------------

/**
 * After a guess has been processed (numbers disabled), checks whether the
 * game has reached the special "two adjacent numbers" state.
 *
 * This happens when the minimum and maximum of the remaining available
 * numbers differ by exactly 1 (i.e., they are adjacent), AND both are
 * still available.
 *
 * IMPORTANT: This check must be performed AFTER each guess (never before),
 * because it is the guess itself that reveals which of the two remaining
 * numbers is the secret.
 *
 * When this state is detected, it means:
 * - The current player just made a guess that was NOT the secret
 *   (otherwise the round would have ended already via the direct-hit rule).
 * - Their guess narrowed the range down to exactly two adjacent numbers.
 * - Since both remaining numbers are available and the secret must be one
 *   of them, the secret is effectively revealed by elimination.
 * - Per Rule #4: the round starter (not the current player) loses.
 *
 * Numbers disabled "in the middle" of the range by previous guesses do NOT
 * count — only the min and max of available numbers matter.
 *
 * @returns The two remaining adjacent numbers if the condition is met, or null.
 */
export function checkTwoAdjacentRemaining(
  disabledNumbers: Set<number>
): { remaining: [number, number] } | null {
  const bounds = getAvailableBounds(disabledNumbers);
  if (!bounds) return null;

  const { min, max } = bounds;

  // Check: are there exactly two numbers, and are they adjacent?
  if (max - min === 1) {
    // Verify both are actually available (they should be, since they are
    // the bounds, but let's be safe).
    if (!disabledNumbers.has(min) && !disabledNumbers.has(max)) {
      return { remaining: [min, max] };
    }
  }

  return null;
}
