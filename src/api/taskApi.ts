import axiosInstance from "./axios";

export interface TaskPayload {
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  dueDate?: Date;
}

export const getTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data;
};

export const createTask = async (data: TaskPayload) => {
  const res = await axiosInstance.post("/tasks", data);
  return res.data;
};

export const updateTask = async (taskId: string, data: Partial<TaskPayload>) => {
  const res = await axiosInstance.put(`/tasks/${taskId}`, data);
  return res.data;
};

export const deleteTask = async (taskId: string) => {
  const res = await axiosInstance.delete(`/tasks/${taskId}`);
  return res.data;
};

export const breakdownTask = async (taskId: string) => {
  const res = await axiosInstance.post(`/tasks/${taskId}/breakdown`);
  return res.data.subTasks as string[];
};
