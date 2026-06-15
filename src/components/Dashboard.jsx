import AddQuestForm from './AddQuestForm.jsx';
import AvatarBadge from './AvatarBadge.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import ProgressBar from './ProgressBar.jsx';
import QuestList from './QuestList.jsx';
import StatGrid from './StatGrid.jsx';
import { DEFAULT_QUESTS, QUESTS_STORAGE_KEY, normalizeQuests } from '../data/defaultQuests.js';
import { DEFAULT_USER, USER_STORAGE_KEY, normalizeUser } from '../data/defaultUser.js';
import { StorageStatus, useCloudStorage } from '../hooks/useCloudStorage.js';
import { useUserProgress } from '../hooks/useUserProgress.js';
import { applyQuestRewards } from '../utils/questRewards.js';
import { storage } from '../lib/storage.js';

export default function Dashboard() {
  const [storedUser, setStoredUser, userStatus, userError] = useCloudStorage(
    USER_STORAGE_KEY,
    DEFAULT_USER,
  );
  const [storedQuests, setStoredQuests, questsStatus, questsError] = useCloudStorage(
    QUESTS_STORAGE_KEY,
    DEFAULT_QUESTS,
  );

  const isLoading =
    userStatus === StorageStatus.LOADING || questsStatus === StorageStatus.LOADING;

  const loadError = userError ?? questsError ?? null;

  const user = normalizeUser(storedUser);
  const quests = normalizeQuests(storedQuests);
  const progress = useUserProgress(user);

  const isCloudSync = storage.type === 'cloud';

  function handleCreateQuest(quest) {
    setStoredQuests((currentQuests) => [...normalizeQuests(currentQuests), quest]);
  }

  function handleCompleteQuest(questId) {
    const completedQuest = quests.find((quest) => quest.id === questId);

    if (!completedQuest) {
      return;
    }

    setStoredUser((currentUser) => applyQuestRewards(currentUser, completedQuest));
    setStoredQuests((currentQuests) =>
      normalizeQuests(currentQuests).filter((quest) => quest.id !== questId),
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (loadError && userStatus === StorageStatus.ERROR && questsStatus === StorageStatus.ERROR) {
    return (
      <LoadingScreen
        error={loadError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#080a12] px-4 py-5 text-slate-100">
      <section className="mx-auto flex w-full max-w-md flex-col gap-5">
        <header className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/72 p-4 shadow-glow">
          <AvatarBadge level={user.level} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                Task Adventurer
              </p>
              <SyncBadge isCloud={isCloudSync} />
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-normal text-white">
              Уровень {user.level}
            </h1>
            <p className="mt-1 text-sm text-slate-400">Темный дашборд прогресса</p>
          </div>
        </header>

        <section className="rounded-lg border border-slate-800 bg-slate-900/72 p-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Опыт</h2>
              <p className="mt-1 text-sm text-slate-400">До следующего уровня</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-cyan-200">
              {progress.currentXP} / {progress.xpRequired} XP
            </p>
          </div>

          <ProgressBar value={progress.progressPercent} />
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/72 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Характеристики</h2>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
              6 навыков
            </span>
          </div>

          <StatGrid stats={user.stats} />
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/72 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white">Квесты</h2>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
              {quests.length} активных
            </span>
          </div>

          <div className="grid gap-4">
            <AddQuestForm onCreateQuest={handleCreateQuest} />
            <QuestList quests={quests} onCompleteQuest={handleCompleteQuest} />
          </div>
        </section>
      </section>
    </main>
  );
}

/**
 * Small badge that indicates whether data is synced via Telegram CloudStorage
 * or stored only in the local browser.
 */
function SyncBadge({ isCloud }) {
  if (isCloud) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300"
        title="Данные синхронизированы через Telegram CloudStorage"
      >
        ☁ Облако
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-slate-600/50 bg-slate-800/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"
      title="Данные хранятся только в этом браузере"
    >
      💾 Локально
    </span>
  );
}
