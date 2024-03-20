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
import { type ReferenceCreate, ReferenceSchema, ReferenceCreateSchema, type Reference } from '@/Schemas/referenceSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection, updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import { type ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { z } from 'astro/zod'
import { InterestSchema } from "@/Schemas/interestSchema"

interface ReferenceDialogProps {
  editMode: boolean,
  initialState?: Reference
}

export function ReferenceDialog({ editMode = false, initialState = undefined }: ReferenceDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [referenceState, setReferenceState] = useState<Reference>({} as Reference)
  const [validateOnBlur, setValidateOnBlur] = useState(false)

  const { setReferenceStamp } = useRefreshStore(state => state)


  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newReference = { ...referenceState, userId }
    setReferenceState(newReference);
  }, [user])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setReferenceState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setReferenceState({ userId: user?.id } as Reference)
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setValidateOnBlur(false)
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newReference = { ...referenceState, [event.target.id]: event.target.value }
    setReferenceState(newReference);
  }

  const validateField = (field: string, value: unknown) => {
    const newErrors = { ...errors }

    const partialSchema = InterestSchema.pick({ [field]: InterestSchema.shape[field as keyof typeof InterestSchema.shape] });

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
    const validated = await validateSchemaAsync<ReferenceCreate>(ReferenceCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<ReferenceCreate>("reference", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Reference>(ReferenceSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Reference>("reference", validated.data, token)
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

    try {
      const success = (editMode === true)
        ? await editAsync(referenceState)
        : await createAsync(referenceState)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setReferenceStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Referencia
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} Referencia</DialogTitle>
          <DialogDescription>
            Rellena la información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Autor
            </Label>
            <Input id="name" value={referenceState.name} onChange={handleChange} onBlur={handleBlur} placeholder="Nombre completo" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reference" className="text-right text-xs md:text-sm">
              Referencia
            </Label>
            <Textarea id="reference" value={referenceState.reference} onChange={handleChange} onBlur={handleBlur} placeholder="Referencia del autor" className="col-span-3 text-xs md:text-sm h-52" autoComplete="off" />
            {errors['reference'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['reference']}</p>}
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