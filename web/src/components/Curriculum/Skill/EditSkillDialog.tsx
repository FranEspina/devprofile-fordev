import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SkillSchema, type Skill } from '@/Schemas/skillSchema'
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { z } from 'astro/zod'
import type { ClassDictionary } from "clsx"
import { useNotify } from '@/hooks/useNotify'
import { updateUserSection } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useRefreshStore } from '@/store/refreshStore'
import { Edit } from 'lucide-react'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector'

export function EditSkillDialog({ skill }: { skill: Skill }) {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useNotify()
  const { user, token } = useProfileStore(state => state)
  const { setSkillStamp } = useRefreshStore(state => state)
  const [skillState, setSkillState] = useState(skill)

  const [keywords, setKeywords] = useState<Option[]>([])

  const nameInputRef = useRef<HTMLInputElement>(null)
  const levelInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setKeywords([])
    setSkillState(skill)
    if (skill.keywords) {
      setKeywords(JSON.parse(skill.keywords))
    }
  }, [isOpen])

  if (token === 'not-loaded') {
    return
  }

  if (!user || !token) {
    navigate('/').then(() =>
      notifySuccess('Usuario no autorizado')
    )
    return
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSkill = { ...skillState, [event.target.id]: event.target.value }
    setSkillState(newSkill);
  };

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {

    setLoading(true)
    e.preventDefault()

    const name = nameInputRef?.current?.value || ''
    const level = levelInputRef?.current?.value || ''

    const formData = {
      id: skill.id,
      userId: user.id,
      name: name,
      level: level,
      keywords: JSON.stringify(keywords),
    }

    const parsed = await SkillSchema.safeParseAsync(formData)
    if (!parsed.success) {
      const errors: { [key: string]: string } = {}
      if (parsed.error instanceof z.ZodError) {
        parsed.error.errors.forEach((err) => {
          if (!errors[err.path[0]]) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors['generic'] = parsed.error
      }
      setErrors(errors)
      setLoading(false)
      return
    }

    try {
      var { success, message, data } = await updateUserSection<Skill>("skill", formData, token)
      console.log(success)
      console.log(message)
      if (success) {
        notifySuccess(message)
        setErrors({})
        setSkillStamp(Date.now())
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
      errors['generic'] = "Error inesperado creando competencia"
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
          <span className="sr-only">Editar competencia</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] " onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Editar competencia público</DialogTitle>
          <DialogDescription>
            Modifica y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Competencia
            </Label>
            <Input ref={nameInputRef} value={skillState.name} onChange={handleChange} id="name" placeholder="Competencia" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right text-xs md:text-sm">
              Nivel
            </Label>
            <Input ref={levelInputRef} value={skillState.level} onChange={handleChange} id="level" placeholder="Nivel" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['level'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['level']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right text-xs md:text-s">
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
          <Button className="text-xs md:text-sm" variant="outline" onClick={handleEdit} disabled={loading}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}