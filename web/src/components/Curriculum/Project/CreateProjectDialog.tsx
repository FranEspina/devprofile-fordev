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
import { useRef, useState, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { type ProjectCreate, ProjectCreateSchema } from '@/Schemas/projectSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector';
import { dateUtcToIso8601, localIso8601ToUtcDate } from '@/lib/dates'

export function CreateProjectDialog() {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const [keywords, setKeywords] = useState<Option[]>([])
  const [roles, setRoles] = useState<Option[]>([])
  const [highlights, setHighlights] = useState<Option[]>([])


  const nameInputRef = useRef<HTMLInputElement>(null)
  const descriptioncInputRef = useRef<HTMLTextAreaElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const entityInputRef = useRef<HTMLInputElement>(null)
  const typeInputRef = useRef<HTMLInputElement>(null)

  const { setProjectStamp } = useRefreshStore(state => state)

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setStartDate('')
    setEndDate('')
    setKeywords([])
    setRoles([])
    setHighlights([])
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

    let project: ProjectCreate | undefined

    const formData = {
      userId: user?.id,
      name: nameInputRef.current?.value,
      description: descriptioncInputRef.current?.value,
      url: urlInputRef.current?.value,
      startDate: startDate,
      endDate: endDate,
      highlights: JSON.stringify(highlights),
      keywords: JSON.stringify(keywords),
      roles: JSON.stringify(roles),
      entity: entityInputRef.current?.value,
      type: typeInputRef.current?.value,
    }

    try {

      const validated = await validateSchemaAsync<ProjectCreate>(ProjectCreateSchema, formData)
      if (!validated.success) {
        setErrors(validated.errors)
        setLoading(false)
        return
      }

      project = validated.data

      setErrors({})

    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado validando cambios'
      setErrors(errors)
      setLoading(false)
    }

    try {
      if (!project) return
      const { success, message } = await createUserSection<ProjectCreate>("project", project, user.id, token)
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
      errors['generic'] = "Error inesperado creando projecto"
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" variant="outline"><Plus className="mr-1 text-blue-500" />proyecto de trabajo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Añadir proyecto de trabajo</DialogTitle>
          <DialogDescription>
            Añade un nuevo proyecto y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Proyecto
            </Label>
            <Input ref={nameInputRef} id="name" placeholder="Título del proyecto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
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
            <DatePicker date={localIso8601ToUtcDate(startDate)} onSelect={(day, selectedDay, activeModifiers, e) => setStartDate(dateUtcToIso8601(selectedDay))} />
            {errors['startDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['startDate']}</p>}

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Hasta
            </Label>
            <DatePicker date={localIso8601ToUtcDate(endDate)} onSelect={(day, selectedDay, activeModifiers, e) => setEndDate((day) ? dateUtcToIso8601(day) : '')} />
            {errors['endDate'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['endDate']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xs md:text-sm">
              Descripción
            </Label>
            <Textarea ref={descriptioncInputRef} id="description" placeholder="Descripción del proyecto de trabajo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['description'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['description']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entity" className="text-right text-xs md:text-sm">
              Entidad
            </Label>
            <Input ref={entityInputRef} id="entity" placeholder="entidad, empresa, ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['entity'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['entity']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-xs md:text-sm">
              Tipo
            </Label>
            <Input ref={typeInputRef} id="type" placeholder="desarrollo, conferencia, charla,..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['type'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['type']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="highlights" className="text-right text-xs md:text-sm">
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
        <DialogFooter className="flex flex-row items-center gap-2 justify-end">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}