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
import { Edit } from 'lucide-react'
import { useRef, useState, useEffect, type ChangeEvent } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { type Work, WorkSchema } from '@/Schemas/workSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { LoadIndicator } from '@/components/LoadIndicator'

export function EditWorkDialog({ work }: { work: Work }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const { setWorkStamp } = useRefreshStore(state => state)
  const [workState, setWorkState] = useState(work)

  console.log(work)

  useEffect(() => {
    setLoading(false)
    setErrors({})

    //TODO: FIX en servidor que devuelva fechas
    work.startDate = new Date(work.startDate)
    if (work.endDate) {
      work.endDate = new Date(work.endDate)
    }

    setWorkState(work)

  }, [isOpen])

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newWork = structuredClone(workState)
    newWork.title = event.target.value
    setWorkState(newWork);
  }

  const handleChangePosition = (event: ChangeEvent<HTMLInputElement>) => {
    const newWork = structuredClone(workState)
    newWork.position = event.target.value
    setWorkState(newWork);
  }

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    const newWork = structuredClone(workState)
    newWork.description = event.target.value
    setWorkState(newWork);
  }

  const handleSelectStart: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newWork = structuredClone(workState)
    newWork.startDate = selectedDay
    setWorkState(newWork);
  }

  const handleSelectEnd: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newWork = structuredClone(workState)
    console.log(day)
    newWork.endDate = day
    setWorkState(newWork);
  }

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

    let work: Work | undefined

    console.log(workState)

    try {

      const validated = await validateSchemaAsync<Work>(WorkSchema, workState)
      if (!validated.success) {
        console.log(errors)
        setErrors(validated.errors)
        setLoading(false)
        return
      }

      console.log(validated.data)

      work = validated.data

      setErrors({})

    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setLoading(false)
      setErrors(errors)
    }

    try {
      var { success, message, data } = await updateUserSection<Work>("work", workState, token)
      console.log(success)
      console.log(message)
      if (success) {
        notifySuccess(message)
        setErrors({})
        setWorkStamp(Date.now())
        setIsOpen(false)
        return
      }
      else {
        const errors: { [key: string]: string } = {}
        errors['generic'] = message
        setErrors(errors)
      }
    }
    catch (error) {
      console.log(error)
      const errors: { [key: string]: string } = {}
      errors['generic'] = "Error inesperado actualizando puesto"
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-3 w-3" />
          <span className="sr-only">Editar perfil</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Editar puesto de trabajo</DialogTitle>
          <DialogDescription>
            Modifica puesto y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-xs md:text-sm">
              Título
            </Label>
            <Input value={workState.title} onChange={handleChangeTitle} id="title" placeholder="Título del puesto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['title'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['title']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right text-xs md:text-sm">
              Puesto
            </Label>
            <Input value={workState.position} onChange={handleChangePosition} id="position" placeholder="posición / puesto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['position'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['position']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Desde
            </Label>
            <DatePicker date={workState.startDate} onSelect={handleSelectStart} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Hasta
            </Label>
            <DatePicker date={workState.endDate} onSelect={handleSelectEnd} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xs md:text-sm">
              Descripción
            </Label>
            <Textarea id="description" placeholder="Descripción del puesto de trabajo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}