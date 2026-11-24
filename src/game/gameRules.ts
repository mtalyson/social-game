import { MIN_NUMBER, MAX_NUMBER } from './types';

export function getRandomSecretNumber(): number {
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
}

export function getAvailableNumbers(disabledNumbers: Set<number>): number[] {
  const available: number[] = [];
  for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
    if (!disabledNumbers.has(i)) {
      available.push(i);
    }
  }
  return available;
}

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

export function isNumberAvailable(
  n: number,
  disabledNumbers: Set<number>
): boolean {
  return n >= MIN_NUMBER && n <= MAX_NUMBER && !disabledNumbers.has(n);
}

export function getNumbersToDisable(
  guess: number,
  secretNumber: number,
  disabledNumbers: Set<number>
): number[] {
  const toDisable: number[] = [];

  if (guess < secretNumber) {
    for (let i = MIN_NUMBER; i <= guess; i++) {
      if (!disabledNumbers.has(i)) {
        toDisable.push(i);
      }
    }
  } else if (guess > secretNumber) {
    for (let i = guess; i <= MAX_NUMBER; i++) {
      if (!disabledNumbers.has(i)) {
        toDisable.push(i);
      }
    }
  }

  return toDisable;
}

export function checkTwoAdjacentRemaining(
  disabledNumbers: Set<number>
): { remaining: [number, number] } | null {
  const bounds = getAvailableBounds(disabledNumbers);
  if (!bounds) return null;

  const { min, max } = bounds;

  if (max - min === 1) {
    if (!disabledNumbers.has(min) && !disabledNumbers.has(max)) {
      return { remaining: [min, max] };
    }
  }

  return null;
}
