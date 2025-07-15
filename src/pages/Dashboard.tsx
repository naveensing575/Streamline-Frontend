import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'

import KanbanBoard from '@/components/Kanban/KanbanBoard'
import TimelineBoard from '@/components/Timeline/TimelineBoard'
import AddTaskTrigger from '@/components/Tasks/AddTaskTrigger'
import StopwatchModal from '@/components/StopwatchModal'
import EditTaskTrigger from '@/components/Tasks/EditTaskTrigger'
import Navbar from '@/components/Navbar'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Loader2 } from 'lucide-react'

import { useGetMeQuery } from '@/features/useAuth'
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useBreakdownTaskMutation,
} from '@/features/useTasks'

import { type Task } from '@/components/Tasks/TaskList'

export default function Dashboard() {
  const { data: user } = useGetMeQuery()
  const { data: tasks, isLoading } = useGetTasksQuery()
  const [addTask] = useAddTaskMutation()
  const [editTask] = useEditTaskMutation()
  const [removeTask] = useDeleteTaskMutation()
  const [breakdownTask] = useBreakdownTaskMutation()

  const { boardType, setBoardType } = useOutletContext<{
    boardType: 'kanban' | 'timeline'
    setBoardType: (type: 'kanban' | 'timeline') => void
  }>()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null)
  const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(null)

  if (!user) return null

  const handleAddTask = async (data: {
    title: string
    description?: string
    status: 'todo' | 'in-progress' | 'done'
    dueDate?: Date
  }) => {
    try {
      await addTask(data).unwrap()
      toast.success(`"${data.title}" created!`)
    } catch {
      toast.error('Failed to create task. Please try again.')
    }
  }

  const handleSaveEdit = async (updates: Partial<Task>) => {
    if (selectedTask) {
      try {
        await editTask({ id: selectedTask._id, updates }).unwrap()
        toast.success(`"${updates.title}" updated!`)
      } catch {
        toast.error('Failed to update task.')
      }
      setSelectedTask(null)
    }
  }

  const handleRequestDelete = (taskId: string) => {
    setTaskIdToDelete(taskId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!taskIdToDelete) return
    try {
      await removeTask(taskIdToDelete).unwrap()
      toast.success('Task deleted successfully!')
    } catch {
      toast.error('Failed to delete task.')
    } finally {
      setDeleteConfirmOpen(false)
      setTaskIdToDelete(null)
    }
  }

  const renderBoardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )
    }

    if (boardType === 'kanban') {
      return (
        <KanbanBoard
          tasks={tasks || []}
          onEdit={(task) => setSelectedTask(task)}
          onRequestDelete={handleRequestDelete}
          onStatusChange={async (taskId, newStatus) => {
            try {
              await editTask({
                id: taskId,
                updates: { status: newStatus },
              }).unwrap()
              toast.success(`Status updated to ${newStatus}`)
            } catch {
              toast.error('Failed to update status.')
            }
          }}
          onBreakdown={async (taskId) => {
            try {
              setBreakingDownTaskId(taskId)
              await breakdownTask(taskId).unwrap()
              toast.success('Task broken down successfully.')
            } catch {
              toast.error('Failed to break down task.')
            } finally {
              setBreakingDownTaskId(null)
            }
          }}
          breakingDownTaskId={breakingDownTaskId}
          isLoading={isLoading}
        />
      )
    }

    return <TimelineBoard />
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex justify-between items-end flex-wrap">
        <div className="flex gap-4 border-b border-gray-200">
          {[
            { type: 'timeline', label: 'Timeline board' },
            { type: 'kanban', label: 'Kanban board' },
          ].map((tab) => {
            const isActive = boardType === tab.type
            return (
              <button
                key={tab.type}
                onClick={() => setBoardType(tab.type as 'kanban' | 'timeline')}
                className={`px-5 py-3 rounded-t-xl font-semibold transition-colors duration-300 cursor-pointer text-sm
                  flex items-center justify-center
                  ${
                    isActive
                      ? 'bg-white text-black border border-b-0'
                      : 'bg-[#F8F9F8] text-gray-400 border border-transparent'
                  }
                `}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <Navbar user={user} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden rounded-tl-none rounded-tr-xl rounded-b-xl bg-white border shadow p-6 -mt-px">
        {boardType === 'kanban' && (
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
          {renderBoardContent()}
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
  )
}
