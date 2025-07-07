import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface TaskItemProps {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  subTasks?: string[];
  dragListeners?: Record<string, any>;
  dragAttributes?: Record<string, any>;
  onEdit: () => void;
  onBreakdown?: () => void;
  isBreakingDown?: boolean;
  onRequestDelete: () => void;
}

export default function TaskItem({
  title,
  description,
  status,
  dueDate,
  subTasks,
  dragListeners,
  dragAttributes,
  onEdit,
  onBreakdown,
  isBreakingDown,
  onRequestDelete,
}: TaskItemProps) {
  const statusClasses = {
    todo: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  const canBreakDown = onBreakdown && !subTasks?.length;

  return (
    <Card className="w-full flex flex-col shadow-md rounded-xl border border-gray-200">
      <CardHeader className="flex flex-col items-start gap-2 pb-0">
        <div className="flex w-full justify-between items-start">
          <div
            className="flex items-center gap-2"
            {...dragListeners}
            {...dragAttributes}
          >
            <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
            <CardTitle className="text-sm sm:text-base font-semibold">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusClasses[status]}`}
            >
              {status}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={onRequestDelete}>Delete</DropdownMenuItem>
                {onBreakdown && (
                  <DropdownMenuItem
                    onClick={onBreakdown}
                    disabled={!canBreakDown || isBreakingDown}
                  >
                    {isBreakingDown
                      ? "Generating..."
                      : subTasks?.length
                      ? "Break Down (Done)"
                      : "Break Down"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

        {isBreakingDown && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Breaking down task using AI...
          </div>
        )}

        {!isBreakingDown && subTasks && subTasks.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-700 mb-1">
              {subTasks.length} Subtask{subTasks.length > 1 ? "s" : ""}
            </p>
            <ul className="text-xs text-gray-600 list-disc list-inside">
              {subTasks.map((sub, i) => (
                <li key={i}>{sub}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
