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
import { ProfileSchema, type Profile } from '@/Schemas/profileSchema'
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { z } from 'astro/zod'
import type { ClassDictionary } from "clsx"
import { useNotify } from '@/hooks/useNotify'
import { updateUserSection } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useRefreshStore } from '@/store/refreshStore'
import { Edit } from 'lucide-react'
import { LoadIndicator } from '@/components/LoadIndicator'

export function EditProfileDialog({ profile }: { profile: Profile }) {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useNotify()
  const { user, token } = useProfileStore(state => state)
  const { setProfileStamp } = useRefreshStore(state => state)
  const [profileState, setProfileState] = useState(profile)

  const networkInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoading(false)
    setErrors({})
    setProfileState(profile)
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

  const handleChangeNetwork = (event: ChangeEvent<HTMLInputElement>) => {
    const newProfile = structuredClone(profileState)
    newProfile.network = event.target.value
    setProfileState(newProfile);
  };
  const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const newProfile = structuredClone(profileState)
    newProfile.username = event.target.value
    setProfileState(newProfile);
  };
  const handleChangeUrl = (event: ChangeEvent<HTMLInputElement>) => {
    const newProfile = structuredClone(profileState)
    newProfile.url = event.target.value
    setProfileState(newProfile);
  };

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {

    setLoading(true)
    e.preventDefault()

    const network = networkInputRef?.current?.value || ''
    const username = usernameInputRef?.current?.value || ''
    const url = urlInputRef?.current?.value || ''

    const formData = {
      id: profile.id,
      userId: user.id,
      network: network,
      username: username,
      url: url,
    }

    const parsed = await ProfileSchema.safeParseAsync(formData)
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
      var { success, message, data } = await updateUserSection<Profile>("profile", formData, token)
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
        <Button variant="outline">
          <Edit className="h-3 w-3" />
          <span className="sr-only">Editar perfil</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil público</DialogTitle>
          <DialogDescription>
            Modifica y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="network" className="text-right">
              Red Social
            </Label>
            <Input ref={networkInputRef} value={profileState.network} onChange={handleChangeNetwork} id="network" placeholder="nombre" className="col-span-3" autoComplete="off" />
            {errors['network'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['network']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Usuario
            </Label>
            <Input ref={usernameInputRef} value={profileState.username} onChange={handleChangeUsername} id="username" placeholder="username" className="col-span-3" autoComplete="off" />
            {errors['username'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['username']}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Usuario
            </Label>
            <Input ref={urlInputRef} value={profileState.url} onChange={handleChangeUrl} id="url" placeholder="https://..." className="col-span-3" />
            {errors['url'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['url']}</p>}
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          {errors['generic'] && <p className="col-start-2 col-span-3 text-blue-500 text-xs">{errors['generic']}</p>}
          <LoadIndicator loading={loading} />
          <Button variant="outline" onClick={handleEdit} disabled={loading}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}