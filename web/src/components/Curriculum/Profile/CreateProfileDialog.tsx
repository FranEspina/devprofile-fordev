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
import { ProfileCreateSchema } from '@/Schemas/profileSchema'
import { useEffect, useRef, useState } from "react"
import { z } from 'astro/zod'
import { useNotify } from '@/hooks/useNotify'
import { createProfileNetwork } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useRefreshStore } from '@/store/refreshStore'
import { Plus } from "lucide-react"

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

    const parsed = await ProfileCreateSchema.safeParseAsync(formData)
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
      var { success, message, data } = await createProfileNetwork(formData, user.id, token)
      console.log(success)
      console.log(message)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal defaultOpen={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-1 text-blue-500" />perfil social</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir perfil público</DialogTitle>
          <DialogDescription>
            Añade un nuevo perfil público y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="network" className="text-right">
              Red Social
            </Label>
            <Input ref={networkInputRef} id="network" placeholder="nombre" className="col-span-3" autoComplete="off" />
            {errors['network'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['network']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Usuario
            </Label>
            <Input ref={usernameInputRef} id="username" placeholder="username" className="col-span-3" autoComplete="off" />
            {errors['username'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['username']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Usuario
            </Label>
            <Input ref={urlInputRef} id="url" placeholder="https://..." className="col-span-3" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <Button variant="outline" onClick={handleCreate} disabled={loading}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}