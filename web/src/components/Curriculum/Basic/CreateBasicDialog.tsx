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
import { type BasicCreate, BasicCreateSchema } from '@/Schemas/basicSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector';



export function CreateBasicDialog() {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()

  const nameInputRef = useRef<HTMLInputElement>(null)
  const labelInputRef = useRef<HTMLTextAreaElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const summaryInputRef = useRef<HTMLTextAreaElement>(null)

  const { setBasicStamp } = useRefreshStore(state => state)

  useEffect(() => {
    setLoading(false)
    setErrors({})
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

    let basic: BasicCreate | undefined

    const formData = {
      userId: user?.id,
      name: nameInputRef.current?.value,
      label: labelInputRef.current?.value,
      email: emailInputRef.current?.value,
      phone: phoneInputRef.current?.value,
      image: imageInputRef.current?.value,
      url: urlInputRef.current?.value,
      summary: summaryInputRef.current?.value,
    }

    try {

      const validated = await validateSchemaAsync<BasicCreate>(BasicCreateSchema, formData)
      if (!validated.success) {
        setErrors(validated.errors)
        setLoading(false)
        return
      }

      basic = validated.data

      setErrors({})

    } catch (error) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado validando cambios'
      setErrors(errors)
      setLoading(false)
    }

    try {
      if (!basic) return
      const { success, message } = await createUserSection<BasicCreate>("basic", basic, user.id, token)
      if (success) {
        notifySuccess(message)
        setErrors({})
        setBasicStamp(Date.now())
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
      errors['generic'] = "Error inesperado creando basico"
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" variant="outline"><Plus className="mr-1 text-blue-500" />datos básicos</Button>
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
              Nombre
            </Label>
            <Input ref={nameInputRef} id="name" placeholder="Nombre completo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea ref={labelInputRef} id="summary" placeholder="Frase destacable ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['label'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['label']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-xs md:text-sm">
              Email
            </Label>
            <Input ref={emailInputRef} id="email" placeholder="correo@electronico.es" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['email'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['email']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-xs md:text-sm">
              Teléfono
            </Label>
            <Input ref={phoneInputRef} id="phone" placeholder="Con el formato que quieras ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['phone'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['phone']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right text-xs md:text-sm">
              Imagen
            </Label>
            <Input ref={imageInputRef} id="image" placeholder="http://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['image'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['image']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input ref={urlInputRef} id="url" placeholder="http://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea ref={summaryInputRef} id="summary" placeholder="Un par de párrafos sobre tí ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['summary'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['summary']}</p>}
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