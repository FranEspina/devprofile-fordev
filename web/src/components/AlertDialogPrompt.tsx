import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export interface AlertDialogPromptProps {
  open: boolean,
  setOpen: (open: boolean) => void
  title?: string,
  message?: string,
  labelCancel?: string,
  labelAction?: string,
  onActionClick?: undefined | (() => void)
}
export function AlertDialogPrompt({
  open,
  setOpen,
  title = 'Atención',
  message = '¿Está seguro que desea continuar?',
  labelCancel = 'No',
  labelAction = 'Si',
  onActionClick }
  : AlertDialogPromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labelCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onActionClick}>{labelAction}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}