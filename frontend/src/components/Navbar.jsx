import { Link, useLocation } from "react-router";
import { BookOpenIcon, FileTextIcon, HomeIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5">
        <Link to="/" className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]">
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

        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 p-1.5">
          <Link
            to="/"
            className={`rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
              isActive("/")
                ? "bg-cyan-500/20 text-cyan-200 shadow-inner shadow-cyan-400/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <HomeIcon className="size-4" />
              <span className="hidden sm:inline">Home</span>
            </div>
          </Link>

          <Link
            to="/problems"
            className={`rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
              isActive("/problems")
                ? "bg-cyan-500/20 text-cyan-200 shadow-inner shadow-cyan-400/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpenIcon className="size-4" />
              <span className="hidden sm:inline">Problems</span>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className={`rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-cyan-500/20 text-cyan-200 shadow-inner shadow-cyan-400/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboardIcon className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          <Link
            to="/documents"
            className={`rounded-full px-3.5 py-2 text-sm transition-all duration-200 ${
              isActive("/documents")
                ? "bg-cyan-500/20 text-cyan-200 shadow-inner shadow-cyan-400/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-4" />
              <span className="hidden sm:inline">Documents</span>
            </div>
          </Link>
        </div>

        <div className="ml-2 flex items-center rounded-full border border-white/10 bg-slate-900/70 p-1 shadow-lg shadow-slate-950/40">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
