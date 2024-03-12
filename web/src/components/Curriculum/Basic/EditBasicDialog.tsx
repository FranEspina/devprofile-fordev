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
import { type Basic, BasicSchema } from '@/Schemas/basicSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { LoadIndicator } from '@/components/LoadIndicator'
import MultipleSelector, { type Option } from '@/components/ui/multiple-selector';

export function EditBasicDialog({ basic }: { basic: Basic }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const { setBasicStamp } = useRefreshStore(state => state)
  const [basicState, setBasicState] = useState(basic)

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setBasicState(basic)
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newBasic = { ...basicState, [event.target.id]: event.target.value }
    setBasicState(newBasic);
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

    let basic: Basic | undefined = structuredClone(basicState)

    try {

      const validated = await validateSchemaAsync<Basic>(BasicSchema, basic)
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
      var { success, message, data } = await updateUserSection<Basic>("basic", basic, token)
      console.log(success)
      console.log(message)
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
      errors['generic'] = "Error inesperado actualizando información"
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
          <DialogTitle>Editar información de trabajo</DialogTitle>
          <DialogDescription>
            Modifica información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Nombre
            </Label>
            <Input value={basicState.name} onChange={handleChange} id="name" placeholder="Título del proyecto" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea value={basicState.label} onChange={handleChange} id="label" placeholder="Frase destacable ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['label'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['label']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-xs md:text-sm">
              Email
            </Label>
            <Input value={basicState.email} onChange={handleChange} id="email" placeholder="correo@electronico.es" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['email'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['email']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-xs md:text-sm">
              Teléfono
            </Label>
            <Input value={basicState.phone} onChange={handleChange} id="phone" placeholder="Con el formato que quieras ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['phone'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['phone']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right text-xs md:text-sm">
              Imagen
            </Label>
            <Input value={basicState.image} onChange={handleChange} id="image" placeholder="http://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['image'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['image']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input value={basicState.url} onChange={handleChange} id="url" placeholder="http://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea value={basicState.summary} onChange={handleChange} id="summary" placeholder="Un par de párrafos sobre tí ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['summary'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['summary']}</p>}
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