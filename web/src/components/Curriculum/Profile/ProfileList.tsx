import { useEffect, useState, useCallback } from "react"
import type { Profile } from '@/Schemas/profileSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserProfiles, deleteProfileNetwork } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { EditProfileDialog } from '@/components/Curriculum/Profile/EditProfileDialog'

export function ProfileList() {

  const [profiles, setProfiles] = useState<Profile[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { profileStamp, setProfileStamp } = useRefreshStore(state => state)

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

    deleteProfileNetwork(id, user.id, token).then((apiResult) => {
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
      {!loading && <ul>{profiles.map(p =>
        <li key={p.id} className="flex flex-row w-full gap-2 items-center">

          <p className="flex-1 text-start">{p.network}</p>
          <Button variant={"outline"} onClick={() => handleDeleteProfile(p.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar perfil</span>
          </Button>
          <EditProfileDialog profile={p} />
        </li>
      )}</ul>}
      {loading && <p>Cargando ... </p>}
    </section>
  )
}