export default function ProgressBar({ value }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-950"
      role="progressbar"
      aria-label="Прогресс опыта"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={clampedValue}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 transition-all duration-500"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
