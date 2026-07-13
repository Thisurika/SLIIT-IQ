import { useEffect, useState } from "react";
import { BookOpenIcon, BrainIcon, FileTextIcon, MessageCircleMoreIcon, SparklesIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";

const tabs = [
  { key: "content", label: "Content", icon: FileTextIcon },
  { key: "chat", label: "AI Chat", icon: MessageCircleMoreIcon },
  { key: "actions", label: "AI Actions", icon: SparklesIcon },
  { key: "flashcards", label: "Flashcards", icon: BookOpenIcon },
  { key: "quizzes", label: "Quizzes", icon: BrainIcon },
];

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(1)} ${units[index]}`;
}

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState("");
  const [concept, setConcept] = useState("");
  const [conceptResult, setConceptResult] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  const selectedDocument = documents.find((doc) => doc._id === selectedDocumentId) || documents[0] || null;
  const previewUrl = (() => {
    if (!selectedDocument?.filePath) return "";
    const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");
    const normalizedPath = selectedDocument.filePath.startsWith("http")
      ? selectedDocument.filePath
      : selectedDocument.filePath.startsWith("/")
        ? selectedDocument.filePath
        : `/${selectedDocument.filePath}`;
    return `${apiBase}${normalizedPath}`;
  })();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/documents");
      setDocuments(data.documents || []);
      if (!selectedDocumentId && (data.documents || []).length) {
        setSelectedDocumentId(data.documents[0]._id);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not load documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const { data } = await axiosInstance.post("/documents", formData);
      setSelectedDocumentId(data.document._id);
      setSummary("");
      setConceptResult("");
      setFlashcards([]);
      setQuiz(null);
      setQuizResult(null);
      setChatMessages([]);
      await fetchDocuments();
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Upload error details:", error);
      const serverMessage = error?.response?.data?.message;
      const errorMessage = error?.message;
      toast.error(serverMessage || errorMessage || `Upload failed: ${String(error)}`);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/documents/${id}`);
      toast.success("Document removed");
      await fetchDocuments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleSummary = async () => {
    if (!selectedDocument) return;
    try {
      const { data } = await axiosInstance.post(`/documents/${selectedDocument._id}/summarize`);
      setSummary(data.summary || "");
      toast.success("Summary generated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not generate summary");
    }
  };

  const handleExplain = async () => {
    if (!selectedDocument || !concept.trim()) return;
    try {
      const { data } = await axiosInstance.post(`/documents/${selectedDocument._id}/explain`, { concept });
      setConceptResult(data.explanation || "");
      toast.success("Explanation ready");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not explain concept");
    }
  };

  const handleChat = async () => {
    if (!selectedDocument || !chatInput.trim()) return;
    const nextUserMessage = { role: "user", text: chatInput.trim() };
    setChatMessages((prev) => [...prev, nextUserMessage]);
    setChatInput("");
    setIsChatting(true);

    try {
      const { data } = await axiosInstance.post(`/documents/${selectedDocument._id}/chat`, { message: nextUserMessage.text });
      setChatMessages((prev) => [...prev, { role: "assistant", text: data.reply || "No reply generated" }]);
    } catch (error) {
      setChatMessages((prev) => [...prev, { role: "assistant", text: error?.response?.data?.message || "Something went wrong" }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleFlashcards = async () => {
    if (!selectedDocument) return;
    try {
      const { data } = await axiosInstance.post(`/documents/${selectedDocument._id}/flashcards`);
      setFlashcards(data.flashcardSet?.cards || []);
      toast.success("Flashcards generated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not create flashcards");
    }
  };

  const handleQuiz = async () => {
    if (!selectedDocument) return;
    try {
      const { data } = await axiosInstance.post(`/documents/${selectedDocument._id}/quizzes`);
      setQuiz(data.quiz);
      setSelectedAnswers([]);
      setQuizResult(null);
      toast.success("Quiz generated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not create quiz");
    }
  };

  const handleQuizSubmit = async () => {
    if (!selectedDocument || !quiz) return;
    try {
      const { data } = await axiosInstance.post(`/documents/${selectedDocument._id}/quizzes/${quiz._id}/attempt`, {
        answers: selectedAnswers,
      });
      setQuizResult({ score: data.score, totalQuestions: data.totalQuestions });
      toast.success("Quiz submitted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not submit quiz");
    }
  };

  return (
    <div className="page-shell min-h-screen text-slate-100">
      <Navbar />
      <div className="mx-auto px-4 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Documents</p>
                <h2 className="text-xl font-bold text-slate-50">Study Library</h2>
              </div>
              <label className="btn btn-primary btn-sm gap-2">
                <UploadIcon className="size-4" />
                <span>Upload</span>
                <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={onUpload} />
              </label>
            </div>

            <div className="mt-4 space-y-2">
              {isLoading ? (
                <div className="text-sm text-slate-400">Loading documents…</div>
              ) : documents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                  Upload your first PDF to start studying.
                </div>
              ) : (
                documents.map((document) => (
                  <button
                    key={document._id}
                    type="button"
                    onClick={() => {
                      setSelectedDocumentId(document._id);
                      setActiveTab("content");
                    }}
                    className={`w-full rounded-2xl border p-3 text-left transition-all ${selectedDocument?._id === document._id ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-slate-950/50"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-100">{document.title}</p>
                        <p className="text-xs text-slate-500">{formatBytes(document.fileSize)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(document._id);
                        }}
                        className="btn btn-ghost btn-xs text-error"
                        aria-label="Delete document"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            {selectedDocument ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Selected Document</p>
                    <h2 className="text-2xl font-black text-slate-50">{selectedDocument.title}</h2>
                  </div>
                  <div className="rounded-2xl bg-slate-950/70 px-3 py-2 text-sm text-slate-400">
                    {selectedDocument.fileName} • {formatBytes(selectedDocument.fileSize)}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`btn btn-sm gap-2 ${activeTab === tab.key ? "btn-primary" : "btn-ghost border-white/10 text-slate-300 hover:bg-white/5"}`}
                      >
                        <Icon className="size-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {activeTab === "content" && (
                  <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                      {previewUrl ? (
                        <iframe src={previewUrl} title={selectedDocument.title} className="h-[500px] w-full" />
                      ) : (
                        <div className="flex h-[500px] items-center justify-center bg-slate-950/60 text-sm text-slate-400">
                          No preview URL available for this document.
                        </div>
                      )}
                    </div>
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <h3 className="text-lg font-semibold text-slate-50">Document Details</h3>
                      <div className="space-y-2 text-sm text-slate-400">
                        <p><span className="font-semibold text-slate-200">File:</span> {selectedDocument.fileName}</p>
                        <p><span className="font-semibold text-slate-200">Size:</span> {formatBytes(selectedDocument.fileSize)}</p>
                        <p><span className="font-semibold text-slate-200">Uploaded:</span> {new Date(selectedDocument.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="divider divider-neutral" />
                      <div className="rounded-2xl bg-slate-900/80 p-3">
                        <p className="text-sm text-slate-400">Preview the PDF in the embedded viewer while using the AI tools to study it from the side.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="max-h-80 space-y-2 overflow-y-auto">
                        {chatMessages.length === 0 ? (
                          <p className="text-sm text-slate-400">Ask a question about this document and the assistant will answer from the extracted content.</p>
                        ) : (
                          chatMessages.map((message, index) => (
                            <div key={`${message.role}-${index}`} className={`rounded-2xl p-3 text-sm ${message.role === "user" ? "bg-cyan-400/10" : "bg-slate-900/80"}`}>
                              <p className="font-semibold uppercase tracking-[0.2em] text-cyan-300">{message.role}</p>
                              <p className="mt-1 whitespace-pre-wrap text-slate-200">{message.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask a question about the PDF"
                        className="input input-bordered flex-1 border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleChat()}
                      />
                      <button type="button" className="btn btn-primary" onClick={handleChat} disabled={isChatting}>
                        {isChatting ? "Thinking…" : "Send"}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "actions" && (
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <button type="button" className="btn btn-primary" onClick={handleSummary}>Generate Summary</button>
                      <div className="flex flex-1 gap-2">
                        <input
                          type="text"
                          placeholder="Explain a concept"
                          className="input input-bordered flex-1 border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                          value={concept}
                          onChange={(event) => setConcept(event.target.value)}
                        />
                        <button type="button" className="btn btn-secondary" onClick={handleExplain}>Explain</button>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <h3 className="font-semibold text-slate-50">Summary</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400">{summary || "Generate a summary to see the key takeaways here."}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <h3 className="font-semibold text-slate-50">Concept Explanation</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400">{conceptResult || "Search a term or idea from the document to get a quick explanation."}</p>
                    </div>
                  </div>
                )}

                {activeTab === "flashcards" && (
                  <div className="mt-6 space-y-4">
                    <button type="button" className="btn btn-primary" onClick={handleFlashcards}>Generate Flashcards</button>
                    {flashcards.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">No flashcards generated yet.</div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        {flashcards.map((card, index) => (
                          <div key={`${card.question}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-sm">
                            <p className="font-semibold text-slate-100">{card.question}</p>
                            <p className="mt-2 text-sm text-slate-400">{card.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "quizzes" && (
                  <div className="mt-6 space-y-4">
                    <button type="button" className="btn btn-primary" onClick={handleQuiz}>Generate Quiz</button>
                    {quiz ? (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                          <h3 className="font-semibold text-slate-50">{quiz.title}</h3>
                          {quiz.questions?.map((question, index) => (
                            <div key={`${question.question}-${index}`} className="mt-4 rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                              <p className="font-medium text-slate-100">{index + 1}. {question.question}</p>
                              <div className="mt-2 space-y-2">
                                {question.options?.map((option) => (
                                  <label key={option} className="flex items-center gap-2 text-sm text-slate-300">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      className="radio radio-sm"
                                      checked={selectedAnswers[index] === option}
                                      onChange={() => {
                                        const nextAnswers = [...selectedAnswers];
                                        nextAnswers[index] = option;
                                        setSelectedAnswers(nextAnswers);
                                      }}
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                              {quizResult && <p className="mt-2 text-sm text-emerald-300">Correct answer: {question.correctAnswer}</p>}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" className="btn btn-success" onClick={handleQuizSubmit}>Submit Quiz</button>
                          {quizResult && (
                            <div className="rounded-2xl bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
                              Score: {quizResult.score}/{quizResult.totalQuestions}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">Generate a quiz to test yourself on the document.</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                Upload a PDF to get started with the documents workspace.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;
