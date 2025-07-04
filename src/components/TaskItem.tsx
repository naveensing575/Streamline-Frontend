import { Button } from "@/components/ui/button";

interface TaskItemProps {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  onEdit: () => void;
  onDelete: () => void;
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
    <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
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
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{description}</p>
      )}
      {dueDate && (
        <p className="text-xs text-gray-500 mb-4">
          Due: {new Date(dueDate).toLocaleDateString()}
        </p>
      )}
      <div className="flex justify-end gap-2 mt-auto">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
