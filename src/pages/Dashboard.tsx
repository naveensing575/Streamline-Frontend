import { useState } from "react"
import Navbar from "@/components/Navbar"
import TaskList, { type Task } from "@/components/TaskList"
import AddTaskModal from "@/components/AddTaskModal"
import EditTaskModal from "@/components/EditTaskModal" // ✅ Make sure you import it!
import useAuth from "@/hooks/useAuth"
import useTasks from "@/hooks/useTasks"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { tasks, loading, addTask, editTask, removeTask } = useTasks()
  const [editOpen, setEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  if (!user) return null

  const handleAddTask = async (data: {
    title: string
    description?: string
    status: "todo" | "in-progress" | "done"
    dueDate?: Date
  }) => {
    await addTask(data)
  }

  const handleEdit = (task: Task) => {
    console.log("handleEdit called:", task)
    setSelectedTask(task)
    setEditOpen(true)
  }

  const handleSaveEdit = async (updates: Partial<Task>) => {
    if (selectedTask) {
      const safeUpdates = {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
      }
      await editTask(selectedTask._id, safeUpdates)
      setEditOpen(false)
      setSelectedTask(null)
    }
  }

  return (
    <>
      <Navbar user={user} logout={logout} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <AddTaskModal onAddTask={handleAddTask} />
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onEdit={handleEdit} onDelete={removeTask} />
        )}
        {selectedTask && (
          <EditTaskModal
            open={editOpen}
            setOpen={setEditOpen}
            task={selectedTask}
            onSave={handleSaveEdit}
          />
        )}
      </main>
    </>
  )
}
