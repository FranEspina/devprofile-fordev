import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export interface ErrorDialogProps {
  errors: { error: string, count: number }[],
  title: string,
  description: string,
  open: boolean,
  setOpen: (open: boolean) => void
}

export function ErrorDialog({ errors, title, description, open, setOpen }: ErrorDialogProps) {

  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <section>
              <h4>
                {description}
              </h4>
              {errors
                ?
                <ul className="mt-2">
                  {errors.map(e => <li className="ml-4 mb-1">💀 {e.error} (<span className={cn('font-bold ', (e.count > 1) ? 'text-blue-500' : '')}>x{e.count}</span>)</li>)}
                </ul>
                : ''
              }
            </section>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Aceptar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )


}