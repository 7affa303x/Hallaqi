import { useContext } from 'react';
import { AppContext } from './context';
import type { AppState } from './types';

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
