import { STAT_OPTIONS } from '../data/stats.js';

export default function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {STAT_OPTIONS.map(({ value: statKey, label }) => (
        <article
          className="flex min-h-20 items-center justify-between rounded-lg border border-slate-800 bg-slate-950/78 p-4"
          key={statKey}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-200">{label}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{statKey}</p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-lg font-black text-cyan-100">
            {stats[statKey] ?? 0}
          </div>
        </article>
      ))}
    </div>
  );
}
