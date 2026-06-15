/**
 * Skeleton loading screen shown while CloudStorage (or localStorage) data
 * is being fetched on first mount. Mimics the exact layout of Dashboard so
 * there is no jarring layout shift when real content arrives.
 */
export default function LoadingScreen({ error, onRetry }) {
  if (error) {
    return (
      <main className="min-h-screen bg-[#080a12] px-4 py-5 text-slate-100">
        <section className="mx-auto flex w-full max-w-md flex-col items-center gap-6 pt-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-red-400">Ошибка загрузки данных</p>
            <p className="mt-2 text-sm text-slate-500">{error.message}</p>
          </div>
          {onRetry && (
            <button
              className="h-11 rounded-lg border border-slate-700 bg-slate-900 px-6 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
              onClick={onRetry}
              type="button"
            >
              Попробовать снова
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080a12] px-4 py-5 text-slate-100">
      <section className="mx-auto flex w-full max-w-md flex-col gap-5">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/72 p-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-6 w-36 rounded" />
            <Skeleton className="h-3 w-44 rounded" />
          </div>
        </div>

        {/* XP section skeleton */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/72 p-4 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Stats section skeleton */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/72 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Quests section skeleton */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/72 p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </section>
    </main>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-800/70 ${className}`} />;
}
