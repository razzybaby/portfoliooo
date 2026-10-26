"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquareText, SendHorizontal, X } from "lucide-react";
import { bot, starterQuestions } from "@/lib/content";

type Message = { role: "user" | "bot"; text: string; failed?: boolean };

const FALLBACK = "Sorry, I couldn't reach the AI right now. Please try again in a moment.";

export function DraftChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  /**
   * CHATBOT FRONTEND: send the whole conversation to our own /api/chat route.
   * Any failure (offline, missing key, quota) becomes a friendly message instead of a crash.
   */
  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => !m.failed) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.reply !== "string") throw new Error(data.error);
      setMessages([...next, { role: "bot", text: data.reply }]);
    } catch {
      setMessages([...next, { role: "bot", text: FALLBACK, failed: true }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : `Chat with ${bot.name}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-4 bottom-4 z-50 flex h-12 items-center gap-2 border border-accent bg-bg px-4 font-mono text-xs text-accent shadow-lg shadow-black/20 sm:right-6 sm:bottom-6"
      >
        {open ? <X size={16} /> : <MessageSquareText size={16} />}
        <span className="hidden sm:inline">{open ? "Close" : `Ask ${bot.name}`}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`${bot.name} chat`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-3 bottom-20 z-50 flex h-[min(34rem,calc(100svh-10rem))] flex-col border border-line bg-panel shadow-2xl shadow-black/30 sm:inset-x-auto sm:right-6 sm:bottom-22 sm:w-96"
          >
            <div className="blueprint-grid flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-mono text-sm font-semibold text-accent">{bot.name.toUpperCase()} · AI</p>
                <p className="text-xs text-muted">{bot.blurb}</p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" /> Gemini
              </span>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm text-muted">
                    Hi! I&apos;m {bot.name}. I can answer questions about Rudransh&apos;s projects, skills and
                    contact details. Try one:
                  </p>
                  <div className="mt-4 flex flex-col items-start gap-2">
                    {starterQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => ask(q)}
                        className="border border-line px-3 py-1.5 text-left font-mono text-xs transition-colors hover:border-accent hover:text-accent"
                      >
                        → {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <p
                    className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-accent text-bg"
                        : m.failed
                          ? "border border-mark/60 text-mark"
                          : "border border-line"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {busy && (
                <p className="font-mono text-xs text-muted">
                  drafting<span className="animate-pulse">…</span>
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex border-t border-line"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                aria-label="Your question"
                maxLength={500}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted sm:text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="px-4 text-accent disabled:opacity-40"
              >
                <SendHorizontal size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
