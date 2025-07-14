"use client";

import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import KanbanBoard from "@/components/Kanban/KanbanBoard";
import TimelineBoard from "@/components/Timeline/TimelineBoard";
import AddTaskTrigger from "@/components/Tasks/AddTaskTrigger";
import StopwatchModal from "@/components/StopwatchModal";
import EditTaskTrigger from "@/components/Tasks/EditTaskTrigger";
import Navbar from "@/components/Navbar";
import ConfirmDialog from "@/components/ConfirmDialog";

import { useGetMeQuery } from "@/features/useAuth";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useBreakdownTaskMutation,
} from "@/features/useTasks";

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
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Tabs and Navbar */}
      <div className="flex justify-between items-end flex-wrap gap-4 mt-3">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setBoardType("kanban")}
            className={`px-4 pt-2 pb-6 border rounded-t-xl font-semibold tracking-wide transition-colors duration-300 cursor-pointer ${
              boardType === "kanban"
                ? "bg-white border-b-0 text-black"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setBoardType("timeline")}
            className={`px-4 pt-2 pb-6 border rounded-t-xl font-semibold tracking-wide transition-colors duration-300 cursor-pointer ${
              boardType === "timeline"
                ? "bg-white border-b-0 text-black"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Timeline Board
          </button>
        </div>

        <Navbar user={user} />
      </div>

      {/* Attached Content Body */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-tl-none rounded-tr-xl rounded-b-xl bg-white border shadow p-6 -mt-px">
        {boardType === "kanban" && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome, {user.name}
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
              <AddTaskTrigger onAddTask={handleAddTask} />
              <StopwatchModal />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden scrollbar-hide transition-opacity duration-500 ease-in-out">
          {boardType === "kanban" ? (
            <KanbanBoard
              tasks={tasks || []}
              onEdit={(task) => setSelectedTask(task)}
              onRequestDelete={handleRequestDelete}
              onStatusChange={async (taskId, newStatus) => {
                try {
                  await editTask({
                    id: taskId,
                    updates: { status: newStatus },
                  }).unwrap();
                  toast.success(`Status updated to ${newStatus}`);
                } catch {
                  toast.error("Failed to update status.");
                }
              }}
              onBreakdown={breakdownTask}
              loadingTaskId={null}
              isLoading={isLoading}
            />
          ) : (
            <TimelineBoard />
          )}
        </div>
      </div>

      {selectedTask && (
        <EditTaskTrigger
          task={selectedTask}
          onSave={handleSaveEdit}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirmed}
        title="Delete this task?"
        description="This action cannot be undone. This will permanently remove the task."
        confirmText="Yes, Delete"
      />
    </div>
  );
}
