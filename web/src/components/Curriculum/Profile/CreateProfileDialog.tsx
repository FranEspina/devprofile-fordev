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
import { ProfileCreateSchema, type ProfileCreate } from '@/Schemas/profileSchema'
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

export function CreateProfileDialog() {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useNotify()
  const { user, token } = useProfileStore(state => state)
  const { setProfileStamp } = useRefreshStore(state => state)

  const networkInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoading(false)
    setErrors({})
  }, [])

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

    const network = networkInputRef?.current?.value || ''
    const username = usernameInputRef?.current?.value || ''
    const url = urlInputRef?.current?.value || ''

    const formData = {
      userId: user.id,
      network: network,
      username: username,
      url: url,
    }

    const validated = await validateSchemaAsync<ProfileCreate>(ProfileCreateSchema, formData)
    if (!validated.success) {
      setErrors(validated.errors)
      setLoading(false)
      return
    }

    try {
      const { success, message } = await createUserSection<ProfileCreate>("profile", formData, user.id, token)
      if (success) {
        notifySuccess(message)
        setErrors({})
        setProfileStamp(Date.now())
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
      errors['generic'] = "Error inesperado creando perfil"
      setErrors(errors)
    }
    finally {
      setLoading(false)
    }


  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true} defaultOpen={isOpen} >
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" variant="outline"><Plus className="mr-1 text-blue-500" />perfil social</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => { e.preventDefault() }}>
        <DialogHeader>
          <DialogTitle>Añadir perfil público</DialogTitle>
          <DialogDescription>
            Añade un nuevo perfil público y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="network" className="text-right text-xs md:text-sm">
              Red Social
            </Label>
            <Input ref={networkInputRef} id="network" placeholder="nombre" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['network'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['network']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right text-xs md:text-sm">
              Usuario
            </Label>
            <Input ref={usernameInputRef} id="username" placeholder="username" className="col-span-3 text-xs md:text-sm" autoComplete="off" />
            {errors['username'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['username']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right text-xs md:text-sm">
              Usuario
            </Label>
            <Input ref={urlInputRef} id="url" placeholder="https://..." className="col-span-3 text-xs md:text-sm" />
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