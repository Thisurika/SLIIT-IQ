import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:col-span-1">
      <div className="card border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="card-body">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-2xl bg-cyan-400/10 p-3">
              <UsersIcon className="h-7 w-7 text-cyan-300" />
            </div>
            <div className="badge badge-primary">Live</div>
          </div>
          <div className="mb-1 text-4xl font-black text-slate-50">{activeSessionsCount}</div>
          <div className="text-sm text-slate-400">Active Sessions</div>
        </div>
      </div>

      <div className="card border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="card-body">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-2xl bg-violet-400/10 p-3">
              <TrophyIcon className="h-7 w-7 text-violet-300" />
            </div>
          </div>
          <div className="mb-1 text-4xl font-black text-slate-50">{recentSessionsCount}</div>
          <div className="text-sm text-slate-400">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
