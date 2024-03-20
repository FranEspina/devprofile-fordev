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
import { type AwardCreate, AwardSchema, AwardCreateSchema, type Award } from '@/Schemas/awardSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection, updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import { type ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from '@/components/ui/DatePicker'
import { type SelectSingleEventHandler } from 'react-day-picker'
import { dateUtcToIso8601, localIso8601ToUtcDate } from '@/lib/dates'
import { InputDate } from "@/components/ui/InputDate"

interface AwardDialogProps {
  editMode: boolean,
  initialState?: Award
}

export function AwardDialog({ editMode = false, initialState = undefined }: AwardDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [awardState, setAwardState] = useState<Award>({} as Award)

  const { setAwardStamp } = useRefreshStore(state => state)

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [])

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newAward = { ...awardState, userId }
    setAwardState(newAward);
  }, [user])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setAwardState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
  }, [])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setAwardState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setAwardState({ userId: user?.id } as Award)
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAward = { ...awardState, [event.target.id]: event.target.value }
    setAwardState(newAward);
  }

  const handleSelectDate = (date: Date | undefined) => {
    const newAward = structuredClone(awardState)
    newAward.date = date ? dateUtcToIso8601(date) : ''
    setAwardState(newAward);
  }

  async function createAsync(model: unknown) {
    const validated = await validateSchemaAsync<AwardCreate>(AwardCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<AwardCreate>("award", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Award>(AwardSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Award>("award", validated.data, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
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

    try {
      const success = (editMode === true)
        ? await editAsync(awardState)
        : await createAsync(awardState)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setAwardStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Logro
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} Logro</DialogTitle>
          <DialogDescription>
            Rellena la información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-xs md:text-sm">
              Logro
            </Label>
            <Input id="title" value={awardState.title} onChange={handleChange} placeholder="Logro" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['title'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['title']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Fecha
            </Label>
            <InputDate date={localIso8601ToUtcDate(awardState.date)} onSelect={handleSelectDate} />
            {errors['date'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['date']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="awarder" className="text-right text-xs md:text-sm">
              Entidad
            </Label>
            <Input id="awarder" value={awardState.awarder} onChange={handleChange} placeholder="Entidad relacionada" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['awarder'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['awarder']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right text-xs md:text-sm">
              Resumen
            </Label>
            <Textarea id="summary" value={awardState.summary} onChange={handleChange} placeholder="Resumen de la logro" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['summary'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['summary']}</p>}
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