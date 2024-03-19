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
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector';
import { dateUtcToIso8601, localIso8601ToUtcDate } from '@/lib/dates'

export function EditWorkDialog({ work }: { work: Work }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const { setWorkStamp } = useRefreshStore(state => state)
  const [workState, setWorkState] = useState(work)
  const [highlights, setHighlights] = useState<Option[]>([])
  const buttonSaveRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setLoading(false)
    setErrors({})
    if (work.highlights) {
      setHighlights(JSON.parse(work.highlights))
    }
    setWorkState(work)
    buttonSaveRef.current?.focus()

  }, [isOpen])


  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newWork = { ...workState, [event.target.id]: event.target.value }
    setWorkState(newWork);
  }

  const handleSelectStart: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newWork = structuredClone(workState)
    newWork.startDate = dateUtcToIso8601(selectedDay)
    setWorkState(newWork);
  }

  const handleSelectEnd: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newWork = structuredClone(workState)
    newWork.endDate = day ? dateUtcToIso8601(day) : ''
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

    let work: Work | undefined = structuredClone(workState)
    work.highlights = JSON.stringify(highlights)

    try {

      const validated = await validateSchemaAsync<Work>(WorkSchema, work)
      if (!validated.success) {
        setErrors(validated.errors)
        setLoading(false)
        return
      }

      setErrors({})

    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setLoading(false)
      setErrors(errors)
    }

    try {
      var { success, message, data } = await updateUserSection<Work>("work", work, token)
      if (success) {
        notifySuccess(message)
        setErrors({})
        setHighlights([])
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
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Nombre
            </Label>
            <Input value={workState.name} onChange={handleChange} id="name" placeholder="Nombre de la posición" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right text-xs md:text-sm">
              Lugar
            </Label>
            <Input value={workState.location} onChange={handleChange} id="name" placeholder="Lugar de la posición" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['location'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['location']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xs md:text-sm">
              Descripción
            </Label>
            <Textarea value={workState.description} onChange={handleChange} id="description" placeholder="Descripción del puesto de trabajo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right text-xs md:text-sm">
              Puesto
            </Label>
            <Input value={workState.position} onChange={handleChange} id="position" placeholder="posición / puesto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['position'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['position']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input value={workState.url} onChange={handleChange} id="url" placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Desde
            </Label>
            <DatePicker date={localIso8601ToUtcDate(workState.startDate)} onSelect={handleSelectStart} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Hasta
            </Label>
            <DatePicker date={localIso8601ToUtcDate(workState.endDate)} onSelect={handleSelectEnd} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea value={workState.summary} onChange={handleChange} id="summary" placeholder="Resumen" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['summary'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['summary']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="highlights" className="text-right text-xs md:text-sm">
              Destacado(s)
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={highlights} onChange={setHighlights} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['highlights'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['highlights']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button ref={buttonSaveRef} className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}