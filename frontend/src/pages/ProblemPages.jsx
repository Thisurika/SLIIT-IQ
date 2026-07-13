import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import AddProblemModal from "../components/AddProblemModal";
import { useProblems } from "../hooks/useProblems";
import {
  ChevronRightIcon,
  Code2Icon,
  PlusCircleIcon,
  FilterIcon,
  Trash2Icon,
  StarIcon,
  UserCircle2Icon,
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const { allProblems, customProblems, addProblem, deleteProblem } = useProblems();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const problems = Object.values(allProblems);

  const filteredProblems = problems.filter((p) => {
    const matchesDifficulty = filter === "All" || p.difficulty === filter;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;
  const customCount = Object.keys(customProblems).length;

  const handleAddProblem = (formData) => {
    const id = addProblem(formData);
    return id;
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this custom problem?")) {
      deleteProblem(id);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">Practice Problems</h1>
            <p className="text-base-content/70">
              Sharpen your coding skills with these curated problems
            </p>
          </div>

          {/* ADD PROBLEM BUTTON */}
          <button
            id="add-problem-btn"
            className="btn btn-primary gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
            onClick={() => setShowAddModal(true)}
          >
            <PlusCircleIcon className="size-5" />
            Add Problem
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              className="input input-bordered w-full pl-10"
              placeholder="Search problems by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          </div>

          <div className="flex gap-2">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button
                key={d}
                className={`btn btn-sm ${
                  filter === d
                    ? d === "All"
                      ? "btn-primary"
                      : d === "Easy"
                      ? "btn-success"
                      : d === "Medium"
                      ? "btn-warning"
                      : "btn-error"
                    : "btn-outline"
                }`}
                onClick={() => setFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="card bg-base-100 shadow">
              <div className="card-body items-center text-center py-16">
                <Code2Icon className="size-12 text-base-content/20 mb-3" />
                <h3 className="text-lg font-semibold text-base-content/50">
                  No problems found
                </h3>
                <p className="text-base-content/40 text-sm">
                  Try a different search or be the first to add one!
                </p>
                <button
                  className="btn btn-primary btn-sm mt-4 gap-2"
                  onClick={() => setShowAddModal(true)}
                >
                  <PlusCircleIcon className="size-4" /> Add Problem
                </button>
              </div>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="card bg-base-100 hover:scale-[1.01] transition-transform shadow hover:shadow-md group"
              >
                <div className="card-body py-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT SIDE */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className={`size-11 rounded-lg flex items-center justify-center ${
                            problem.isCustom
                              ? "bg-secondary/10"
                              : "bg-primary/10"
                          }`}
                        >
                          {problem.isCustom ? (
                            <UserCircle2Icon className="size-5 text-secondary" />
                          ) : (
                            <Code2Icon className="size-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold">{problem.title}</h2>
                            <span
                              className={`badge badge-sm ${getDifficultyBadgeClass(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
                            {problem.isCustom && (
                              <span className="badge badge-sm badge-secondary gap-1">
                                <StarIcon className="size-2.5" /> Community
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-base-content/50">
                            {problem.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-base-content/70 line-clamp-2">
                        {problem.description?.text}
                      </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 shrink-0">
                      {problem.isCustom && (
                        <button
                          id={`delete-problem-${problem.id}`}
                          className="btn btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDelete(e, problem.id)}
                          title="Delete custom problem"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      )}
                      <div className="flex items-center gap-1 text-primary font-medium text-sm">
                        <span>Solve</span>
                        <ChevronRightIcon className="size-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal w-full">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">{easyCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{mediumCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{hardCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Community Added</div>
                <div className="stat-value text-secondary">{customCount}</div>
                <div className="stat-desc">
                  <button
                    className="link link-secondary text-xs"
                    onClick={() => setShowAddModal(true)}
                  >
                    + Add yours
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD PROBLEM MODAL */}
      <AddProblemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProblem={handleAddProblem}
      />
    </div>
  );
}

export default ProblemsPage;
