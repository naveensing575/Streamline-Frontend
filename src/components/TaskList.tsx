import TaskItem from "./TaskItem"

export interface Task {
  subTasks: string[] | undefined
  _id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
  dueDate?: string
}

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onRequestDelete: (taskId: string) => void
}

export default function TaskList({ tasks, onEdit, onRequestDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        You have no tasks yet. Start by adding one!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          title={task.title}
          description={task.description}
          status={task.status}
          dueDate={task.dueDate}
          onEdit={() => onEdit(task)}
          onRequestDelete={() => onRequestDelete(task._id)}
        />
      ))}
    </div>
  )
}
