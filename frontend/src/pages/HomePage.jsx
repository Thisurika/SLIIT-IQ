import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/clerk-react";

function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <div className="page-shell min-h-screen text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 shadow-lg shadow-cyan-500/20">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="brand-name text-xl text-slate-50">කුප්පිය</span>
              <span className="-mt-0.5 text-[10px] uppercase tracking-[0.35em] text-slate-400">
                AI Study Studio
              </span>
            </div>
          </Link>

          {isSignedIn ? (
            <Link to="/dashboard">
              <button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl">
                <span>Dashboard</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl">
                <span>Get Started</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
              <ZapIcon className="size-4" />
              Real-time Collaboration
            </div>

            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-slate-50">Learn Together</span>
            </h1>

            <div className="max-w-xl space-y-5 text-lg leading-relaxed text-slate-300">
              <p>
                <strong className="font-semibold text-cyan-300">කුප්පිය</strong> is a modern learning platform designed for students to learn, collaborate, and grow together. Join interactive Kuppiya sessions, connect with peers and mentors, and prepare for technical interviews with confidence.
              </p>
              <p className="text-slate-400">
                If you're stuck on a coding problem, simply upload it to the platform and receive guidance from fellow students through discussions, one-on-one video sessions, or collaborative coding. Share your knowledge by helping others solve their challenges and learn together as a community.
              </p>
              <p className="text-slate-400">
                With our AI Assistant, you can upload study materials to receive instant summaries, generate smart quizzes, and get personalized learning support. Whether you're solving coding challenges, teaching others, or learning from experienced peers, <strong className="font-semibold text-cyan-300">කුප්පිය</strong> provides everything you need to build your skills in one collaborative platform.
              </p>
            </div>


            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-sm text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-emerald-300" />
                  Live Video Chat
                </div>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-sm text-cyan-200">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-cyan-300" />
                  Code Editor
                </div>
              </div>
              <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3.5 py-2 text-sm text-violet-200">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-violet-300" />
                  Multi-Language
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {isSignedIn ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                  <ArrowRightIcon className="size-5" />
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg">
                    Start Coding Now
                    <ArrowRightIcon className="size-5" />
                  </button>
                </SignInButton>
              )}

              <button className="btn btn-outline btn-lg border-white/15 text-slate-100 hover:bg-white/10">
                <VideoIcon className="size-5" />
                Watch Demo
              </button>
            </div>

            <div className="stats stats-vertical bg-slate-900/70 shadow-2xl shadow-slate-950/40 lg:stats-horizontal">
              <div className="stat">
                <div className="stat-value text-cyan-300">10K+</div>
                <div className="stat-title text-slate-400">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value text-violet-300">50K+</div>
                <div className="stat-title text-slate-400">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-emerald-300">99.9%</div>
                <div className="stat-title text-slate-400">Uptime</div>
              </div>
            </div>
          </div>

          <img
            src="https://img.freepik.com/free-vector/advanced-computer-skills-abstract-concept-illustration_335657-2255.jpg?semt=ais_incoming&w=740&q=80"
            alt="CodeCollab Platform"
            className="h-auto w-full rounded-[2rem] border border-white/10 shadow-2xl shadow-slate-950/50 transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Everything You Need to <span className="font-mono text-cyan-300">Succeed</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card hero-card">
            <div className="card-body items-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-cyan-400/10">
                <VideoIcon className="size-8 text-cyan-300" />
              </div>
              <h3 className="card-title text-slate-50">HD Video Call</h3>
              <p className="text-slate-300">
                Crystal clear video and audio for seamless communication during interviews
              </p>
            </div>
          </div>

          <div className="card hero-card">
            <div className="card-body items-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-violet-400/10">
                <Code2Icon className="size-8 text-violet-300" />
              </div>
              <h3 className="card-title text-slate-50">Live Code Editor</h3>
              <p className="text-slate-300">
                Collaborate in real-time with syntax highlighting and multiple language support
              </p>
            </div>
          </div>

          <div className="card hero-card">
            <div className="card-body items-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-emerald-400/10">
                <UsersIcon className="size-8 text-emerald-300" />
              </div>
              <h3 className="card-title text-slate-50">Easy Collaboration</h3>
              <p className="text-slate-300">
                Share your screen, discuss solutions, and learn from each other in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
