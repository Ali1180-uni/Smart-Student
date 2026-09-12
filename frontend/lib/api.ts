import type {
  ChatMessage,
  ChatReply,
  SleepEstimate,
  SleepRequest,
  Task,
  TaskCreate,
  TaskUpdate,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTasks: () => request<Task[]>("/api/tasks"),

  createTask: (payload: TaskCreate) =>
    request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(payload) }),

  updateTask: (id: number, payload: TaskUpdate) =>
    request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  deleteTask: (id: number) => request<void>(`/api/tasks/${id}`, { method: "DELETE" }),

  getMessages: () => request<ChatMessage[]>("/api/chat/messages"),

  sendMessage: (content: string) =>
    request<ChatReply>("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  estimateSleep: (payload: SleepRequest) =>
    request<SleepEstimate>("/api/sleep/estimate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};