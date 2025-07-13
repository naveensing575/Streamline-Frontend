import useTasks from "@/hooks/useTasks";
import Board from "@/components/Board";
import type { Task } from "@/components/Tasks/TaskList";

export default function BoardWrapper() {
  const {
    tasks,
    editTask,
    removeTask,
    generateSubTasks,
    loadingTaskId,
  } = useTasks();

  const handleStatusChange = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    await editTask(taskId, { status: newStatus });
  };

  return (
    <Board
      tasks={tasks}
      onEdit={(task: Task) => editTask(task._id, task)}
      onDelete={(taskId: string) => removeTask(taskId)}
      onStatusChange={handleStatusChange}
      onBreakdown={generateSubTasks}
      loadingTaskId={loadingTaskId}
    />
  );
}
