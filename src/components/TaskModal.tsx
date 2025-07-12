import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Task } from "@/components/TaskList";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  dueDate: z.string().min(1, { message: "Due date is required" }),
});

interface TaskModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "add" | "edit";
  defaultTask?: Task;
  onSubmit: (values: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate: Date;
  }) => void;
}

export default function TaskModal({
  open,
  setOpen,
  mode,
  defaultTask,
  onSubmit,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTask?.title || "",
      description: defaultTask?.description || "",
      status: defaultTask?.status || "todo",
      dueDate: defaultTask?.dueDate
        ? defaultTask.dueDate.slice(0, 10)
        : "",
    },
  });

  React.useEffect(() => {
    if (defaultTask && mode === "edit") {
      reset({
        title: defaultTask.title,
        description: defaultTask.description,
        status: defaultTask.status,
        dueDate: defaultTask.dueDate
          ? defaultTask.dueDate.slice(0, 10)
          : "",
      });
    } else if (mode === "add") {
      reset({
        title: "",
        description: "",
        status: "todo",
        dueDate: "",
      });
    }
  }, [defaultTask, mode, reset]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const cleaned = {
      title: values.title?.trim() || "",
      description: values.description?.trim() || "",
      status: values.status,
      dueDate: values.dueDate?.trim() || "",
    };

    if (!cleaned.title || !cleaned.status || !cleaned.dueDate) {
      console.warn("Please fill in all required fields.");
      return;
    }

    const dueDateParsed = new Date(cleaned.dueDate);
    if (isNaN(dueDateParsed.getTime())) {
      console.warn("Invalid due date format.");
      return;
    }

    onSubmit({
      title: cleaned.title,
      description: cleaned.description || undefined,
      status: cleaned.status,
      dueDate: dueDateParsed,
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {mode === "add" ? "Create a New Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "add"
              ? "Add task details below."
              : "Update your task details below."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              placeholder="Title"
              {...register("title")}
              className={
                errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <Input placeholder="Description" {...register("description")} />

          <div>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue("status", value as any)
              }
            >
              <SelectTrigger
                className={
                  errors.status
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                Status is required
              </p>
            )}
          </div>

          <div>
            <Input
              type="date"
              {...register("dueDate")}
              className={
                errors.dueDate
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full min-h-[40px]">
            {mode === "add" ? "Create Task" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
