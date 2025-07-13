import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskModal from "@/components/Tasks/TaskModal";

type AddTaskProps = {
  onAddTask: (data: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate: Date;
  }) => void;
};

export default function AddTaskTrigger({ onAddTask }: AddTaskProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Task</Button>
      <TaskModal
        open={open}
        setOpen={setOpen}
        mode="add"
        onSubmit={onAddTask}
      />
    </>
  );
}
