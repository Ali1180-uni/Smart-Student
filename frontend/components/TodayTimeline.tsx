"use client";

import { BookOpen, CheckCircle2, Circle, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Task, TaskType } from "../lib/types";

export default function TodayTimeline() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<TaskType>("assignment");

  useEffect(() => {
    let cancelled = false;
    api
      .getTasks()
      .then((tasks) => {
        if (!cancelled) setItems(tasks);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load tasks. Is the backend running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleAssignment(id: number) {
    const item = items.find((candidate) => candidate.id === id);
    if (!item || item.type !== "assignment" || pendingIds.has(id)) return;

    setPendingIds((current) => new Set(current).add(id));
    try {
      const updated = await api.updateTask(id, { completed: !item.completed });
      setItems((currentItems) =>
        currentItems.map((candidate) => (candidate.id === id ? updated : candidate)),
      );
    } catch {
      setError("Couldn't update the task.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  async function deleteItem(id: number) {
    if (pendingIds.has(id)) return;

    setPendingIds((current) => new Set(current).add(id));
    try {
      await api.deleteTask(id);
      setItems((currentItems) => currentItems.filter((candidate) => candidate.id !== id));
    } catch {
      setError("Couldn't delete the task.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanTime = time.trim();

    if (!cleanTitle || !cleanTime) {
      return;
    }

    try {
      const created = await api.createTask({ title: cleanTitle, type, time: cleanTime });
      setItems((currentItems) => [...currentItems, created]);
      setTitle("");
      setTime("");
      setType("assignment");
      setIsAdding(false);
      setError(null);
    } catch {
      setError("Couldn't save the task.");
    }
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

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 underline decoration-rose-300 underline-offset-2 hover:text-rose-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="mb-4 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_160px_140px_auto] sm:items-end"
        >
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
              onChange={(event) => setType(event.target.value as TaskType)}
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

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-[72px] animate-pulse rounded-xl border border-zinc-200 bg-zinc-50"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
          No tasks yet. Add your first one above.
        </p>
      ) : (
        items.map((item) => {
          const Icon = item.type === "class" ? BookOpen : CheckCircle2;
          const isAssignment = item.type === "assignment";
          const isPending = pendingIds.has(item.id);

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
                  disabled={isPending}
                  className="shrink-0 rounded-full text-zinc-400 transition-all hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-50"
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
                disabled={isPending}
                className="shrink-0 rounded-lg p-2 text-zinc-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-30 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}