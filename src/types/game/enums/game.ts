export const EGamePhase = {
  SETUP: 'setup',
  PLAYING: 'playing',
  ROUND_RESULT: 'roundResult',
} as const;

export const ELossReason = {
  GUESSED_SECRET: 'guessedSecret',
  REVEALED_BY_ELIMINATION: 'revealedByElimination',
} as const;

export const EGameActionType = {
  START_GAME: 'START_GAME',
  MAKE_GUESS: 'MAKE_GUESS',
  NEXT_ROUND: 'NEXT_ROUND',
  RESET_GAME: 'RESET_GAME',
} as const;
