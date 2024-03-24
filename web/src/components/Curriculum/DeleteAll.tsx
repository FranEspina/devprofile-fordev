import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { AlertDialogPrompt } from "@/components/AlertDialogPrompt";
import { deleteResume } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore";
import { useNotify } from "@/hooks/useNotify";
import { useRefreshStore } from "@/store/refreshStore";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { LoadIndicator } from "../LoadIndicator";
import { cn } from "@/lib/utils";

export function DeleteAll() {
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const deleteAllFunction = useRef<() => void>()
  const { notifyError, notifySuccess } = useNotify()
  const [isLoading, setIsLoading] = useState(false)

  const { user, token } = useProfileStore(state => state)
  const setAllStamp = useRefreshStore(state => state.setAllStamp)

  const handleClick = useCallback(() => {

    if (token === 'not-loaded')
      return

    if (!user || !token) {
      navigate('/').then(() =>
        notifyError('Usuario no autorizado')
      )
      return
    }

    setIsOpenAlert(true)
    const deleteAll = () => {
      setIsLoading(true)
      deleteResume(user.id, token)
        .then((result) => {
          if (result.success) {
            setAllStamp()
            if (result.data) {
              notifySuccess(`${result.data} registros elimiminados`)
            }
            else {
              notifySuccess('No había datos que borrar')
            }
          }
          else {
            notifyError('Error eliminando datos')
          }
        })
        .catch(() => notifyError('Error inesperado borrando datos'))
        .finally(() => setIsLoading(false))
    }
    deleteAllFunction.current = deleteAll
  }, [user, token])

  return (
    <>
      <Button variant="destructive" onClick={handleClick}>
        <span><Trash className={cn("h-3 w-3", isLoading ? 'hidden' : '')} /></span>
        <LoadIndicator loading={isLoading}></LoadIndicator>
      </Button>
      <AlertDialogPrompt title="Eliminar todo"
        message="Se borrarán todas las secciones del curriculum ¿Está seguro que desea continuar?"
        open={isOpenAlert}
        setOpen={setIsOpenAlert} onActionClick={deleteAllFunction.current} />
    </>

  )
}