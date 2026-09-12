export type TaskType = "class" | "assignment";

export type Task = {
  id: number;
  title: string;
  type: TaskType;
  time: string;
  completed: boolean;
  position: number;
  created_at: string;
};

export type TaskCreate = {
  title: string;
  type: TaskType;
  time: string;
  completed?: boolean;
};

export type TaskUpdate = Partial<Omit<TaskCreate, "completed">> & { completed?: boolean };

export type ChatMessage = {
  id: number;
  role: "ai" | "user";
  content: string;
  created_at: string;
};

export type ChatReply = {
  user_message: ChatMessage;
  ai_message: ChatMessage;
};

export type SleepRequest = {
  hours_to_wake_time: number;
  estimated_workload_hours: number;
};

export type SleepStatus = "healthy" | "watch" | "alert";

export type SleepEstimate = {
  estimated_sleep: number;
  status: SleepStatus;
};