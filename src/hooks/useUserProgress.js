import { useMemo } from 'react';
import { getLevelProgress } from '../utils/leveling.js';

export function useUserProgress(user) {
  return useMemo(() => getLevelProgress(user.currentXP, user.level), [user.currentXP, user.level]);
}
