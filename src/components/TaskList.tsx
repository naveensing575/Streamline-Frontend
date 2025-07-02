import TaskItem from "./TaskItem"

export interface Task {
  _id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
  dueDate?: string
}

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        You have no tasks yet. Start by adding one!
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          title={task.title}
          description={task.description}
          status={task.status}
          dueDate={task.dueDate}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task._id)}
        />
      ))}
    </div>
  )
}
