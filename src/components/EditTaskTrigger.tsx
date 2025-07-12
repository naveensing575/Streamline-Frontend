import { useEffect } from "react";
import TaskModal from "@/components/TaskModal";
import { type Task } from "@/components/TaskList";

export default function EditTaskTrigger({
  task,
  onSave,
  onClose,
}: {
  task: Task;
  onSave: (updates: Partial<Task>) => void;
  onClose: () => void;
}) {
  const open = !!task;

  useEffect(() => {
    if (!open) onClose();
  }, [open, onClose]);

  const handleEditTask = (updates: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate: Date;
  }) => {
    onSave({
      ...updates,
      dueDate: updates.dueDate.toISOString(),
    });
  };

  return (
    <TaskModal
      open={open}
      setOpen={(value) => {
        if (!value) onClose();
      }}
      mode="edit"
      defaultTask={task}
      onSubmit={handleEditTask}
    />
  );
}
