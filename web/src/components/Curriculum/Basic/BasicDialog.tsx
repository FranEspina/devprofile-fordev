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
import { type BasicCreate, BasicSchema, BasicCreateSchema, type Basic } from '@/Schemas/basicSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection, updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import { type ChangeEvent } from "react"
import { z } from 'astro/zod'
import { Textarea } from '@/components/ui/textarea'

interface BasicDialogProps {
  editMode: boolean,
  initialState?: Basic
}

export function BasicDialog({ editMode = false, initialState = undefined }: BasicDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [basicState, setBasicState] = useState<Basic>({} as Basic)
  const [validateOnBlur, setValidateOnBlur] = useState(false)

  const { setBasicStamp } = useRefreshStore(state => state)

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newBasic = { ...basicState, userId }
    setBasicState(newBasic);
  }, [user])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setBasicState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setBasicState({ userId: user?.id } as Basic)
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setValidateOnBlur(false)
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newBasic = { ...basicState, [event.target.id]: event.target.value }
    setBasicState(newBasic);
  }

  const validateField = (field: string, value: unknown) => {
    const newErrors = { ...errors }

    const partialSchema = BasicSchema.pick({ [field]: BasicSchema.shape[field as keyof typeof BasicSchema.shape] });

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
    const validated = await validateSchemaAsync<BasicCreate>(BasicCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<BasicCreate>("basic", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Basic>(BasicSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Basic>("basic", validated.data, token)
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

    try {
      const success = (editMode === true)
        ? await editAsync(basicState)
        : await createAsync(basicState)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setBasicStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Datos básicos
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} datos básicos</DialogTitle>
          <DialogDescription>
            Modifica información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Nombre
            </Label>
            <Input value={basicState.name} onChange={handleChange} onBlur={handleBlur} id="name" placeholder="Nombre público" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Resumen
            </Label>
            <Textarea value={basicState.label} onChange={handleChange} onBlur={handleBlur} id="label" placeholder="Breve resumen o frase destacable ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['label'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['label']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Email
            </Label>
            <Input value={basicState.email} onChange={handleChange} onBlur={handleBlur} id="email" placeholder="correo@electronico.es" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['email'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['email']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Teléfono
            </Label>
            <Input value={basicState.phone} onChange={handleChange} onBlur={handleBlur} id="phone" placeholder="Con el formato que quieras ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['phone'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['phone']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Imagen
            </Label>
            <Input value={basicState.image} onChange={handleChange} onBlur={handleBlur} id="image" placeholder="http://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['image'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['image']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Url
            </Label>
            <Input value={basicState.url} onChange={handleChange} onBlur={handleBlur} id="url" placeholder="http://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm data-[optional]:text-gray-500 data-[optional]:dark:text-gray-400 ">
              Resumen
            </Label>
            <Textarea value={basicState.summary} onChange={handleChange} onBlur={handleBlur} id="summary" placeholder="Un par de párrafos sobre tí ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['summary'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['summary']}</p>}
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