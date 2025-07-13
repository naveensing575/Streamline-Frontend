import { useOutletContext } from "react-router-dom";
import KanbanBoard from "@/components/Kanban/KanbanBoard";
import TimelineBoard from "@/components/Timeline/TimelineBoard";
import AddTaskTrigger from "@/components/Tasks/AddTaskTrigger";
import StopwatchModal from "@/components/StopwatchModal";
import EditTaskTrigger from "@/components/Tasks/EditTaskTrigger";
import Navbar from "@/components/Navbar";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useGetMeQuery } from "@/features/useAuth";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useBreakdownTaskMutation,
} from "@/features/useTasks";

import { toast } from "sonner";
import { useState } from "react";
import { type Task } from "@/components/Tasks/TaskList";

export default function Dashboard() {
  const { data: user } = useGetMeQuery();
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [editTask] = useEditTaskMutation();
  const [removeTask] = useDeleteTaskMutation();
  const [breakdownTask] = useBreakdownTaskMutation();

  const { boardType, setBoardType } = useOutletContext<{
    boardType: "kanban" | "timeline";
    setBoardType: (type: "kanban" | "timeline") => void;
  }>();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  if (!user) return null;

  const handleAddTask = async (data: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate?: Date;
  }) => {
    try {
      await addTask(data).unwrap();
      toast.success(`"${data.title}" created!`);
    } catch {
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleSaveEdit = async (updates: Partial<Task>) => {
    if (selectedTask) {
      try {
        await editTask({ id: selectedTask._id, updates }).unwrap();
        toast.success(`"${updates.title}" updated!`);
      } catch {
        toast.error("Failed to update task.");
      }
      setSelectedTask(null);
    }
  };

  const handleRequestDelete = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!taskIdToDelete) return;
    try {
      await removeTask(taskIdToDelete).unwrap();
      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Failed to delete task.");
    } finally {
      setDeleteConfirmOpen(false);
      setTaskIdToDelete(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Tabs and Navbar in one row */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setBoardType("timeline")}
            className={`px-4 py-2 rounded-full cursor-pointer ${
              boardType === "timeline" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Timeline Board
          </button>
          <button
            onClick={() => setBoardType("kanban")}
            className={`px-4 py-2 rounded-full cursor-pointer ${
              boardType === "kanban" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Kanban Board
          </button>
        </div>

        <Navbar
          user={user}
          logout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />
      </div>

      {/* Kanban-specific header actions */}
      {boardType === "kanban" && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {user.name}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <AddTaskTrigger onAddTask={handleAddTask} />
            <StopwatchModal />
          </div>
        </div>
      )}

      {/* Board content */}
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : boardType === "kanban" ? (
        <KanbanBoard
          tasks={tasks || []}
          onEdit={(task) => setSelectedTask(task)}
          onRequestDelete={handleRequestDelete}
          onStatusChange={async (taskId, newStatus) => {
            try {
              await editTask({ id: taskId, updates: { status: newStatus } }).unwrap();
              toast.success(`Status updated to ${newStatus}`);
            } catch {
              toast.error("Failed to update status.");
            }
          }}
          onBreakdown={breakdownTask}
          loadingTaskId={null}
        />
      ) : (
        <TimelineBoard />
      )}

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskTrigger
          task={selectedTask}
          onSave={handleSaveEdit}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogTrigger asChild />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
