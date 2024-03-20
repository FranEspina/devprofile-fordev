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
import { InputDate } from "../../ui/InputDate"
import { Plus } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { type WorkCreate, WorkCreateSchema } from '@/Schemas/workSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector';
import { dateUtcToIso8601, localIso8601ToUtcDate } from '@/lib/dates'

export function CreateWorkDialog() {
  const [fecha, setFecha] = useState<Date>()

  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [highlights, setHighlights] = useState<Option[]>([])

  const nameInputRef = useRef<HTMLInputElement>(null)
  const positionInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const summaryInputRef = useRef<HTMLTextAreaElement>(null)
  const descInputRef = useRef<HTMLTextAreaElement>(null)

  const { setWorkStamp } = useRefreshStore(state => state)

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setHighlights([])
    setStartDate('')
    setEndDate('')
  }, [isOpen])

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

    let work: WorkCreate | undefined

    const formData = {
      userId: user?.id,
      name: nameInputRef.current?.value,
      description: descInputRef.current?.value,
      position: positionInputRef.current?.value,
      url: urlInputRef.current?.value,
      location: locationInputRef.current?.value,
      startDate: startDate,
      endDate: endDate,
      summary: summaryInputRef.current?.value,
      highlights: JSON.stringify(highlights),
    }

    try {

      const validated = await validateSchemaAsync<WorkCreate>(WorkCreateSchema, formData)
      if (!validated.success) {
        setErrors(validated.errors)
        setLoading(false)
        return
      }

      work = validated.data

      setErrors({})

    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
      setLoading(false)
    }

    try {
      if (!work) return
      const { success, message } = await createUserSection<WorkCreate>("work", work, user.id, token)
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
      errors['generic'] = "Error inesperado creando perfil"
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" variant="outline"><Plus className="mr-1 text-blue-500" />puesto de trabajo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Añadir puesto de trabajo</DialogTitle>
          <DialogDescription>
            Añade un nuevo puesto y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Nombre
            </Label>
            <Input ref={nameInputRef} id="name" placeholder="Nombre del puesto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right text-xs md:text-sm">
              Lugar
            </Label>
            <Input ref={locationInputRef} id="location" placeholder="Lugar del puesto de trabajo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['location'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['location']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xs md:text-sm">
              Descripción
            </Label>
            <Textarea ref={descInputRef} id="description" placeholder="Descripción del puesto de trabajo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right text-xs md:text-sm">
              Puesto
            </Label>
            <Input ref={positionInputRef} id="position" placeholder="posición / puesto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['position'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['position']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input ref={urlInputRef} id="url" placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Desde
            </Label>
            <InputDate date={localIso8601ToUtcDate(startDate)} onSelect={(date) => setStartDate((date) ? dateUtcToIso8601(date) : '')} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Hasta
            </Label>
            <InputDate date={localIso8601ToUtcDate(endDate)} onSelect={(date) => setEndDate((date) ? dateUtcToIso8601(date) : '')} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea ref={summaryInputRef} id="summary" placeholder="Resumen" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
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
        <DialogFooter className="flex flex-row items-center gap-2 justify-end">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}