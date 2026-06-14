const BASE_XP_TO_LEVEL_TWO = 500;
const XP_GROWTH_RATE = 1.2;

export function getXpRequiredForNextLevel(level) {
  const normalizedLevel = Math.max(1, Number(level) || 1);

  return Math.round(BASE_XP_TO_LEVEL_TWO * XP_GROWTH_RATE ** (normalizedLevel - 1));
}

export function getLevelProgress(currentXP, level) {
  const xpRequired = getXpRequiredForNextLevel(level);
  const safeCurrentXP = Math.max(0, Number(currentXP) || 0);
  const progressPercent = Math.min(100, Math.round((safeCurrentXP / xpRequired) * 100));

  return {
    xpRequired,
    progressPercent,
    currentXP: safeCurrentXP,
  };
}

export function applyXpWithLevelUps(user, xpReward) {
  let level = Math.max(1, Number(user.level) || 1);
  let currentXP =
    Math.max(0, Number(user.currentXP) || 0) + Math.max(0, Math.round(Number(xpReward) || 0));
  let requiredXP = getXpRequiredForNextLevel(level);

  // Цикл нужен для больших наград: он поднимает несколько уровней за раз,
  // переносит остаток XP и пересчитывает порог уже для нового уровня.
  while (currentXP >= requiredXP) {
    currentXP -= requiredXP;
    level += 1;
    requiredXP = getXpRequiredForNextLevel(level);
  }

  return {
    ...user,
    level,
    currentXP,
  };
}
