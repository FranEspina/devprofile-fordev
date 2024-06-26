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
import { type SkillCreate, SkillSchema, SkillCreateSchema, type Skill } from '@/Schemas/skillSchema'
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection, updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import { type ChangeEvent } from "react"
import { z } from 'astro/zod'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector'
import { arrayToOptions, optionsToArray } from '@/lib/selectOption'

interface SkillDialogProps {
  editMode: boolean,
  initialState?: Skill
}

export function SkillDialog({ editMode = false, initialState = undefined }: SkillDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [skillState, setSkillState] = useState<Skill>({} as Skill)
  const [keywords, setKeywords] = useState<Option[]>([])
  const [validateOnBlur, setValidateOnBlur] = useState(false)

  const { setSkillStamp } = useRefreshStore(state => state)

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newSkill = { ...skillState, userId }
    setSkillState(newSkill);
  }, [user])

  useEffect(() => {
    if (editMode === true) {
      if (skillState.keywords) {
        setKeywords(arrayToOptions(JSON.parse(skillState.keywords)))
      }
      if (initialState) {
        setSkillState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setSkillState({ userId: user?.id } as Skill)
      setKeywords([])
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setValidateOnBlur(false)
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSkill = { ...skillState, [event.target.id]: event.target.value }
    setSkillState(newSkill);
  }

  const validateField = (field: string, value: unknown) => {
    const newErrors = { ...errors }

    const partialSchema = SkillSchema.pick({ [field]: SkillSchema.shape[field as keyof typeof SkillSchema.shape] });

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
    const validated = await validateSchemaAsync<SkillCreate>(SkillCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<SkillCreate>("skill", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Skill>(SkillSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Skill>("skill", validated.data, token)
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

    let skill: Skill | undefined = structuredClone(skillState)
    skill.keywords = JSON.stringify(optionsToArray(keywords))

    try {
      const success = (editMode === true)
        ? await editAsync(skill)
        : await createAsync(skill)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setSkillStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Competencia
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] " onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Editar competencia</DialogTitle>
          <DialogDescription>
            Modifica y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Competencia
            </Label>
            <Input value={skillState.name} onChange={handleChange} onBlur={handleBlur} id="name" placeholder="Competencia" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Nivel
            </Label>
            <Input value={skillState.level} onChange={handleChange} onBlur={handleBlur} id="level" placeholder="Nivel" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['level'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['level']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label data-optional htmlFor="keywords" className="text-right text-xs md:text-sm  data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Palabra(s) clave
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={keywords} onChange={setKeywords} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['keywords'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['keywords']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" onClick={handleSave} disabled={loading}>{(editMode === true) ? 'Guardar' : 'Crear'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}