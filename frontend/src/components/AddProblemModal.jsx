import { useState } from "react";
import {
  XIcon,
  PlusIcon,
  Trash2Icon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircle2Icon,
  Code2Icon,
  BookOpenIcon,
  FlaskConicalIcon,
  TerminalIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const STEPS = [
  { id: 1, label: "Basic Info", icon: BookOpenIcon },
  { id: 2, label: "Description", icon: Code2Icon },
  { id: 3, label: "Examples", icon: FlaskConicalIcon },
  { id: 4, label: "Starter Code", icon: TerminalIcon },
];

const CATEGORIES = [
  "Array • Hash Table",
  "String • Two Pointers",
  "Linked List",
  "Tree • Graph",
  "Dynamic Programming",
  "Stack • Queue",
  "Binary Search",
  "Sorting",
  "Math",
  "Greedy",
  "Backtracking",
  "Other",
];

const defaultForm = {
  title: "",
  difficulty: "Easy",
  category: "Array • Hash Table",
  description: {
    text: "",
    notes: [""],
  },
  examples: [{ input: "", output: "", explanation: "" }],
  constraints: [""],
  starterCode: {
    javascript: `function solution() {\n  // Write your solution here\n  \n}\n\n// Add your test cases below\nconsole.log(solution());`,
    python: `def solution():\n    # Write your solution here\n    pass\n\n# Add your test cases below\nprint(solution())`,
    java: `class Solution {\n    public static void solution() {\n        // Write your solution here\n        \n    }\n    \n    public static void main(String[] args) {\n        solution();\n    }\n}`,
  },
  expectedOutput: {
    javascript: "",
    python: "",
    java: "",
  },
};

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isDone = step.id < currentStep;
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-105"
                  : isDone
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-base-200 text-base-content/40"
              }`}
            >
              {isDone ? (
                <CheckCircle2Icon className="size-3.5" />
              ) : (
                <Icon className="size-3.5" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px w-8 transition-colors duration-300 ${
                  isDone ? "bg-success/40" : "bg-base-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({ form, setForm }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="label">
          <span className="label-text font-semibold">Problem Title</span>
          <span className="label-text-alt text-error">*</span>
        </label>
        <input
          className="input input-bordered w-full"
          placeholder="e.g. Longest Common Subsequence"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Difficulty</span>
            <span className="label-text-alt text-error">*</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.difficulty}
            onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
          >
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Category</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function Step2({ form, setForm }) {
  const updateNote = (i, val) => {
    const notes = [...form.description.notes];
    notes[i] = val;
    setForm((f) => ({ ...f, description: { ...f.description, notes } }));
  };

  const addNote = () =>
    setForm((f) => ({
      ...f,
      description: { ...f.description, notes: [...f.description.notes, ""] },
    }));

  const removeNote = (i) => {
    const notes = form.description.notes.filter((_, idx) => idx !== i);
    setForm((f) => ({ ...f, description: { ...f.description, notes } }));
  };

  const updateConstraint = (i, val) => {
    const constraints = [...form.constraints];
    constraints[i] = val;
    setForm((f) => ({ ...f, constraints }));
  };

  const addConstraint = () =>
    setForm((f) => ({ ...f, constraints: [...f.constraints, ""] }));

  const removeConstraint = (i) =>
    setForm((f) => ({ ...f, constraints: f.constraints.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-5">
      <div>
        <label className="label">
          <span className="label-text font-semibold">Problem Description</span>
          <span className="label-text-alt text-error">*</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-28 resize-none"
          placeholder="Describe the problem clearly..."
          value={form.description.text}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              description: { ...f.description, text: e.target.value },
            }))
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label-text font-semibold">Additional Notes</label>
          <button
            type="button"
            className="btn btn-xs btn-ghost gap-1 text-primary"
            onClick={addNote}
          >
            <PlusIcon className="size-3" /> Add Note
          </button>
        </div>
        <div className="space-y-2">
          {form.description.notes.map((note, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input input-bordered input-sm flex-1"
                placeholder={`Note ${i + 1}`}
                value={note}
                onChange={(e) => updateNote(i, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-sm btn-ghost text-error"
                onClick={() => removeNote(i)}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label-text font-semibold">Constraints</label>
          <button
            type="button"
            className="btn btn-xs btn-ghost gap-1 text-primary"
            onClick={addConstraint}
          >
            <PlusIcon className="size-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.constraints.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input input-bordered input-sm flex-1 font-mono"
                placeholder={`e.g. 1 ≤ n ≤ 10⁵`}
                value={c}
                onChange={(e) => updateConstraint(i, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-sm btn-ghost text-error"
                onClick={() => removeConstraint(i)}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ form, setForm }) {
  const updateExample = (i, field, val) => {
    const examples = [...form.examples];
    examples[i] = { ...examples[i], [field]: val };
    setForm((f) => ({ ...f, examples }));
  };

  const addExample = () =>
    setForm((f) => ({
      ...f,
      examples: [...f.examples, { input: "", output: "", explanation: "" }],
    }));

  const removeExample = (i) =>
    setForm((f) => ({ ...f, examples: f.examples.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      {form.examples.map((ex, i) => (
        <div key={i} className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Example {i + 1}</span>
              {form.examples.length > 1 && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost text-error"
                  onClick={() => removeExample(i)}
                >
                  <Trash2Icon className="size-3.5" /> Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text text-xs font-medium">Input</label>
                <input
                  className="input input-bordered input-sm w-full font-mono mt-1"
                  placeholder="e.g. nums = [2,7,11,15], target = 9"
                  value={ex.input}
                  onChange={(e) => updateExample(i, "input", e.target.value)}
                />
              </div>
              <div>
                <label className="label-text text-xs font-medium">Output</label>
                <input
                  className="input input-bordered input-sm w-full font-mono mt-1"
                  placeholder="e.g. [0,1]"
                  value={ex.output}
                  onChange={(e) => updateExample(i, "output", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label-text text-xs font-medium">
                Explanation (optional)
              </label>
              <input
                className="input input-bordered input-sm w-full mt-1"
                placeholder="Brief explanation..."
                value={ex.explanation}
                onChange={(e) => updateExample(i, "explanation", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline btn-sm gap-2 w-full"
        onClick={addExample}
      >
        <PlusIcon className="size-4" /> Add Another Example
      </button>
    </div>
  );
}

function Step4({ form, setForm }) {
  const [activeTab, setActiveTab] = useState("javascript");

  const updateCode = (lang, val) =>
    setForm((f) => ({
      ...f,
      starterCode: { ...f.starterCode, [lang]: val },
    }));

  const updateExpected = (lang, val) =>
    setForm((f) => ({
      ...f,
      expectedOutput: { ...f.expectedOutput, [lang]: val },
    }));

  const tabs = [
    { key: "javascript", label: "JavaScript", color: "text-yellow-400" },
    { key: "python", label: "Python", color: "text-blue-400" },
    { key: "java", label: "Java", color: "text-orange-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="tabs tabs-boxed">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`tab gap-1.5 ${activeTab === t.key ? "tab-active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span className={t.color}>●</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="label">
            <span className="label-text font-semibold">
              Starter Code ({activeTab})
            </span>
            <span className="label-text-alt text-base-content/50">
              Include test cases in the code
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-40 font-mono text-sm resize-none"
            value={form.starterCode[activeTab]}
            onChange={(e) => updateCode(activeTab, e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">
              Expected Output ({activeTab})
            </span>
            <span className="label-text-alt text-base-content/50">
              Used for test validation
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-20 font-mono text-sm resize-none"
            placeholder={`Expected console output for ${activeTab}...`}
            value={form.expectedOutput[activeTab]}
            onChange={(e) => updateExpected(activeTab, e.target.value)}
          />
        </div>
      </div>

      <div className="alert alert-info text-sm">
        <Code2Icon className="size-4 shrink-0" />
        <span>
          Write complete code with test cases. The expected output will be used to
          validate user solutions.
        </span>
      </div>
    </div>
  );
}

function AddProblemModal({ isOpen, onClose, onAddProblem }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setForm(defaultForm);
    onClose();
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.title.trim()) {
        toast.error("Problem title is required");
        return false;
      }
    }
    if (step === 2) {
      if (!form.description.text.trim()) {
        toast.error("Problem description is required");
        return false;
      }
    }
    if (step === 3) {
      const hasEmpty = form.examples.some((e) => !e.input.trim() || !e.output.trim());
      if (hasEmpty) {
        toast.error("All examples must have input and output");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400)); // small UX delay
    const id = onAddProblem(form);
    setIsSubmitting(false);
    toast.success("🎉 Problem added successfully!");
    handleClose();
    return id;
  };

  const stepComponents = { 1: Step1, 2: Step2, 3: Step3, 4: Step4 };
  const CurrentStep = stepComponents[step];

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          onClick={handleClose}
        >
          <XIcon className="size-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <PlusIcon className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-2xl">Add New Problem</h3>
              <p className="text-sm text-base-content/50">
                Contribute a problem to the community
              </p>
            </div>
          </div>
        </div>

        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="min-h-[280px]">
          <CurrentStep form={form} setForm={setForm} />
        </div>

        {/* Navigation */}
        <div className="modal-action mt-6 border-t border-base-200 pt-4">
          <button className="btn btn-ghost" onClick={handleClose}>
            Cancel
          </button>

          <div className="flex gap-2 ml-auto">
            {step > 1 && (
              <button className="btn btn-outline gap-2" onClick={handleBack}>
                <ChevronLeftIcon className="size-4" /> Back
              </button>
            )}

            {step < STEPS.length ? (
              <button className="btn btn-primary gap-2" onClick={handleNext}>
                Next <ChevronRightIcon className="size-4" />
              </button>
            ) : (
              <button
                className="btn btn-success gap-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <CheckCircle2Icon className="size-4" />
                )}
                {isSubmitting ? "Adding..." : "Add Problem"}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose} />
    </div>
  );
}

export default AddProblemModal;
