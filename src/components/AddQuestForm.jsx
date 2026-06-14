import { useState } from 'react';
import { STAT_OPTIONS } from '../data/stats.js';

const INITIAL_FORM = {
  title: '',
  xpReward: '50',
  statRewardType: STAT_OPTIONS[0].value,
  statRewardValue: '1',
};

function createQuestId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AddQuestForm({ onCreateQuest }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const title = form.title.trim();
  const xpReward = Number(form.xpReward);
  const statRewardValue = Number(form.statRewardValue);
  const isValid =
    title.length > 0 &&
    Number.isFinite(xpReward) &&
    xpReward > 0 &&
    Number.isFinite(statRewardValue) &&
    statRewardValue > 0;

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    onCreateQuest({
      id: createQuestId(),
      title,
      xpReward: Math.round(xpReward),
      statRewardType: form.statRewardType,
      statRewardValue: Math.round(statRewardValue),
    });

    setForm(INITIAL_FORM);
  }

  return (
    <form className="rounded-lg border border-slate-800 bg-slate-950/78 p-4" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Название квеста
          </span>
          <input
            className="h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Например: Тренировка"
            required
            type="text"
            value={form.title}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold text-slate-500">XP</span>
            <input
              className="h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
              min="1"
              onChange={(event) => updateField('xpReward', event.target.value)}
              required
              type="number"
              value={form.xpReward}
            />
          </label>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Очки навыка
            </span>
            <input
              className="h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
              min="1"
              onChange={(event) => updateField('statRewardValue', event.target.value)}
              required
              type="number"
              value={form.statRewardValue}
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Навык
          </span>
          <select
            className="h-11 w-full min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
            onChange={(event) => updateField('statRewardType', event.target.value)}
            value={form.statRewardType}
          >
            {STAT_OPTIONS.map((stat) => (
              <option key={stat.value} value={stat.value}>
                {stat.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="mt-4 h-11 w-full rounded-lg border border-cyan-300/30 bg-cyan-300/12 px-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
        disabled={!isValid}
        type="submit"
      >
        Создать квест
      </button>
    </form>
  );
}
