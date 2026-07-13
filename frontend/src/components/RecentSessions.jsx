import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="card mt-8 border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
      <div className="card-body">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 p-2">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-50">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className="h-10 w-10 animate-spin text-cyan-300" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`card relative border ${
                  session.status === "active"
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-white/10 bg-slate-950/60"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute right-3 top-3">
                    <div className="badge badge-success gap-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="card-body p-5">
                  <div className="mb-4 flex items-start gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${session.status === "active" ? "bg-gradient-to-br from-emerald-400 to-emerald-500" : "bg-gradient-to-br from-cyan-500 to-violet-500"}`}>
                      <Code2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 truncate text-base font-bold text-slate-50">{session.problem}</h3>
                      <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Completed</span>
                    <span className="text-xs text-slate-500">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20">
                <Trophy className="h-10 w-10 text-cyan-300/60" />
              </div>
              <p className="mb-1 text-lg font-semibold text-slate-200">No sessions yet</p>
              <p className="text-sm text-slate-400">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
