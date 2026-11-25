import {
  getRandomSecretNumber,
  getAvailableNumbers,
  getAvailableBounds,
  isNumberAvailable,
  getNumbersToDisable,
  checkTwoAdjacentRemaining,
  checkSingleRemaining,
} from './gameRules';
import { MIN_NUMBER, MAX_NUMBER } from '@/constants/game/game';

describe('getRandomSecretNumber', () => {
  it('should return a number between MIN_NUMBER and MAX_NUMBER (inclusive)', () => {
    for (let i = 0; i < 200; i++) {
      const n = getRandomSecretNumber();
      expect(n).toBeGreaterThanOrEqual(MIN_NUMBER);
      expect(n).toBeLessThanOrEqual(MAX_NUMBER);
      expect(Number.isInteger(n)).toBe(true);
    }
  });
});

describe('getAvailableNumbers', () => {
  it('should return all 60 numbers when none are disabled', () => {
    const available = getAvailableNumbers(new Set());
    expect(available.length).toBe(60);
    expect(available[0]).toBe(1);
    expect(available[59]).toBe(60);
  });

  it('should exclude disabled numbers', () => {
    const disabled = new Set([1, 2, 3, 58, 59, 60]);
    const available = getAvailableNumbers(disabled);
    expect(available.length).toBe(54);
    expect(available).not.toContain(1);
    expect(available).not.toContain(60);
    expect(available).toContain(4);
    expect(available).toContain(57);
  });

  it('should return empty array when all numbers are disabled', () => {
    const allDisabled = new Set<number>();
    for (let i = 1; i <= 60; i++) allDisabled.add(i);
    expect(getAvailableNumbers(allDisabled).length).toBe(0);
  });
});

describe('getAvailableBounds', () => {
  it('should return min=1, max=60 when nothing is disabled', () => {
    const bounds = getAvailableBounds(new Set());
    expect(bounds).toEqual({ min: 1, max: 60 });
  });

  it('should return correct bounds after lower numbers disabled', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 30; i++) disabled.add(i);
    const bounds = getAvailableBounds(disabled);
    expect(bounds).toEqual({ min: 31, max: 60 });
  });

  it('should return null when all numbers are disabled', () => {
    const allDisabled = new Set<number>();
    for (let i = 1; i <= 60; i++) allDisabled.add(i);
    expect(getAvailableBounds(allDisabled)).toBeNull();
  });

  it('should handle sparse disabled numbers (gaps in middle)', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 10; i++) disabled.add(i);
    for (let i = 50; i <= 60; i++) disabled.add(i);
    const bounds = getAvailableBounds(disabled);
    expect(bounds).toEqual({ min: 11, max: 49 });
  });
});

describe('isNumberAvailable', () => {
  it('should return true for available numbers', () => {
    expect(isNumberAvailable(30, new Set())).toBe(true);
    expect(isNumberAvailable(1, new Set())).toBe(true);
    expect(isNumberAvailable(60, new Set())).toBe(true);
  });

  it('should return false for disabled numbers', () => {
    const disabled = new Set([15, 30, 45]);
    expect(isNumberAvailable(15, disabled)).toBe(false);
    expect(isNumberAvailable(30, disabled)).toBe(false);
  });

  it('should return false for out-of-range numbers', () => {
    expect(isNumberAvailable(0, new Set())).toBe(false);
    expect(isNumberAvailable(61, new Set())).toBe(false);
    expect(isNumberAvailable(-1, new Set())).toBe(false);
  });
});

describe('getNumbersToDisable', () => {
  it('should disable numbers <= guess when guess < secretNumber', () => {
    const toDisable = getNumbersToDisable(30, 45, new Set());
    expect(toDisable.length).toBe(30);
    expect(toDisable).toContain(1);
    expect(toDisable).toContain(30);
    expect(toDisable).not.toContain(31);
  });

  it('should disable numbers >= guess when guess > secretNumber', () => {
    const toDisable = getNumbersToDisable(40, 20, new Set());
    expect(toDisable.length).toBe(21);
    expect(toDisable).toContain(40);
    expect(toDisable).toContain(60);
    expect(toDisable).not.toContain(39);
  });

  it('should return empty array when guess === secretNumber', () => {
    const toDisable = getNumbersToDisable(25, 25, new Set());
    expect(toDisable.length).toBe(0);
  });

  it('should not include already-disabled numbers in the result', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 10; i++) disabled.add(i);
    const toDisable = getNumbersToDisable(20, 45, disabled);
    expect(toDisable.length).toBe(10);
    expect(toDisable).not.toContain(1);
    expect(toDisable).toContain(11);
    expect(toDisable).toContain(20);
  });

  it('edge case: guess is 1 and secret is higher', () => {
    const toDisable = getNumbersToDisable(1, 30, new Set());
    expect(toDisable).toEqual([1]);
  });

  it('edge case: guess is 60 and secret is lower', () => {
    const toDisable = getNumbersToDisable(60, 30, new Set());
    expect(toDisable).toEqual([60]);
  });

  it('edge case: guess is 1 and secret is 1 (direct hit)', () => {
    const toDisable = getNumbersToDisable(1, 1, new Set());
    expect(toDisable.length).toBe(0);
  });

  it('edge case: guess is 60 and secret is 60 (direct hit)', () => {
    const toDisable = getNumbersToDisable(60, 60, new Set());
    expect(toDisable.length).toBe(0);
  });

  it('should preserve "skipped" numbers in the middle of the range', () => {
    const disabled = new Set<number>();
    const toDisable = getNumbersToDisable(30, 45, disabled);
    for (const n of toDisable) disabled.add(n);

    for (let i = 31; i <= 44; i++) {
      expect(disabled.has(i)).toBe(false);
    }
    for (let i = 45; i <= 60; i++) {
      expect(disabled.has(i)).toBe(false);
    }
  });
});

describe('checkTwoAdjacentRemaining', () => {
  it('should return null when many numbers are still available', () => {
    expect(checkTwoAdjacentRemaining(new Set())).toBeNull();
  });

  it('should return null when bounds differ by more than 1', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 60; i++) {
      if (i !== 10 && i !== 12) disabled.add(i);
    }
    expect(checkTwoAdjacentRemaining(disabled)).toBeNull();
  });

  it('should detect two adjacent numbers: 19 and 20', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 60; i++) {
      if (i !== 19 && i !== 20) disabled.add(i);
    }
    const result = checkTwoAdjacentRemaining(disabled);
    expect(result).toEqual({ remaining: [19, 20] });
  });

  it('should detect two adjacent numbers: 1 and 2', () => {
    const disabled = new Set<number>();
    for (let i = 3; i <= 60; i++) disabled.add(i);
    const result = checkTwoAdjacentRemaining(disabled);
    expect(result).toEqual({ remaining: [1, 2] });
  });

  it('should detect two adjacent numbers: 59 and 60', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 58; i++) disabled.add(i);
    const result = checkTwoAdjacentRemaining(disabled);
    expect(result).toEqual({ remaining: [59, 60] });
  });

  it('should return null when only one number is available', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 60; i++) {
      if (i !== 30) disabled.add(i);
    }
    expect(checkTwoAdjacentRemaining(disabled)).toBeNull();
  });

  it('should return null when three or more numbers span adjacent range', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 60; i++) {
      if (i !== 18 && i !== 19 && i !== 20) disabled.add(i);
    }
    expect(checkTwoAdjacentRemaining(disabled)).toBeNull();
  });
});

describe('checkSingleRemaining', () => {
  it('should return the number when only 1 number remains', () => {
    const disabled = new Set<number>();
    for (let i = 2; i <= 60; i++) disabled.add(i);
    expect(checkSingleRemaining(disabled)).toBe(1);
  });

  it('should return null when two or more numbers remain', () => {
    const disabled = new Set<number>();
    for (let i = 3; i <= 60; i++) disabled.add(i);
    expect(checkSingleRemaining(disabled)).toBeNull();
  });

  it('should return null when no numbers remain', () => {
    const disabled = new Set<number>();
    for (let i = 1; i <= 60; i++) disabled.add(i);
    expect(checkSingleRemaining(disabled)).toBeNull();
  });
});
