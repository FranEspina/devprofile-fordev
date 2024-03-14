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
import { type LocationCreate, LocationSchema, LocationCreateSchema, type Location } from '@/Schemas/locationSchema'
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useNotify } from '@/hooks/useNotify'
import { validateSchemaAsync } from '@/lib/validations'
import { createUserSection, updateUserSection } from '@/services/apiService'
import { useRefreshStore } from '@/store/refreshStore'
import { LoadIndicator } from '@/components/LoadIndicator'
import { type ChangeEvent } from "react"

interface LocationDialogProps {
  editMode: boolean,
  initialState?: Location
}

export function LocationDialog({ editMode = false, initialState = undefined }: LocationDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>()
  const { user, token } = useProfileStore(state => state)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { notifyError, notifySuccess } = useNotify()
  const [locationState, setLocationState] = useState<Location>({
    id: -1,
    address: '',
    city: '',
    countryCode: '',
    postalCode: '',
    userId: -1
  })

  const { setLocationStamp } = useRefreshStore(state => state)

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setLocationState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
  }, [])

  useEffect(() => {
    if (editMode === true) {
      if (initialState) {
        setLocationState(initialState)
      } else {
        throw new Error("El estado inicial es necesario en modo edición del componente")
      }
    }
  }, [isOpen])

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [isOpen])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newLocation = { ...locationState, [event.target.id]: event.target.value }
    setLocationState(newLocation);
  }

  async function createAsync(formData: unknown) {
    const validated = await validateSchemaAsync<LocationCreate>(LocationCreateSchema, formData)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await createUserSection<LocationCreate>("location", validated.data, user?.id || 0, token)
    if (!success) {
      const errors: { [key: string]: string } = {}
      errors['generic'] = 'Error inesperado guardando cambios'
      setErrors(errors)
    }
    return success
  }

  async function editAsync(formData: unknown) {
    const validated = await validateSchemaAsync<Location>(LocationSchema, formData)
    if (!validated.success || !validated.data) {
      setErrors(validated.errors)
      return false
    }
    const { success } = await updateUserSection<Location>("location", validated.data, token)
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
        ? await editAsync(locationState)
        : await createAsync(locationState)

      if (success) {
        notifySuccess('Datos actualizados correctamente')
        setErrors({})
        setLocationStamp(Date.now())
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
            <Plus className="mr-1 text-blue-500" />Dirección
          </Button>
        }
      </DialogTrigger>
      <DialogContent className="max-w-[75%]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Dirección</DialogTitle>
          <DialogDescription>
            Rellena la información y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right text-xs md:text-sm">
              Dirección
            </Label>
            <Input id="address" value={locationState.address} onChange={handleChange} placeholder="Dirección" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['address'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['address']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postalCode" className="text-right text-xs md:text-sm">
              C.Postal
            </Label>
            <Input id="postalCode" value={locationState.postalCode} onChange={handleChange} placeholder="Código postal" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['postalCode'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['postalCode']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right text-xs md:text-sm">
              Ciudad
            </Label>
            <Input id="city" value={locationState.city} onChange={handleChange} placeholder="Ciudad" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['city'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['city']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="countryCode" className="text-right text-xs md:text-sm">
              Pais
            </Label>
            <Input id="countryCode" value={locationState.countryCode} onChange={handleChange} placeholder="por ejemplo: ES, US, IT, ..." className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['countryCode'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['countryCode']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right text-xs md:text-sm">
              Region
            </Label>
            <Input id="region" value={locationState.region} onChange={handleChange} placeholder="Región" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['region'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['region']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button className="text-xs md:text-sm" variant="outline" type="submit" onClick={handleSave} disabled={loading}>{(editMode === true) ? 'Guardar' : 'Crear'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}