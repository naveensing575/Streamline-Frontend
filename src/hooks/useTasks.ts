import { useState, useEffect } from "react"
import { getTasks, createTask, updateTask, deleteTask } from "@/api/taskApi"
import type { TaskPayload } from "@/api/taskApi"
import type { Task } from "@/components/TaskList"

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchTasks = async () => {
    setLoading(true)
    const data = await getTasks()
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (taskData: TaskPayload) => {
    const newTask = await createTask(taskData)
    setTasks((prev) => [...prev, newTask])
  }

  const editTask = async (taskId: string, updates: Partial<TaskPayload>) => {
    const updated = await updateTask(taskId, updates)
    setTasks((prev) =>
      prev.map((task) => (task._id === taskId ? updated : task))
    )
  }

  const removeTask = async (taskId: string) => {
    await deleteTask(taskId)
    setTasks((prev) => prev.filter((task) => task._id !== taskId))
  }

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
  }
}
