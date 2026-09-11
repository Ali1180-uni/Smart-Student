"use client";

import Image from "next/image";
import { Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

type Message = {
  role: "ai" | "user";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "ai",
    content:
      "I see you have a Data Structures assignment next. Want me to review Big-O notation with you before you start?",
  },
];

export default function StudyChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();

    if (!content) {
      return;
    }

    setMessages((currentMessages) => [...currentMessages, { role: "user", content }]);
    setDraft("");
  }

  return (
    <section className="flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-2xl bg-zinc-900 p-5 text-zinc-100 sm:p-6" aria-labelledby="study-chat-title">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white" id="study-chat-title">Proactive guide</p>
            <p className="mt-0.5 text-xs text-zinc-400">Ready when you are</p>
          </div>
        </div>
        <Image
          src="https://stories.freepiklabs.com/storage/28383/Learning-01.svg"
          alt="Student studying at a desk"
          width={96}
          height={66}
          className="h-auto w-20 opacity-90"
        />
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-5" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "ai"
                  ? "rounded-tl-sm bg-zinc-100 text-zinc-700"
                  : "rounded-tr-sm bg-zinc-800 text-white"
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-0 flex shrink-0 gap-2 border-t border-white/10 pt-4">
        <label htmlFor="study-chat-input" className="sr-only">Message your study guide</label>
        <input
          id="study-chat-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask your study guide..."
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 transition-all focus:border-zinc-400 focus:bg-white/10"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-900 transition-all hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Send size={16} />
        </button>
      </form>
      <a
        href="https://storyset.com/illustration/learning/pana"
        target="_blank"
        rel="noreferrer"
        className="mt-3 shrink-0 text-center text-[11px] text-zinc-500 transition hover:text-zinc-300"
      >
        Illustration by Storyset
      </a>
    </section>
  );
}
