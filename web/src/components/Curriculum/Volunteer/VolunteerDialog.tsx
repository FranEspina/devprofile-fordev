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
import { Plus, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { type VolunteerCreate, VolunteerSchema, VolunteerCreateSchema, type Volunteer, VolunteerBaseSchema } from '@/Schemas/volunteerSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection, updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import { type ChangeEvent } from "react"
import { DatePicker } from '@/components/ui/DatePicker'
import { type SelectSingleEventHandler } from 'react-day-picker'
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector"
import { Textarea } from "@/components/ui/textarea"
import { dateUtcToIso8601, localIso8601ToUtcDate } from '@/lib/dates'
import { InputDate } from "@/components/ui/InputDate"
import { z } from 'astro/zod'
import { arrayToOptions, optionsToArray } from '@/lib/selectOption'

interface VolunteerDialogProps {
  editMode: boolean,
  initialState?: Volunteer
}

export function VolunteerDialog({ editMode = false, initialState = undefined }: VolunteerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [volunteerState, setVolunteerState] = useState<Volunteer>({} as Volunteer)
  const [highlights, setHighlights] = useState<Option[]>([])
  const [validateOnBlur, setValidateOnBlur] = useState(false)
  const { setVolunteerStamp } = useRefreshStore(state => state)

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newVolunteer = { ...volunteerState, userId }
    setVolunteerState(newVolunteer);
  }, [user])


  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        if (initialState?.highlights) {
          setHighlights(arrayToOptions(JSON.parse(initialState.highlights)))
        }
        setVolunteerState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setVolunteerState({ userId: user?.id } as Volunteer)
      setHighlights([])
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setValidateOnBlur(false)
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newVolunteer = { ...volunteerState, [event.target.id]: event.target.value }
    setVolunteerState(newVolunteer);
  }

  const handleSelectStartDate = (date: Date | undefined) => {
    const newVolunteer = structuredClone(volunteerState)
    newVolunteer.startDate = date ? dateUtcToIso8601(date) : ''
    setVolunteerState(newVolunteer);
    if (validateOnBlur) {
      validateField("startDate", newVolunteer.startDate)
    }
  }

  const handleSelectEndDate = (date: Date | undefined) => {
    const newVolunteer = structuredClone(volunteerState)
    newVolunteer.endDate = date ? dateUtcToIso8601(date) : ''
    setVolunteerState(newVolunteer);
    if (validateOnBlur) {
      validateField("endDate", newVolunteer.endDate)
    }
  }

  const validateField = (field: string, value: unknown) => {
    const newErrors = { ...errors }

    const partialSchema = VolunteerBaseSchema.pick({ [field]: VolunteerBaseSchema.shape[field as keyof typeof VolunteerBaseSchema.shape] });

    // Realiza la validación con Zod
    partialSchema.parseAsync({ [field]: value })
      .then(() => {
        if (newErrors[field] !== '') {
          newErrors[field] = '';
          setErrors(newErrors)
        }
      })
      .catch((error) => {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            newErrors[err.path[0]] = err.message;
          });
        } else {
          newErrors['generic'] = error
        }
        setErrors(newErrors)
      })
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    if (!validateOnBlur) return
    const { id, name, value } = event.target;
    const field = (id) ? id : (name ? name : '')
    validateField(field, value)
  }


  async function createAsync(model: unknown) {
    const validated = await validateSchemaAsync<VolunteerCreate>(VolunteerCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<VolunteerCreate>("volunteer", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Volunteer>(VolunteerSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Volunteer>("volunteer", validated.data, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  const handleSave = async () => {
    setLoading(true)
    setValidateOnBlur(true)

    let volunteer: Volunteer | undefined = structuredClone(volunteerState)
    volunteer.highlights = JSON.stringify(optionsToArray(highlights))

    try {
      const success = (editMode === true)
        ? await editAsync(volunteer)
        : await createAsync(volunteer)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setVolunteerStamp(Date.now())
        setIsOpen(false)
        return
      }
    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado validando cambios'
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }

  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        {(editMode === true)
          ? <Button variant="outline">
            <Edit className="h-3 w-3" />
            <span className="sr-only">Editar</span>
          </Button>
          : <Button className="text-xs md:text-sm" variant="outline">
            <Plus className="mr-1 text-blue-500" />Voluntariado
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} Voluntariado</DialogTitle>
          <DialogDescription>
            Rellena la información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organization" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Organización
            </Label>
            <Input id="organization" value={volunteerState.organization} onChange={handleChange} onBlur={handleBlur} placeholder="Organización" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['organization'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['organization']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Puesto
            </Label>
            <Input id="position" value={volunteerState.position} onChange={handleChange} onBlur={handleBlur} placeholder="Tareas desempeñadas" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['position'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['position']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="url" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Url
            </Label>
            <Input id="url" value={volunteerState.url ?? ''} onChange={handleChange} onBlur={handleBlur} placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Desde
            </Label>
            <InputDate date={localIso8601ToUtcDate(volunteerState.startDate)} onSelect={handleSelectStartDate} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Hasta
            </Label>
            <InputDate date={localIso8601ToUtcDate(volunteerState.endDate)} onSelect={handleSelectEndDate} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Resumen
            </Label>
            <Textarea id="summary" value={volunteerState.summary} onChange={handleChange} onBlur={handleBlur} placeholder="Resumen" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['summary'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['summary']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="highlights" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
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
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>{(editMode === true) ? 'Guardar' : 'Crear'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}