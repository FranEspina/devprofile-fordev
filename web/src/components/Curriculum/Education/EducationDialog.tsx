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
import { type EducationCreate, EducationSchema, EducationCreateSchema, EducationBaseSchema, type Education } from '@/Schemas/educationSchema'
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
import { dateUtcToIso8601, localIso8601ToUtcDate } from '@/lib/dates'
import { InputDate } from "@/components/ui/InputDate"
import { z } from 'astro/zod'


interface EducationDialogProps {
  editMode: boolean,
  initialState?: Education
}

export function EducationDialog({ editMode = false, initialState = undefined }: EducationDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [educationState, setEducationState] = useState<Education>({} as Education)
  const [courses, setCourses] = useState<Option[]>([])
  const [validateOnBlur, setValidateOnBlur] = useState(false)
  const { setEducationStamp } = useRefreshStore(state => state)

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newEducation = { ...educationState, userId }
    setEducationState(newEducation);
  }, [user])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setValidateOnBlur(false)
  }, [isOpen])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        if (initialState.courses) {
          setCourses(JSON.parse(initialState.courses))
        }
        setEducationState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setEducationState({ userId: user?.id } as Education)
      setCourses([])
    }
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newEducation = { ...educationState, [event.target.id]: event.target.value }
    setEducationState(newEducation);
  }

  const handleSelectStartDate = (date: Date | undefined) => {
    const newEducation = structuredClone(educationState)
    newEducation.startDate = date ? dateUtcToIso8601(date) : ''
    setEducationState(newEducation);
    if (validateOnBlur) {
      validateField("startDate", newEducation.startDate)
    }
  }

  const handleSelectEndDate = (date: Date | undefined) => {
    const newEducation = structuredClone(educationState)
    newEducation.endDate = date ? dateUtcToIso8601(date) : ''
    setEducationState(newEducation);
    if (validateOnBlur) {
      validateField("endDate", newEducation.endDate)
    }
  }

  const validateField = (field: string, value: unknown) => {
    const newErrors = { ...errors }

    const partialSchema = EducationBaseSchema.pick({ [field]: EducationBaseSchema.shape[field as keyof typeof EducationBaseSchema.shape] });

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
    const validated = await validateSchemaAsync<EducationCreate>(EducationCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<EducationCreate>("education", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Education>(EducationSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Education>("education", validated.data, token)
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

    if (token === 'not-loaded')
      return

    if (!user || !token) {
      navigate('/').then(() =>
        notifyError('Usuario no autorizado')
      )
      return
    }
    let education: Education | undefined = structuredClone(educationState)
    education.courses = JSON.stringify(courses)

    try {
      const success = (editMode === true)
        ? await editAsync(education)
        : await createAsync(education)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setEducationStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Estudio
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} Estudio</DialogTitle>
          <DialogDescription>
            Rellena la información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="institution" className="text-right text-xs md:text-sm">
              Institución
            </Label>
            <Input id="institution" value={educationState.institution} onChange={handleChange} onBlur={handleBlur} placeholder="Universidad de ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['institution'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['institution']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input id="url" value={educationState.url ?? ''} onChange={handleChange} onBlur={handleBlur} placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="area" className="text-right text-xs md:text-sm">
              Área
            </Label>
            <Input id="area" value={educationState.area} onChange={handleChange} onBlur={handleBlur} placeholder="Matemáticas, Informática, ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['area'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['area']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studyType" className="text-right text-xs md:text-sm">
              Tipo
            </Label>
            <Input id="studyType" value={educationState.studyType} onChange={handleChange} onBlur={handleBlur} placeholder="Licenciado en matemáticas, Ingeniero ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['studyType'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['studyType']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Desde
            </Label>
            <InputDate date={localIso8601ToUtcDate(educationState.startDate)} onSelect={handleSelectStartDate} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Hasta
            </Label>
            <InputDate date={localIso8601ToUtcDate(educationState.endDate)} onSelect={handleSelectEndDate} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right text-xs md:text-sm">
              Calificación
            </Label>
            <Input id="score" value={educationState.score ?? ''} onChange={handleChange} onBlur={handleBlur} placeholder="p.ej: 3.5/4.0, Sobresaliente, ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['score'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['score']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courses" className="text-right text-xs md:text-sm">
              Curso(s)
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={courses} onChange={setCourses} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['courses'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['courses']}</p>}
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