import { useState } from "react";
import KanbanBoard from "@/components/Kanban/KanbanBoard";
import TimelineBoard from "@/components/Timeline/TimelineBoard";
import AddTaskTrigger from "@/components/AddTaskTrigger";
import StopwatchModal from "@/components/StopwatchModal";
import EditTaskTrigger from "@/components/EditTaskTrigger";
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
import { useGetTasksQuery, useAddTaskMutation, useEditTaskMutation, useDeleteTaskMutation, useBreakdownTaskMutation } from "@/features/useTasks";
import { toast } from "sonner";
import { type Task } from "@/components/TaskList";

export default function Dashboard() {
  const { data: user } = useGetMeQuery();
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [editTask] = useEditTaskMutation();
  const [removeTask] = useDeleteTaskMutation();
  const [breakdownTask] = useBreakdownTaskMutation();

  const [boardType, setBoardType] = useState<"kanban" | "timeline">("kanban");

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
    <main className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Welcome, {user.name}
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <AddTaskTrigger onAddTask={handleAddTask} />
          <StopwatchModal />

          <div className="flex gap-2">
            <button
              onClick={() => setBoardType("kanban")}
              className={`px-4 py-2 rounded ${boardType === "kanban" ? "bg-black text-white" : "bg-gray-200"}`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setBoardType("timeline")}
              className={`px-4 py-2 rounded ${boardType === "timeline" ? "bg-black text-white" : "bg-gray-200"}`}
            >
              Timeline Board
            </button>
          </div>
        </div>
      </div>

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

      {selectedTask && (
        <EditTaskTrigger
          task={selectedTask}
          onSave={handleSaveEdit}
          onClose={() => setSelectedTask(null)}
        />
      )}

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
