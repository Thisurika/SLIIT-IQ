import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon, PlusCircleIcon } from "lucide-react";

function WelcomeSection({ onCreateSession, onAddProblem }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 shadow-lg shadow-cyan-500/20">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-4xl font-black text-transparent lg:text-5xl">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="ml-16 text-xl text-slate-300">
              Ready to level up your coding skills?
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            {onAddProblem && (
              <button
                id="dashboard-add-problem-btn"
                onClick={onAddProblem}
                className="group rounded-2xl border border-violet-400/20 bg-slate-900/70 px-6 py-3.5 transition-all duration-200 hover:border-violet-400/50 hover:bg-violet-400/10"
              >
                <div className="flex items-center gap-2.5 text-base font-bold text-violet-200">
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>Add Problem</span>
                </div>
              </button>
            )}

            <button
              id="dashboard-create-session-btn"
              onClick={onCreateSession}
              className="group rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3.5 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
            >
              <div className="flex items-center gap-2.5 text-base font-bold text-white">
                <ZapIcon className="h-5 w-5" />
                <span>Create Session</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;