import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  dueDate: z.string().min(1, { message: "Due date is required" }),
});

export default function AddTaskModal({
  onAddTask,
}: {
  onAddTask: (data: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    dueDate?: Date;
  }) => void;
}) {
  const [open, setOpen] = React.useState(false);

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
      title: "",
      description: "",
      status: "todo",
      dueDate: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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

    onAddTask({
      title: cleaned.title,
      description: cleaned.description || undefined,
      status: cleaned.status as "todo" | "in-progress" | "done",
      dueDate: dueDateParsed,
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create a New Task</DialogTitle>
          <DialogDescription className="text-sm">
            Add task details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              {...register("title")}
              className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <Input
            placeholder="Description (optional)"
            {...register("description")}
          />

          <div>
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger
                className={errors.status ? "border-red-500 focus-visible:ring-red-500" : ""}
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
              <p className="text-sm text-red-500 mt-1">Status is required</p>
            )}
          </div>

          <div>
            <Input
              type="date"
              {...register("dueDate")}
              className={errors.dueDate ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">{errors.dueDate.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full min-h-[40px]">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
