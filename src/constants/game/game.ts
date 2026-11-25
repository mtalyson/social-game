export const MIN_NUMBER = 1;
export const MAX_NUMBER = 60;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const MIN_PLAYER_NAME_LENGTH = 3;

export const GRID_COLUMNS = 6;
export const GRID_CELL_MARGIN = 6;

export const GRID_NUMBERS = Array.from(
  { length: MAX_NUMBER - MIN_NUMBER + 1 },
  (_, i) => MIN_NUMBER + i,
);
