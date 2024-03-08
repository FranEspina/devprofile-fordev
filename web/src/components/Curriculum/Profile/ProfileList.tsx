import { useEffect, useState, useRef } from "react"
import type { Profile } from '@/Schemas/profileSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserProfiles, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { EditProfileDialog } from '@/components/Curriculum/Profile/EditProfileDialog'
import { LoadIndicator } from '@/components/LoadIndicator'
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function ProfileList() {

  const [profiles, setProfiles] = useState<Profile[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { profileStamp, setProfileStamp } = useRefreshStore(state => state)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const deleteRef = useRef(() => undefined);

  useEffect(() => {

    if (token === 'not-loaded') {
      return
    }

    if (!user || !token) {
      navigate('/').then(() =>
        notifySuccess('Usuario no autorizado')
      )
      return
    }

    setLoading(true)

    getUserProfiles(user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setProfiles(apiResult.data)
        }
        else {
          setProfiles([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo perfiles')
    })
      .finally(() => setLoading(false))

  }, [token, user, profileStamp])


  const alertDelete = (id: number) => {
    console.log('dentro')
    deleteRef.current = () => {
      handleDeleteProfile(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteProfile = (id: number) => {

    console.log(id)
    if (token === 'not-loaded') {
      return
    }

    if (!user || !token) {
      navigate('/').then(() =>
        notifySuccess('Usuario no autorizado')
      )
      return
    }

    setLoading(true)

    const userSection: UserSection = {
      id: id,
      userId: user.id
    }

    deleteUserSection<UserSection>("profile", userSection, token).then((apiResult) => {
      console.log(apiResult)
      if (apiResult.success) {
        console.log(apiResult)
        setProfileStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo perfiles')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{profiles.map(p =>
        <li key={p.id} className="flex flex-row w-full gap-2 items-center">

          <p className="flex-1 text-start text-xs md:text-sm">{p.network}</p>
          <Button variant={"outline"} onClick={() => alertDelete(p.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar perfil</span>
          </Button>
          <EditProfileDialog profile={p} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}