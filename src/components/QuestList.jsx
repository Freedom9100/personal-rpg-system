import { STAT_LABELS } from '../data/stats.js';

export default function QuestList({ quests, onCompleteQuest }) {
  if (quests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/60 p-5 text-center">
        <p className="text-sm font-semibold text-slate-300">Активных квестов пока нет</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {quests.map((quest) => {
        const statLabel = STAT_LABELS[quest.statRewardType] ?? quest.statRewardType;

        return (
          <article
            className="rounded-lg border border-slate-800 bg-slate-950/78 p-4"
            key={quest.id}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 break-words text-base font-bold text-white">{quest.title}</h3>

              <button
                className="h-9 shrink-0 rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/16"
                onClick={() => onCompleteQuest(quest.id)}
                type="button"
              >
                Выполнить
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                💎 +{quest.xpReward} XP
              </span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100">
                ⚔️ {statLabel} +{quest.statRewardValue}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
