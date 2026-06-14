export const DEFAULT_QUESTS = [];

export const QUESTS_STORAGE_KEY = 'rpg-task-tracker:quests';

export function normalizeQuests(quests) {
  return Array.isArray(quests) ? quests : DEFAULT_QUESTS;
}
