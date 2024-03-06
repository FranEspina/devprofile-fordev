import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from "../../ui/DatePicker"
import { Plus } from 'lucide-react'

export function CreateWorkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-1 text-blue-500" />puestro de trabajo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[75%]">
        <DialogHeader>
          <DialogTitle>Añadir puesto de trabajo</DialogTitle>
          <DialogDescription>
            Añade un nuevo puesto y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Título
            </Label>
            <Input id="name" placeholder="Título del puesto" className="col-span-3" autoComplete="off" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Puesto
            </Label>
            <Input id="position" placeholder="posición / puesto" className="col-span-3" autoComplete="off" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Desde
            </Label>
            <DatePicker />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Hasta
            </Label>
            <DatePicker />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Textarea id="description" placeholder="Descripción del puesto de trabajo" className="col-span-3" autoComplete="off" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}