import { useEffect, useState, useCallback, useRef } from "react"
import type { Publication } from '@/Schemas/publicationSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { PublicationDialog } from '@/components/Curriculum/Publication/PublicationDialog'
import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function PublicationList() {

  const [publications, setPublications] = useState<Publication[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { publicationStamp, setPublicationStamp } = useRefreshStore(state => state)
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

    getUserSection<Publication>("publication", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setPublications(apiResult.data)
        }
        else {
          setPublications([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo publicaciones')
    })
      .finally(() => setLoading(false))

  }, [token, user, publicationStamp])


  const alertDelete = (id: number) => {
    deleteRef.current = () => {
      handleDeletePublication(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeletePublication = (id: number) => {
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

    deleteUserSection("publication", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setPublicationStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo publicaciones')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{publications.map(model =>
        <li key={model.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{model.name}</p>
          <Button variant={"outline"} onClick={() => alertDelete(model.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar publicación</span>
          </Button>
          <PublicationDialog editMode={true} initialState={model} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}