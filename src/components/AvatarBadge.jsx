export default function AvatarBadge({ level }) {
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950 shadow-glow">
      <div className="absolute inset-2 rounded-full border border-slate-700/80 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.28),rgba(15,23,42,0.96)_64%)]" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/20 bg-slate-900 text-lg font-black text-cyan-100">
        RPG
      </div>
      <div className="absolute -bottom-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-bold text-cyan-200">
        LVL {level}
      </div>
    </div>
  );
}
