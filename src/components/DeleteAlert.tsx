import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function DeleteAlert({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
