import { useState } from "react";
import Board from "@/components/Board";
import AddTaskModal from "@/components/AddTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import StopwatchModal from "@/components/StopwatchModal";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useBreakdownTaskMutation,
} from "@/features/useTasks";
import { useGetMeQuery } from "@/features/useAuth";
import { toast } from "sonner";
import { type Task } from "@/components/TaskList";
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

export default function Dashboard() {
  const { data: user } = useGetMeQuery();
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [editTask] = useEditTaskMutation();
  const [removeTask] = useDeleteTaskMutation();
  const [breakdownTask] = useBreakdownTaskMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  if (!user) return null;

  const handleAddTask = async (data) => {
    try {
      await addTask(data).unwrap();
      toast.success(`✅ "${data.title}" created!`);
    } catch {
      toast.error("❌ Failed to create task. Please try again.");
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updates: Partial<Task>) => {
    if (selectedTask) {
      try {
        await editTask({ id: selectedTask._id, updates }).unwrap();
        toast.success(`✏️ "${updates.title}" updated!`);
      } catch {
        toast.error("❌ Failed to update task.");
      }
      setEditOpen(false);
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
      toast.success("🗑️ Task deleted successfully!");
    } catch {
      toast.error("❌ Failed to delete task.");
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
          <AddTaskModal onAddTask={handleAddTask} />
          <StopwatchModal />
        </div>
      </div>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <Board
          tasks={tasks || []}
          onEdit={handleEdit}
          onRequestDelete={handleRequestDelete}
          onStatusChange={async (taskId, newStatus) => {
            try {
              await editTask({ id: taskId, updates: { status: newStatus } }).unwrap();
              toast.success(`✅ Status updated to ${newStatus}`);
            } catch {
              toast.error("❌ Failed to update status.");
            }
          }}
          onBreakdown={breakdownTask}
          loadingTaskId={null} // you can wire this with local state if needed
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
