"use client";

import Board from "@/components/Board";
import { type Task } from "@/components/TaskList";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRequestDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onBreakdown: (taskId: string) => void;
  loadingTaskId: string | null;
}

export default function KanbanBoard({
  tasks,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onBreakdown,
  loadingTaskId,
}: KanbanBoardProps) {
  return (
    <Board
      tasks={tasks}
      onEdit={onEdit}
      onRequestDelete={onRequestDelete}
      onStatusChange={onStatusChange}
      onBreakdown={onBreakdown}
      loadingTaskId={loadingTaskId}
    />
  );
}
