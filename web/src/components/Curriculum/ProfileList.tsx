import { useEffect, useState, useCallback } from "react"
import type { Profile } from '@/Schemas/profileSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserProfiles } from '@/services/apiService'

export function ProfileList() {

  const [profiles, setProfiles] = useState<Profile[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const [reloadStamp, setReloadStamp] = useState(Date.now())

  const refresh = useCallback(() => setReloadStamp(Date.now()), [])

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

  }, [token, user, reloadStamp])

  return (
    <section className="w-full mx-auto my-2">
      {!loading && <ul>{profiles.map(p => <li key={p.id}>{p.network}</li>)}</ul>}
      {loading && <p>Cargando ... </p>}
    </section>
  )
}