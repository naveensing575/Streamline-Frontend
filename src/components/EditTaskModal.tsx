import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { type Task } from "@/components/TaskList"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  dueDate: z.string().min(1, { message: "Due date is required" }),
})

type EditTaskModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  task: Task
  onSave: (updates: Partial<Task>) => void
}

export default function EditTaskModal({
  open,
  setOpen,
  task,
  onSave,
}: EditTaskModalProps) {
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
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      })
    }
  }, [task, reset])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const cleaned = {
      title: values.title?.trim() || "",
      description: values.description?.trim() || "",
      status: values.status,
      dueDate: values.dueDate?.trim() || "",
    }

    if (!cleaned.title || !cleaned.status || !cleaned.dueDate) {
      console.warn("Please fill in all required fields.")
      return
    }

    const dueDateParsed = new Date(cleaned.dueDate)
    if (isNaN(dueDateParsed.getTime())) {
      console.warn("Invalid due date format.")
      return
    }

    onSave({
      title: cleaned.title,
      description: cleaned.description || undefined,
      status: cleaned.status as "todo" | "in-progress" | "done",
      dueDate: dueDateParsed,
    })

    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update your task details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger
                className={
                  errors.status ? "border-red-500 focus-visible:ring-red-500" : ""
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
                errors.dueDate ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
