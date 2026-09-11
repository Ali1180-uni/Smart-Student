"use client";

import { BookOpen, CheckCircle2, Circle, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

export type TimelineItem = {
  id: number;
  title: string;
  type: "class" | "assignment";
  time: string;
  completed: boolean;
};

const initialItems: TimelineItem[] = [
  {
    id: 1,
    title: "Calculus II lecture",
    type: "class",
    time: "10:00 AM",
    completed: false,
  },
  {
    id: 2,
    title: "Read chapter 4 of The Great Gatsby",
    type: "assignment",
    time: "Due 11:59 PM",
    completed: false,
  },
  {
    id: 3,
    title: "Physics lab: motion and force",
    type: "class",
    time: "2:00 PM",
    completed: false,
  },
  {
    id: 4,
    title: "Submit history essay outline",
    type: "assignment",
    time: "Due Friday",
    completed: true,
  },
];

export default function TodayTimeline() {
  const [items, setItems] = useState(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<TimelineItem["type"]>("assignment");

  function toggleAssignment(id: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.type === "assignment"
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );
  }

  function deleteItem(id: number) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanTime = time.trim();

    if (!cleanTitle || !cleanTime) {
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now(),
        title: cleanTitle,
        type,
        time: cleanTime,
        completed: false,
      },
    ]);
    setTitle("");
    setTime("");
    setType("assignment");
    setIsAdding(false);
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">A simple view of what needs your attention.</p>
        <button
          type="button"
          onClick={() => setIsAdding((current) => !current)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? "Cancel" : "Add task"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_160px_140px_auto] sm:items-end">
          <label className="text-xs font-medium text-zinc-500">
            Task title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Review lecture notes"
              className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-500"
              autoFocus
            />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            When
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              placeholder="e.g. Due 5 PM"
              className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-500"
            />
          </label>
          <label className="text-xs font-medium text-zinc-500">
            Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value as TimelineItem["type"])}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-500"
            >
              <option value="assignment">Assignment</option>
              <option value="class">Class</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Save task
          </button>
        </form>
      )}

      {items.map((item) => {
        const Icon = item.type === "class" ? BookOpen : CheckCircle2;
        const isAssignment = item.type === "assignment";

        return (
          <div
            key={item.id}
            className="group mb-3 flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md last:mb-0"
          >
            {isAssignment ? (
              <button
                type="button"
                aria-label={`${item.completed ? "Mark incomplete" : "Mark complete"}: ${item.title}`}
                aria-pressed={item.completed}
                onClick={() => toggleAssignment(item.id)}
                className="shrink-0 rounded-full text-zinc-400 transition-all hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                {item.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
            ) : (
              <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center text-zinc-500">
                <Icon size={20} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3
                  className={`text-sm font-semibold ${item.completed ? "text-zinc-400 line-through" : "text-zinc-900"}`}
                >
                  {item.title}
                </h3>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                  {item.type}
                </span>
              </div>
              <p className={`mt-1 text-xs ${item.completed ? "text-zinc-400" : "text-zinc-500"}`}>
                {item.time}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Delete ${item.title}`}
              onClick={() => deleteItem(item.id)}
              className="shrink-0 rounded-lg p-2 text-zinc-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
