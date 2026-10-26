import { GoogleGenAI } from "@google/genai";
import { buildAssistantPrompt } from "@/lib/content";

/**
 * CHATBOT BACKEND: browser → POST /api/chat → Gemini → reply.
 * The key is read from process.env on the server (set in Vercel's env vars),
 * so it never reaches the browser.
 */

type ChatMessage = { role: "user" | "bot"; text: string };

// Tried in order; if one is rate-limited (429) or busy, the next one is used.
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The chatbot is not configured." }, { status: 503 });
  }

  let history: ChatMessage[];
  try {
    const body = await request.json();
    history = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatMessage) => typeof m?.text === "string" && m.text.trim())
      .slice(-12)
      .map((m: ChatMessage) => ({ role: m.role === "bot" ? "bot" : "user", text: m.text.slice(0, 1000) }));
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return Response.json({ error: "Send a question first." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const contents = history.map((m) => ({
    role: m.role === "bot" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  for (const model of MODELS) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: buildAssistantPrompt(),
          temperature: 0.4,
          maxOutputTokens: 500,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      const reply = result.text?.trim();
      if (reply) return Response.json({ reply });
    } catch (error) {
      const status = (error as { status?: number }).status;
      console.error(`Gemini ${model} failed`, status ?? error);
      // Quota / overload / unknown model → try the next model; anything else → stop.
      if (status !== 429 && status !== 503 && status !== 404) break;
    }
  }

  return Response.json({ error: "The AI is unavailable right now." }, { status: 502 });
}
