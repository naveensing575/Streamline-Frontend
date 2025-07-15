'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type Task } from '@/components/Tasks/TaskList'
import TaskItem from '@/components/Tasks/TaskCard'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface BoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onRequestDelete: (taskId: string) => void
  onStatusChange: (
    taskId: string,
    newStatus: 'todo' | 'in-progress' | 'done',
  ) => void
  onBreakdown: (taskId: string) => void
  breakingDownTaskId: string | null
  isLoading: boolean
}

const statuses: Array<'todo' | 'in-progress' | 'done'> = [
  'todo',
  'in-progress',
  'done',
]

export default function Board({
  tasks,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onBreakdown,
  breakingDownTaskId,
  isLoading,
}: BoardProps) {
  const sensors = useSensors(useSensor(PointerSensor))
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const [showSkeleton, setShowSkeleton] = useState(isLoading)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    if (isLoading) {
      setShowSkeleton(true)
    } else {
      timeout = setTimeout(() => {
        setShowSkeleton(false)
      }, 2000)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isLoading])

  const handleDragStart = (event: any) => {
    setActiveTaskId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveTaskId(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const draggedTask = tasks.find((task) => task._id === activeId)
    if (!draggedTask) return

    let newStatus: 'todo' | 'in-progress' | 'done' | undefined

    if (statuses.includes(overId)) {
      newStatus = overId as typeof newStatus
    } else {
      const overTask = tasks.find((task) => task._id === overId)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    if (!newStatus) return

    if (draggedTask.status !== newStatus) {
      onStatusChange(draggedTask._id, newStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        <div className="flex gap-4 w-full overflow-x-auto flex-nowrap pb-4">
          {statuses.map((status) => (
            <DroppableColumn
              key={status}
              id={status}
              tasks={tasks.filter((task) => task.status === status)}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
              onBreakdown={onBreakdown}
              breakingDownTaskId={breakingDownTaskId}
              activeTaskId={activeTaskId}
              isLoading={showSkeleton}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200 }}>
        {activeTaskId ? (
          <TaskItem
            {...tasks.find((task) => task._id === activeTaskId)!}
            dragListeners={{}}
            dragAttributes={{}}
            onEdit={() => {}}
            onRequestDelete={() => {}}
            onBreakdown={() => onBreakdown(activeTaskId)}
            isBreakingDown={breakingDownTaskId === activeTaskId}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function DroppableColumn({
  id,
  tasks,
  onEdit,
  onRequestDelete,
  onBreakdown,
  breakingDownTaskId,
  activeTaskId,
  isLoading,
}: {
  id: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onRequestDelete: (taskId: string) => void
  onBreakdown: (taskId: string) => void
  breakingDownTaskId: string | null
  activeTaskId: string | null
  isLoading: boolean
}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-[280px] sm:flex-1 bg-gray-50 dark:bg-gray-800 rounded p-4 min-h-[500px]"
    >
      <h2 className="text-base sm:text-lg font-semibold capitalize mb-2">
        {id.replace('-', ' ')}
      </h2>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-md" />
          ))}
        </div>
      ) : (
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask
              key={task._id}
              task={task}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
              onBreakdown={onBreakdown}
              breakingDownTaskId={breakingDownTaskId}
              activeTaskId={activeTaskId}
            />
          ))}
        </SortableContext>
      )}
    </div>
  )
}

function SortableTask({
  task,
  onEdit,
  onRequestDelete,
  onBreakdown,
  breakingDownTaskId,
  activeTaskId,
}: {
  task: Task
  onEdit: (task: Task) => void
  onRequestDelete: (taskId: string) => void
  onBreakdown: (taskId: string) => void
  breakingDownTaskId: string | null
  activeTaskId: string | null
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isDragging = activeTaskId === task._id

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <TaskItem
        title={task.title}
        description={task.description}
        status={task.status}
        dueDate={task.dueDate}
        subTasks={task.subTasks}
        dragListeners={listeners}
        dragAttributes={attributes}
        onEdit={() => onEdit(task)}
        onRequestDelete={() => onRequestDelete(task._id)}
        onBreakdown={() => onBreakdown(task._id)}
        isBreakingDown={breakingDownTaskId === task._id}
      />
    </div>
  )
}
