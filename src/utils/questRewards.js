import { DEFAULT_USER, normalizeUser } from '../data/defaultUser.js';
import { applyXpWithLevelUps } from './leveling.js';

export function applyQuestRewards(user, quest) {
  const normalizedUser = normalizeUser(user);
  const statRewardType = quest.statRewardType;
  const statRewardValue = Math.max(0, Math.round(Number(quest.statRewardValue) || 0));
  const canRewardStat = Object.prototype.hasOwnProperty.call(DEFAULT_USER.stats, statRewardType);

  const userWithStats = {
    ...normalizedUser,
    stats: {
      ...normalizedUser.stats,
      ...(canRewardStat
        ? {
            [statRewardType]: (Number(normalizedUser.stats[statRewardType]) || 0) + statRewardValue,
          }
        : {}),
    },
  };

  return applyXpWithLevelUps(userWithStats, quest.xpReward);
}
