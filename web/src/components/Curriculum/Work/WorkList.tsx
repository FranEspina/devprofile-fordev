import { useEffect, useState, useCallback } from "react"
import type { Work } from '@/Schemas/workSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { EditWorkDialog } from '@/components/Curriculum/Work/EditWorkDialog'

export function WorkList() {

  const [works, setWorks] = useState<Work[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { workStamp, setWorkStamp } = useRefreshStore(state => state)

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

    getUserSection<Work>("work", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setWorks(apiResult.data)
        }
        else {
          setWorks([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo puestos')
    })
      .finally(() => setLoading(false))

  }, [token, user, workStamp])

  const handleDeleteWork = (id: number) => {

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

    deleteUserSection<UserSection>("work", userSection, token).then((apiResult) => {
      console.log(apiResult)
      if (apiResult.success) {
        console.log(apiResult)
        setWorkStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo puestos')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      {!loading && <ul>{works.map(w =>
        <li key={w.id} className="flex flex-row w-full gap-2 items-center">

          <p className="flex-1 text-start">{w.title}</p>
          <Button variant={"outline"} onClick={() => handleDeleteWork(w.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar perfil</span>
          </Button>
          <EditWorkDialog work={w} />
        </li>
      )}</ul>}
      {loading && <p>Cargando ... </p>}
    </section>
  )
}