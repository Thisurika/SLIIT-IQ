import { useState, useEffect, useCallback } from "react";
import { PROBLEMS } from "../data/problems";

const STORAGE_KEY = "talent_iq_custom_problems";

function loadCustomProblems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCustomProblems(problems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

export function useProblems() {
  const [customProblems, setCustomProblems] = useState(loadCustomProblems);

  // Merge static + custom problems (custom problems override if same id)
  const allProblems = { ...PROBLEMS, ...customProblems };

  const addProblem = useCallback((problemData) => {
    const id = problemData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueId = customProblems[id]
      ? `${id}-${Date.now()}`
      : id;

    const newProblem = {
      ...problemData,
      id: uniqueId,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    setCustomProblems((prev) => {
      const updated = { ...prev, [uniqueId]: newProblem };
      saveCustomProblems(updated);
      return updated;
    });

    return uniqueId;
  }, [customProblems]);

  const deleteProblem = useCallback((id) => {
    setCustomProblems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      saveCustomProblems(updated);
      return updated;
    });
  }, []);

  return { allProblems, customProblems, addProblem, deleteProblem };
}
