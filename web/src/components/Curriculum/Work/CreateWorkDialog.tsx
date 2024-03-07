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
import { useRef, useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { type UserWorkCreate, UserWorkCreateSchema } from '@/Schemas/workSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { z } from 'astro/zod'
import { validateSchemaAsync } from '@/lib/validations'

export function CreateWorkDialog() {
  const [loading, setLoading] = useState(false)
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError } = useNotify()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()



  const titleInputRef = useRef<HTMLInputElement>(null)
  const positionInputRef = useRef<HTMLInputElement>(null)
  const descInputRef = useRef<HTMLTextAreaElement>(null)



  const handleSave = async () => {
    setLoading(true)

    if (token === 'not-loaded')
      return

    if (!user || !token) {
      navigate('/').then(() =>
        notifyError('Usuario no autorizado')
      )
      return
    }

    try {
      const formData = {
        userId: user?.id,
        title: titleInputRef.current?.value,
        description: descInputRef.current?.value,
        position: positionInputRef.current?.value,
        startDate: startDate,
        endDate: endDate,
        highlights: []
      }

      const validated = await validateSchemaAsync(UserWorkCreateSchema, formData)
      if (!validated.success) {
        setErrors(validated.errors)
        setLoading(false)
        return
      }

      setErrors({})

    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }


    try {
      setLoading(true)


    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-1 text-blue-500" />puesto de trabajo</Button>
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
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input ref={titleInputRef} id="title" placeholder="Título del puesto" className="col-span-3" autoComplete="off" />
            {errors['title'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['title']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Puesto
            </Label>
            <Input ref={positionInputRef} id="position" placeholder="posición / puesto" className="col-span-3" autoComplete="off" />
            {errors['position'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['position']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Desde
            </Label>
            <DatePicker date={startDate} onSelect={setStartDate} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Hasta
            </Label>
            <DatePicker date={endDate} onSelect={setEndDate} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Textarea ref={descInputRef} id="description" placeholder="Descripción del puesto de trabajo" className="col-span-3" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
        </div>
        <DialogFooter>
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <Button variant="outline" type="submit" onClick={handleSave} disabled={loading}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}