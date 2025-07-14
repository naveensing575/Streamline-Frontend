"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DatePicker } from "@/components/DatePicker";
import { type Task } from "@/components/Tasks/TaskList";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TiptapToolbar from "@/components/TiptapToolbar";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  dueDate: z.date({
    required_error: "Due date is required",
    invalid_type_error: "Invalid date",
  }),
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
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTask?.title || "",
      description: defaultTask?.description || "",
      status: defaultTask?.status || "todo",
      dueDate: defaultTask?.dueDate ? new Date(defaultTask.dueDate) : undefined,
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: watch("description") || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("description", html);
    },
  });

  React.useEffect(() => {
    if (defaultTask && mode === "edit") {
      reset({
        title: defaultTask.title,
        description: defaultTask.description || "",
        status: defaultTask.status,
        dueDate: defaultTask.dueDate ? new Date(defaultTask.dueDate) : undefined,
      });
      editor?.commands.setContent(defaultTask.description || "");
    } else if (mode === "add") {
      reset({
        title: "",
        description: "",
        status: "todo",
        dueDate: undefined,
      });
      editor?.commands.clearContent();
    }
  }, [defaultTask, mode, reset, editor]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const cleaned = {
      title: values.title.trim(),
      description: values.description,
      status: values.status,
      dueDate: values.dueDate,
    };

    onSubmit(cleaned);
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
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

          {/* Tiptap Editor */}
          {editor && <TiptapToolbar editor={editor} />}
          <Controller
            name="description"
            control={control}
            render={() => (
              <div className="border rounded p-2 min-h-[150px] max-h-[250px] overflow-y-auto pb-4">
                <EditorContent editor={editor} className="prose focus:outline-none" />
              </div>
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}

          {/* Status */}
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
              <p className="text-sm text-red-500 mt-1">Status is required</p>
            )}
          </div>

          {/* Due Date */}
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="dd/mm/yyyy"
                error={errors.dueDate?.message?.toString()}
              />
            )}
          />

          <Button type="submit" className="w-full min-h-[40px]">
            {mode === "add" ? "Create Task" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
