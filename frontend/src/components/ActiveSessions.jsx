import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="card h-full border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:col-span-2">
      <div className="card-body">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 p-2">
              <ZapIcon className="size-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-50">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">{sessions.length} active</span>
          </div>
        </div>

        <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-cyan-300" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session._id} className="card border border-white/10 bg-slate-950/60">
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500">
                      <Code2Icon className="size-7 text-white" />
                      <div className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-slate-950 bg-emerald-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="truncate text-lg font-bold text-slate-50">{session.problem}</h3>
                        <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                          {session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4" />
                          <span className="font-medium">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4" />
                          <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="badge badge-error badge-sm">FULL</span>
                        ) : (
                          <span className="badge badge-success badge-sm">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <button className="btn btn-disabled btn-sm">Full</button>
                  ) : (
                    <Link to={`/session/${session._id}`} className="btn btn-primary btn-sm gap-2">
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20">
                <SparklesIcon className="h-10 w-10 text-cyan-300/70" />
              </div>
              <p className="mb-1 text-lg font-semibold text-slate-200">No active sessions</p>
              <p className="text-sm text-slate-400">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;
