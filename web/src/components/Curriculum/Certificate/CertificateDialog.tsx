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
import { type CertificateCreate, CertificateSchema, CertificateCreateSchema, type Certificate } from '@/Schemas/certificateSchema'
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


interface CertificateDialogProps {
  editMode: boolean,
  initialState?: Certificate
}

export function CertificateDialog({ editMode = false, initialState = undefined }: CertificateDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [certificateState, setCertificateState] = useState<Certificate>({} as Certificate)

  const { setCertificateStamp } = useRefreshStore(state => state)

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [])

  useEffect(() => {
    const userId = (user) ? user.id : -1
    const newCertificate = { ...certificateState, userId }
    setCertificateState(newCertificate);
  }, [user])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setCertificateState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
  }, [])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setCertificateState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
    else {
      setCertificateState({ userId: user?.id } as Certificate)
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newCertificate = { ...certificateState, [event.target.id]: event.target.value }
    setCertificateState(newCertificate);
  }

  const handleSelectDate: SelectSingleEventHandler = (day, selectedDay, activeModifiers, e) => {
    const newCertificate = structuredClone(certificateState)
    newCertificate.date = dateUtcToIso8601(selectedDay)
    console.log(newCertificate)
    setCertificateState(newCertificate);
  }

  async function createAsync(model: unknown) {
    const validated = await validateSchemaAsync<CertificateCreate>(CertificateCreateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<CertificateCreate>("certificate", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(model: unknown) {
    const validated = await validateSchemaAsync<Certificate>(CertificateSchema, model)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Certificate>("certificate", validated.data, token)
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
        ? await editAsync(certificateState)
        : await createAsync(certificateState)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setCertificateStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Certificado
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>{(editMode === true) ? 'Editar' : 'Añadir'} Certificado</DialogTitle>
          <DialogDescription>
            Rellena la información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-xs md:text-sm">
              Nombre
            </Label>
            <Input id="name" value={certificateState.name} onChange={handleChange} placeholder="Nombre certificado" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['name'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['name']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs md:text-sm">
              Fecha
            </Label>
            <DatePicker date={localIso8601ToUtcDate(certificateState.date)} onSelect={handleSelectDate} />
            {errors['date'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['date']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-xs md:text-sm">
              Url
            </Label>
            <Input id="url" value={certificateState.url} onChange={handleChange} placeholder="https://..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issuer" className="text-right text-xs md:text-sm">
              Entidad
            </Label>
            <Input id="issuer" value={certificateState.issuer} onChange={handleChange} placeholder="Entidad certificadora" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['issuer'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['issuer']}</p>}
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