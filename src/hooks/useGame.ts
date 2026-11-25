import { useContext } from 'react';
import { GameContext } from '@/contexts/gameContext';
import type { IGameContextValue } from '@/types/game/interfaces/gameContexts';

export function useGame(): IGameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
