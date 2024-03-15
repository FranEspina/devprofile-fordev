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
import { type Project, ProjectSchema } from '@/Schemas/projectSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector';

export function EditProjectDialog({ project }: { project: Project }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const { setProjectStamp } = useRefreshStore(state => state)

  const [projectState, setProjectState] = useState(project)

  const [keywords, setKeywords] = useState<Option[]>([])
  const [roles, setRoles] = useState<Option[]>([])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    //TODO: FIX en servidor que devuelva fechas
    project.startDate = new Date(project.startDate)
    if (project.endDate) {
      project.endDate = new Date(project.endDate)
    }
    else {
      project.endDate = undefined
    }
    setProjectState(project);

    if (project.keywords) {
      setKeywords(JSON.parse(project.keywords))
    }
    if (project.roles) {
      setRoles(JSON.parse(project.roles))
    }

  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newProject = { ...projectState, [event.target.id]: event.target.value }
    setProjectState(newProject);
  }

  const handleSelectStart: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newProject = structuredClone(projectState)
    newProject.startDate = selectedDay
    setProjectState(newProject);
  }

  const handleSelectEnd: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newProject = structuredClone(projectState)
    newProject.endDate = day
    setProjectState(newProject);
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

    let project: Project | undefined = structuredClone(projectState)
    project.keywords = JSON.stringify(keywords)
    project.roles = JSON.stringify(roles)

    try {

      const validated = await validateSchemaAsync<Project>(ProjectSchema, project)
      if (!validated.success) {
        console.log(errors)
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
      var { success, message, data } = await updateUserSection<Project>("project", project, token)
      console.log(success)
      console.log(message)
      if (success) {
        notifySuccess(message)
        setErrors({})
        setProjectStamp(Date.now())
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
      errors['generic'] = "Error inesperado actualizando proyecto"
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
          <DialogTitle>Editar proyecto de trabajo</DialogTitle>
          <DialogDescription>
            Modifica proyecto y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Proyecto
            </Label>
            <Input id="name" value={projectState.name} onChange={handleChange} placeholder="Título del proyecto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input value={projectState.url} onChange={handleChange} id="url" placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Desde
            </Label>
            <DatePicker date={projectState.startDate} onSelect={handleSelectStart} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Hasta
            </Label>
            <DatePicker date={projectState.endDate} onSelect={handleSelectEnd} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xs md:text-sm">
              Descripción
            </Label>
            <Textarea value={projectState.description} onChange={handleChange} id="description" placeholder="Descripción del proyecto de trabajo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entity" className="text-right text-xs md:text-sm">
              Entidad
            </Label>
            <Input value={projectState.entity} onChange={handleChange} id="entity" placeholder="entidad, empresa, ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['entity'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['entity']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-xs md:text-sm">
              Tipo
            </Label>
            <Input value={projectState.type} onChange={handleChange} id="type" placeholder="desarrollo, conferencia, charla,..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['type'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['type']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="highlights" className="text-right text-xs md:text-sm">
              Lo más destacable
            </Label>
            <Input value={projectState.highlights} onChange={handleChange} id="highlights" placeholder="Descripción de lo más destacable" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['highlights'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['highlights']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right text-xs md:text-sm">
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
            <Label htmlFor="roles" className="text-right text-xs md:text-sm">
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
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}