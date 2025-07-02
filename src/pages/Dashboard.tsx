import Navbar from "@/components/Navbar"
import TaskList from "@/components/TaskList"
import useAuth from "@/hooks/useAuth"
import useTasks from "@/hooks/useTasks"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { tasks, loading, editTask, removeTask } = useTasks()

  if (!user) return null // Optional: redirect or show spinner

  return (
    <>
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onEdit={editTask} onDelete={removeTask} />
        )}
      </main>
    </>
  )
}
