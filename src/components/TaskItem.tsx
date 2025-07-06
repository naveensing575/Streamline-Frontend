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
  const statusClasses = {
    todo: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  return (
    <Card className="w-full flex flex-col shadow-md rounded-xl border border-gray-200">
      <CardHeader className="flex flex-col items-start gap-2 pb-0">
        <div className="flex w-full justify-between items-start">
          <CardTitle className="text-sm sm:text-base font-semibold">
            {title}
          </CardTitle>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusClasses[status]}`}
          >
            {status}
          </span>
        </div>
        {dueDate && (
          <p className="text-xs text-gray-500">
            Due: {new Date(dueDate).toLocaleDateString()}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-3 mt-2">
        {description && (
          <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
            {description}
          </p>
        )}
        <div className="flex flex-col xs:flex-row justify-end gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full xs:w-auto min-h-[40px]"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full xs:w-auto min-h-[40px]"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
