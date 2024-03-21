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
import { type ProjectCreate, ProjectSchema, ProjectCreateSchema, type Project, ProjectBaseSchema } from '@/Schemas/projectSchema'
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

interface ProjectDialogProps {
  editMode: boolean,
  initialState?: Project
}

export function ProjectDialog({ editMode = false, initialState = undefined }: ProjectDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [projectState, setProjectState] = useState<Project>({} as Project)
  const [highlights, setHighlights] = useState<Option[]>([])
  const [roles, setRoles] = useState<Option[]>([])
  const [keywords, setKeywords] = useState<Option[]>([])

  const [validateOnBlur, setValidateOnBlur] = useState(false)
  const { setProjectStamp } = useRefreshStore(state => state)

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newProject = { ...projectState, userId }
    setProjectState(newProject);
  }, [user])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        if (initialState?.highlights) {
          setHighlights(JSON.parse(initialState.highlights))
        }
        if (initialState?.roles) {
          setRoles(JSON.parse(initialState.roles))
        }
        if (initialState?.keywords) {
          setKeywords(JSON.parse(initialState.keywords))
        }
        setProjectState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setProjectState({ userId: user?.id } as Project)
      setHighlights([])
      setRoles([])
      setKeywords([])
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setValidateOnBlur(false)
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newProject = { ...projectState, [event.target.id]: event.target.value }
    setProjectState(newProject);
  }

  const handleSelectStartDate = (date: Date | undefined) => {
    const newProject = structuredClone(projectState)
    newProject.startDate = date ? dateUtcToIso8601(date) : ''
    setProjectState(newProject);
    if (validateOnBlur) {
      validateField("startDate", newProject.startDate)
    }
  }

  const handleSelectEndDate = (date: Date | undefined) => {
    const newProject = structuredClone(projectState)
    newProject.endDate = date ? dateUtcToIso8601(date) : ''
    setProjectState(newProject);
    if (validateOnBlur) {
      validateField("endDate", newProject.endDate)
    }
  }

  const validateField = (field: string, value: unknown) => {
    const newErrors = { ...errors }

    const partialSchema = ProjectBaseSchema.pick({ [field]: ProjectBaseSchema.shape[field as keyof typeof ProjectBaseSchema.shape] });

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
    const validated = await validateSchemaAsync<ProjectCreate>(ProjectCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<ProjectCreate>("project", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Project>(ProjectSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Project>("project", validated.data, token)
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

    let project: Project | undefined = structuredClone(projectState)
    project.highlights = JSON.stringify(highlights)
    project.roles = JSON.stringify(roles)
    project.keywords = JSON.stringify(keywords)

    try {
      const success = (editMode === true)
        ? await editAsync(project)
        : await createAsync(project)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setProjectStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Proyecto
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} proyecto</DialogTitle>
          <DialogDescription>
            Modifica proyecto y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Proyecto
            </Label>
            <Input id="name" value={projectState.name} onChange={handleChange} onBlur={handleBlur} placeholder="Título del proyecto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="url" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Url
            </Label>
            <Input value={projectState.url ?? ''} onChange={handleChange} onBlur={handleBlur} id="url" placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Desde
            </Label>
            <InputDate date={localIso8601ToUtcDate(projectState.startDate)} onSelect={handleSelectStartDate} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Hasta
            </Label>
            <InputDate date={localIso8601ToUtcDate(projectState.endDate)} onSelect={handleSelectEndDate} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Descripción
            </Label>
            <Textarea value={projectState.description} onChange={handleChange} onBlur={handleBlur} id="description" placeholder="Descripción del proyecto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="entity" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Entidad
            </Label>
            <Input value={projectState.entity} onChange={handleChange} onBlur={handleBlur} id="entity" placeholder="entidad, empresa, ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['entity'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['entity']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="type" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Tipo
            </Label>
            <Input value={projectState.type} onChange={handleChange} onBlur={handleBlur} id="type" placeholder="desarrollo, conferencia, charla,..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['type'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['type']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="highlights" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Lo más destacable
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={highlights} onChange={setHighlights} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['highlights'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['highlights']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="keywords" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Palabra(s) clave
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={keywords} onChange={setKeywords} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['keywords'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['keywords']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="roles" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Rol(es)
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={roles} onChange={setRoles} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['roles'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['roles']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>{(editMode === true) ? 'Guardar' : 'Crear'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}