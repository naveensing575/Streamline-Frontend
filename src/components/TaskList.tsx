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
    <Card className="flex flex-col justify-between w-full max-w-[280px] min-h-[220px] hover:shadow-md transition-transform hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
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
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between">
        <div className="flex-1 mb-2">
          {description && (
            <p className="text-sm text-gray-600 mb-1 line-clamp-2">
              {description}
            </p>
          )}
          {dueDate && (
            <p className="text-xs text-gray-500">
              Due: {new Date(dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex justify-between mt-auto">
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
