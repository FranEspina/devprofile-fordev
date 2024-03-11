import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SkillCreateSchema, type SkillCreate } from '@/Schemas/skillSchema'
import { useEffect, useRef, useState } from "react"
import { z } from 'astro/zod'
import { useNotify } from '@/hooks/useNotify'
import { createUserSection } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useRefreshStore } from '@/store/refreshStore'
import { Plus } from "lucide-react"
import { validateSchemaAsync } from '@/lib/validations'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector'

export function CreateSkillDialog() {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useNotify()
  const { user, token } = useProfileStore(state => state)
  const { setSkillStamp } = useRefreshStore(state => state)
  const [keywords, setKeywords] = useState<Option[]>([])

  const nameInputRef = useRef<HTMLInputElement>(null)
  const levelInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setKeywords([])
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

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {

    setLoading(true)
    e.preventDefault()

    const name = nameInputRef?.current?.value || ''
    const level = levelInputRef?.current?.value || ''

    const formData = {
      userId: user.id,
      name: name,
      level: level,
      keywords: JSON.stringify(keywords),
    }

    const validated = await validateSchemaAsync<SkillCreate>(SkillCreateSchema, formData)
    if (!validated.success) {
      setErrors(validated.errors)
      setLoading(false)
      return
    }

    try {
      const { success, message } = await createUserSection<SkillCreate>("skill", formData, user.id, token)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true} defaultOpen={isOpen} >
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" variant="outline"><Plus className="mr-1 text-blue-500" />competencia</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Añadir competencia</DialogTitle>
          <DialogDescription>
            Añade un nueva competencia y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Competencia
            </Label>
            <Input ref={nameInputRef} id="name" placeholder="compentencia" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right text-xs md:text-sm">
              Nivel
            </Label>
            <Input ref={levelInputRef} id="level" placeholder="nivel" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['level'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['level']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right text-xs md:text-sm">
              Palabra(s) clave
            </Label>
            <div className="col-span-3 text-xs md:text-sm">
              <MultipleSelector value={keywords} onChange={setKeywords} placeholder="escriba y pulse ENTER"
                creatable
              />
            </div>
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" onClick={handleCreate} disabled={loading}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}