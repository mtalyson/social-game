export const EGamePhase = {
  SETUP: 'setup',
  PLAYING: 'playing',
  ROUND_RESULT: 'roundResult',
} as const;

export const ELossReason = {
  GUESSED_SECRET: 'guessedSecret',
  REVEALED_BY_ELIMINATION: 'revealedByElimination',
  LAST_NUMBER_REMAINING: 'lastNumberRemaining',
} as const;

export const EGameActionType = {
  START_GAME: 'START_GAME',
  MAKE_GUESS: 'MAKE_GUESS',
  NEXT_ROUND: 'NEXT_ROUND',
  CHANGE_PLAYERS: 'CHANGE_PLAYERS',
  RESET_GAME: 'RESET_GAME',
} as const;
