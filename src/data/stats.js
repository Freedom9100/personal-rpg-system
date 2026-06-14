export const STAT_OPTIONS = [
  { value: 'speech', label: 'Красноречие' },
  { value: 'smithing', label: 'Кузнечное дело' },
  { value: 'restoration', label: 'Восстановление' },
  { value: 'warrior', label: 'Воин' },
  { value: 'alchemy', label: 'Алхимия' },
  { value: 'lockpicking', label: 'Взлом' },
];

export const STAT_LABELS = STAT_OPTIONS.reduce((labels, stat) => {
  labels[stat.value] = stat.label;
  return labels;
}, {});
