import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="flex flex-col justify-between h-52 w-full max-w-[250px]">
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {description && (
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">
            {description}
          </p>
        )}
        {dueDate && (
          <p className="text-xs text-gray-500 mb-2">
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
      </CardContent>
    </Card>
  );
}
