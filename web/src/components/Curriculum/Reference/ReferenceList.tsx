import { useEffect, useState, useCallback, useRef } from "react"
import type { Reference } from '@/Schemas/referenceSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { ReferenceDialog } from '@/components/Curriculum/Reference/ReferenceDialog'
import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function ReferenceList() {

  const [references, setReferences] = useState<Reference[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { referenceStamp, setReferenceStamp } = useRefreshStore(state => state)
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

    getUserSection<Reference>("reference", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setReferences(apiResult.data)
        }
        else {
          setReferences([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo direcciones')
    })
      .finally(() => setLoading(false))

  }, [token, user, referenceStamp])


  const alertDelete = (id: number) => {
    deleteRef.current = () => {
      handleDeleteReference(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteReference = (id: number) => {
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

    deleteUserSection("reference", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setReferenceStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo direcciones')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{references.map(model =>
        <li key={model.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{model.name}</p>
          <Button variant={"outline"} onClick={() => alertDelete(model.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar referencia</span>
          </Button>
          <ReferenceDialog editMode={true} initialState={model} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}