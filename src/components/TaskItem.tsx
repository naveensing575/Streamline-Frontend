import { Button } from "@/components/ui/button"

interface TaskItemProps {
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
  dueDate?: string
  onEdit: () => void
  onDelete: () => void
}

export default function TaskItem({
  title,
  description,
  status,
  dueDate,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="w-full rounded-lg border p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === "todo"
              ? "bg-yellow-100 text-yellow-800"
              : status === "in-progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {status}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}
      {dueDate && (
        <p className="text-xs text-gray-500">Due: {new Date(dueDate).toLocaleDateString()}</p>
      )}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}
