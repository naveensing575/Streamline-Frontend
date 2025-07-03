import { useState } from "react"
import Navbar from "@/components/Navbar"
import TaskList, { type Task } from "@/components/TaskList"
import AddTaskModal from "@/components/AddTaskModal"
import EditTaskModal from "@/components/EditTaskModal"
import useAuth from "@/hooks/useAuth"
import useTasks from "@/hooks/useTasks"
import { toast } from "sonner"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { tasks, loading, addTask, editTask, removeTask } = useTasks()

  const [editOpen, setEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  if (!user) return null

  // ADD TASK
  const handleAddTask = async (data: {
    title: string
    description?: string
    status: "todo" | "in-progress" | "done"
    dueDate?: Date
  }) => {
    try {
      await addTask(data)
      toast.success(`✅ "${data.title}" created!`)
    } catch (err) {
      console.error(err)
      toast.error("❌ Failed to create task. Please try again.")
    }
  }

  // OPEN EDIT MODAL
  const handleEdit = (task: Task) => {
    console.log("Editing task:", task)
    setSelectedTask(task)
    setEditOpen(true)
  }

  // SAVE EDIT
  const handleSaveEdit = async (updates: Partial<Task>) => {
    if (selectedTask) {
      try {
        const safeUpdates = {
          ...updates,
          dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
        }
        await editTask(selectedTask._id, safeUpdates)
        toast.success(`✏️ "${updates.title}" updated!`)
        setEditOpen(false)
        setSelectedTask(null)
      } catch (err) {
        console.error(err)
        toast.error("❌ Failed to update task. Please try again.")
      }
    }
  }

  // DELETE TASK
  const handleDeleteTask = async (taskId: string) => {
    try {
      await removeTask(taskId)
      toast.success("🗑️ Task deleted successfully!")
    } catch (err) {
      console.error(err)
      toast.error("❌ Failed to delete task. Please try again.")
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
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
          />
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
