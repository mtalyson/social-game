import {
  EGamePhase,
  ELossReason,
  EGameActionType,
} from '@/types/game/enums/game';

export type TGamePhase = (typeof EGamePhase)[keyof typeof EGamePhase];

export type TLossReason = (typeof ELossReason)[keyof typeof ELossReason];

export type TGameActionType =
  (typeof EGameActionType)[keyof typeof EGameActionType];

export interface IPlayer {
  id: string;
  name: string;
}

export interface IRoundResult {
  loser: IPlayer;
  reason: TLossReason;
  secretNumber: number;
  roundStarter: IPlayer;
  lastGuess: number;
}

export interface ISetupGameState {
  phase: typeof EGamePhase.SETUP;
  players: IPlayer[];
  roundNumber: number;
}

export interface IPlayingGameState {
  phase: typeof EGamePhase.PLAYING;
  players: IPlayer[];
  currentPlayerIndex: number;
  secretNumber: number;
  disabledNumbers: Set<number>;
  roundStarter: IPlayer;
  roundNumber: number;
  lastError: string | null;
}

export interface IRoundResultGameState {
  phase: typeof EGamePhase.ROUND_RESULT;
  players: IPlayer[];
  currentPlayerIndex: number;
  secretNumber: number;
  disabledNumbers: Set<number>;
  roundStarter: IPlayer;
  roundResult: IRoundResult;
  roundNumber: number;
}

export type TGameState =
  ISetupGameState | IPlayingGameState | IRoundResultGameState;

export type TGameAction =
  | { type: typeof EGameActionType.START_GAME; players: IPlayer[] }
  | { type: typeof EGameActionType.MAKE_GUESS; number: number }
  | { type: typeof EGameActionType.NEXT_ROUND }
  | { type: typeof EGameActionType.RESET_GAME };

export interface IGuessOutcome {
  newState: IPlayingGameState | IRoundResultGameState;
  roundResult: IRoundResult | null;
}

export interface INumberCellProps {
  number: number;
  disabled: boolean;
  size: number;
  onPress: (number: number) => void;
}

export interface INumberGridProps {
  disabledNumbers: Set<number>;
  onSelectNumber: (number: number) => void;
  minAvailable: number | null;
  maxAvailable: number | null;
}

export interface IPlayerTurnBannerProps {
  playerName: string;
  roundNumber: number;
}

export interface IConfirmGuessModalProps {
  selectedNumber: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}
