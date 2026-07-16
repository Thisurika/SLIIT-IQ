import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { ENV } from "../lib/env.js";
import Document from "../models/Document.js";
import FlashcardSet from "../models/FlashcardSet.js";
import Quiz from "../models/Quiz.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/octet-stream" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

export const handleUploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }

    if (error) {
      return res.status(400).json({ message: error.message || "Upload failed" });
    }

    next();
  });
};

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-pro-latest",
];

const getMockResponse = (prompt) => {
  const p = prompt.toLowerCase();
  if (p.includes("flashcard")) {
    return JSON.stringify({ title: "Demo Flashcards", cards: [
      { question: "What is this document about?", answer: "PDF text was extracted but the Gemini API key is currently out of quota. Add an active key in backend/.env to enable real AI responses." }
    ]});
  }
  if (p.includes("quiz") || p.includes("multiple-choice")) {
    return JSON.stringify({ title: "Demo Quiz", questions: [
      { question: "Why is this a demo quiz?", options: ["Gemini quota exceeded","No API key set","Development fallback","All of the above"], correctAnswer: "All of the above", explanation: "The Gemini API key is restricted or out of quota." }
    ]});
  }
  if (p.includes("summar")) {
    return "**Demo Summary**: The Gemini API key is out of quota. The PDF was successfully uploaded and its text was extracted, but AI summarization requires an active Gemini API key with available quota. Please update `GEMINI_API_KEY` in `backend/.env`.";
  }
  if (p.includes("explain")) {
    return "**Demo Explanation**: AI explanations require an active Gemini API key. The PDF content was extracted successfully. Please update your API key.";
  }
  const question = prompt.split("User question:")[1]?.trim() || "your question";
  return `**Demo response** to: "${question}"\n\nThe document was uploaded and its text extracted successfully. However, the Gemini API is currently unavailable (quota exceeded or key restricted).\n\nPlease obtain an active API key from [Google AI Studio](https://aistudio.google.com/) and update \`GEMINI_API_KEY\` in \`backend/.env\`.`;
};

const callGemini = async (prompt) => {
  if (!ENV.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  let lastError = null;
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`[Gemini] model ${modelName} failed:`, err.message?.slice(0, 120));
      lastError = err;
    }
  }
  // All models failed — if quota/auth issue and in dev mode, return mock
  const isQuota = lastError?.message?.includes("429") || lastError?.message?.includes("quota");
  const isAuth = lastError?.message?.includes("403") || lastError?.message?.includes("Forbidden") || lastError?.message?.includes("denied");
  if ((isQuota || isAuth) && ENV.NODE_ENV === "development") {
    console.warn("[Gemini] All models failed. Returning demo mock response.");
    return getMockResponse(prompt);
  }
  throw lastError || new Error("All Gemini model requests failed.");
};

const getGeminiModel = () => ({
  generateContent: async (prompt) => ({ response: { text: () => callGemini(prompt) } }),
});

const safeJsonParse = (text) => {
  if (!text) return null;

  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }

    return null;
  }
};

const buildContext = (textContents) => `${textContents}`.slice(0, 15000);

const getErrorMessage = (error) => {
  const detail = error?.message || "AI request failed";

  if (detail.includes("429") || detail.includes("quota") || detail.includes("Too Many Requests")) {
    return "The Gemini API quota has been exceeded. Please try again shortly or use a paid plan.";
  }

  if (detail.includes("404") || detail.includes("not found")) {
    return "The selected Gemini model is unavailable. Please try again later.";
  }

  return detail;
};

export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    let textContents = "";
    try {
      const parser = new PDFParse({ data: fileBuffer });
      const extractedPdf = await parser.getText();
      textContents = extractedPdf?.text || "";
      await parser.destroy();
    } catch (pdfErr) {
      console.warn("PDF text extraction warning (non-fatal):", pdfErr.message);
    }

    const document = await Document.create({
      title: req.body.title || path.parse(req.file.originalname).name,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      textContents,
      owner: req.user._id,
    });

    res.status(201).json({ document });
  } catch (error) {
    console.error("Error in uploadDocument controller:", error.message);
    res.status(500).json({ message: error.message || "Failed to upload document" });
  }
}

export async function getDocuments(req, res) {
  try {
    const documents = await Document.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ documents });
  } catch (error) {
    console.error("Error in getDocuments controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteDocument(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, owner: req.user._id });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const absolutePath = path.join(uploadsDir, path.basename(document.filePath));
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await FlashcardSet.deleteMany({ document: document._id, owner: req.user._id });
    await Quiz.deleteMany({ document: document._id, owner: req.user._id });
    await Document.deleteOne({ _id: document._id });

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDocument controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function chatOnDocument(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "A message is required" });
    }

    const document = await Document.findOne({ _id: id, owner: req.user._id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const model = getGeminiModel();
    const prompt = `You are a helpful study assistant. Answer the following question using the provided document text. If the answer is not present, say that clearly.\n\nDocument text:\n${buildContext(document.textContents)}\n\nUser question:\n${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in chatOnDocument controller:", error);
    const message = getErrorMessage(error);
    res.status(500).json({ message });
  }
}

export async function summarizeDocument(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, owner: req.user._id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const model = getGeminiModel();
    const prompt = `Create a concise study summary of the document below. Highlight the most important concepts and key takeaways in bullet points.\n\nDocument text:\n${buildContext(document.textContents)}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in summarizeDocument controller:", error);
    const message = getErrorMessage(error);
    res.status(500).json({ message });
  }
}

export async function explainConcept(req, res) {
  try {
    const { id } = req.params;
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({ message: "Concept is required" });
    }

    const document = await Document.findOne({ _id: id, owner: req.user._id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const model = getGeminiModel();
    const prompt = `Explain the following concept from the document in beginner-friendly language. Keep it short and practical.\n\nConcept: ${concept}\n\nDocument text:\n${buildContext(document.textContents)}`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.status(200).json({ explanation });
  } catch (error) {
    console.error("Error in explainConcept controller:", error);
    const message = getErrorMessage(error);
    res.status(500).json({ message });
  }
}

export async function generateFlashcards(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, owner: req.user._id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const existingSet = await FlashcardSet.findOne({ document: document._id, owner: req.user._id }).sort({ createdAt: -1 });
    if (existingSet) {
      return res.status(200).json({ flashcardSet: existingSet });
    }

    const model = getGeminiModel();
    const prompt = `Create flashcards for the document below. Return valid JSON with this shape: {"title":"string","cards":[{"question":"string","answer":"string"}]}. Only return JSON.\n\nDocument text:\n${buildContext(document.textContents)}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());
    const fallbackCards = parsed?.cards || [];
    const flashcardSet = await FlashcardSet.create({
      title: parsed?.title || `${document.title} Flashcards`,
      document: document._id,
      owner: req.user._id,
      cards: fallbackCards.slice(0, 8),
    });

    res.status(200).json({ flashcardSet });
  } catch (error) {
    console.error("Error in generateFlashcards controller:", error);
    const message = getErrorMessage(error);
    res.status(500).json({ message });
  }
}

export async function generateQuiz(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, owner: req.user._id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const existingQuiz = await Quiz.findOne({ document: document._id, owner: req.user._id }).sort({ createdAt: -1 });
    if (existingQuiz) {
      return res.status(200).json({ quiz: existingQuiz });
    }

    const model = getGeminiModel();
    const prompt = `Create a multiple-choice quiz for the document below. Return valid JSON with this shape: {"title":"string","questions":[{"question":"string","options":["string","string","string","string"],"correctAnswer":"string","explanation":"string"}]}. Only return JSON.\n\nDocument text:\n${buildContext(document.textContents)}`;

    const result = await model.generateContent(prompt);
    const parsed = safeJsonParse(result.response.text());
    const questions = Array.isArray(parsed?.questions) ? parsed.questions.slice(0, 5) : [];
    const quiz = await Quiz.create({
      title: parsed?.title || `${document.title} Quiz`,
      document: document._id,
      owner: req.user._id,
      questions,
    });

    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error in generateQuiz controller:", error);
    const message = getErrorMessage(error);
    res.status(500).json({ message });
  }
}

export async function submitQuizAttempt(req, res) {
  try {
    const { id, quizId } = req.params;
    const { answers } = req.body;

    const document = await Document.findOne({ _id: id, owner: req.user._id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const quiz = await Quiz.findOne({ _id: quizId, document: document._id, owner: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const normalizedAnswers = Array.isArray(answers) ? answers : [];
    const score = quiz.questions.reduce((total, question, index) => {
      return total + (normalizedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    quiz.attempts.push({
      score,
      totalQuestions: quiz.questions.length,
      answers: normalizedAnswers,
      createdAt: new Date(),
    });
    await quiz.save();

    res.status(200).json({ quiz, score, totalQuestions: quiz.questions.length });
  } catch (error) {
    console.error("Error in submitQuizAttempt controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
