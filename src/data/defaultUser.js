export const DEFAULT_USER = {
  level: 1,
  currentXP: 0,
  stats: {
    speech: 0,
    smithing: 0,
    restoration: 0,
    warrior: 0,
    alchemy: 0,
    lockpicking: 0,
  },
};

export const USER_STORAGE_KEY = 'rpg-task-tracker:user';

export function normalizeUser(user) {
  return {
    ...DEFAULT_USER,
    ...user,
    stats: {
      ...DEFAULT_USER.stats,
      ...user?.stats,
    },
  };
}
