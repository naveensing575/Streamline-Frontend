import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "@/components/Tasks/TaskList";
import TaskItem from "@/components/Tasks/TaskItem";
import { useState } from "react";

interface BoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRequestDelete: (taskId: string) => void;
  onStatusChange: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => void;
  onBreakdown: (taskId: string) => void;
  loadingTaskId: string | null;
}

const statuses: Array<"todo" | "in-progress" | "done"> = [
  "todo",
  "in-progress",
  "done",
];

export default function Board({
  tasks,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onBreakdown,
  loadingTaskId,
}: BoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveTaskId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const draggedTask = tasks.find((task) => task._id === activeId);
    if (!draggedTask) return;

    let newStatus: "todo" | "in-progress" | "done" | undefined;

    if (statuses.includes(overId)) {
      newStatus = overId as typeof newStatus;
    } else {
      const overTask = tasks.find((task) => task._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (!newStatus) return;

    if (draggedTask.status !== newStatus) {
      onStatusChange(draggedTask._id, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 w-full overflow-x-auto flex-nowrap pb-4">
        {statuses.map((status) => (
          <DroppableColumn
            key={status}
            id={status}
            tasks={tasks.filter((task) => task.status === status)}
            onEdit={onEdit}
            onRequestDelete={onRequestDelete}
            onBreakdown={onBreakdown}
            loadingTaskId={loadingTaskId}
            activeTaskId={activeTaskId} // ✅ pass it down
          />
        ))}
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
            isBreakingDown={loadingTaskId === activeTaskId}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableColumn({
  id,
  tasks,
  onEdit,
  onRequestDelete,
  onBreakdown,
  loadingTaskId,
  activeTaskId,
}: {
  id: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRequestDelete: (taskId: string) => void;
  onBreakdown: (taskId: string) => void;
  loadingTaskId: string | null;
  activeTaskId: string | null;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-[280px] sm:flex-1 bg-gray-50 dark:bg-gray-800 rounded p-4 min-h-[500px] overflow-y-auto transition-shadow"
    >
      <h2 className="text-base sm:text-lg font-semibold capitalize mb-2">
        {id.replace("-", " ")}
      </h2>
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
            loadingTaskId={loadingTaskId}
            activeTaskId={activeTaskId} // ✅ pass it down
          />
        ))}
      </SortableContext>
    </div>
  );
}

function SortableTask({
  task,
  onEdit,
  onRequestDelete,
  onBreakdown,
  loadingTaskId,
  activeTaskId,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onRequestDelete: (taskId: string) => void;
  onBreakdown: (taskId: string) => void;
  loadingTaskId: string | null;
  activeTaskId: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDragging = activeTaskId === task._id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`mb-2 ${isDragging ? "opacity-50" : ""}`} // ✅ light placeholder style
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
        isBreakingDown={loadingTaskId === task._id}
      />
    </div>
  );
}

