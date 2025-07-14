import Board from '@/components/Kanban/Board'
import { type Task } from '@/components/Tasks/TaskList'

interface KanbanBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onRequestDelete: (taskId: string) => void
  onStatusChange: (taskId: string, newStatus: string) => void
  onBreakdown: (taskId: string) => void
  loadingTaskId: string | null
  isLoading: boolean
}

export default function KanbanBoard({
  tasks,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onBreakdown,
  loadingTaskId,
  isLoading,
}: KanbanBoardProps) {
  return (
    <Board
      tasks={tasks}
      onEdit={onEdit}
      onRequestDelete={onRequestDelete}
      onStatusChange={onStatusChange}
      onBreakdown={onBreakdown}
      loadingTaskId={loadingTaskId}
      isLoading={isLoading}
    />
  )
}
