import { useState } from "react";
import Navbar from "@/components/Navbar";
import Board from "@/components/Board";
import AddTaskModal from "@/components/AddTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import StopwatchModal from "@/components/StopwatchModal";
import useAuth from "@/hooks/useAuth";
import useTasks from "@/hooks/useTasks";
import { toast } from "sonner";
import { type Task } from "@/components/TaskList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, loading, addTask, editTask, removeTask } = useTasks();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!user) return null;

  const handleAddTask = async (data: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate?: Date;
  }) => {
    try {
      await addTask(data);
      toast.success(`✅ "${data.title}" created!`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create task. Please try again.");
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updates: Partial<Task>) => {
    if (selectedTask) {
      const safeUpdates = {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
      };

      const nothingChanged =
        selectedTask.title === safeUpdates.title &&
        selectedTask.description === safeUpdates.description &&
        selectedTask.status === safeUpdates.status &&
        new Date(selectedTask.dueDate || "").toDateString() ===
          (safeUpdates.dueDate ? safeUpdates.dueDate.toDateString() : "");

      if (nothingChanged) {
        toast.info("⚡ No changes detected. Nothing updated.");
        setEditOpen(false);
        setSelectedTask(null);
        return;
      }

      try {
        const updatedTask = await editTask(selectedTask._id, safeUpdates);
        toast.success(`✏️ "${updatedTask.title}" updated!`);
        setEditOpen(false);
        setSelectedTask(null);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to update task. Please try again.");
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await removeTask(taskId);
      toast.success("🗑️ Task deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete task. Please try again.");
    }
  };

  return (
    <>
      <Navbar user={user} logout={logout} />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {user.name}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <AddTaskModal onAddTask={handleAddTask} />
            <StopwatchModal />
          </div>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <Board
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onStatusChange={async (taskId, newStatus) => {
              try {
                await editTask(taskId, { status: newStatus });
                toast.success(`✅ Task status updated to ${newStatus}`);
              } catch (err) {
                console.error(err);
                toast.error(
                  "❌ Failed to update task status. Please try again."
                );
              }
            }}
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
  );
}
