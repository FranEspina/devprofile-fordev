import { useEffect, useState, useCallback, useRef } from "react"
import type { Basic } from '@/Schemas/basicSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { EditBasicDialog } from '@/components/Curriculum/Basic/EditBasicDialog'
import { CreateBasicDialog } from '@/components/Curriculum/Basic/CreateBasicDialog'

import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function BasicSection() {

  const [basics, setBasics] = useState<Basic>()
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { basicStamp, setBasicStamp } = useRefreshStore(state => state)
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

    getUserSection<Basic>("basic", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setBasics(apiResult.data[0])
        }
        else {
          setBasics(undefined)
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo información')
    })
      .finally(() => setLoading(false))

  }, [token, user, basicStamp])


  const alertDelete = (id: number) => {
    deleteRef.current = () => {
      handleDeleteBasic(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteBasic = (id: number) => {
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

    deleteUserSection<UserSection>("basic", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setBasicStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado eliminando información')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && basics && <ul>
        <li className="flex flex-row w-full gap-2 items-center">
          <div className="flex-1 text-start ">
            <p className="text-base md:text-lg text-blue-500">{basics.name}</p>
            <ul>
              <li className="my-2">{basics.label}</li>
              <li className="text-xs md:text-sm">{basics.email}</li>
              <li className="text-xs md:text-sm">{basics.phone}</li>
            </ul>
          </div>
          <div className="block flex-row self-start">
            <Button variant={"outline"} onClick={() => alertDelete(basics.id)}>
              <Trash className="h-3 w-3" />
              <span className="sr-only">Eliminar perfil</span>
            </Button>
            <EditBasicDialog basic={basics} />
          </div>
        </li>
        <li className="text-start my-4 text-xs md:text-sm text-gray-500 dark:text-gray-300 ">{basics.summary}</li>
      </ul>}
      {!loading && !basics &&
        <div className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">No existen datos</p>
          <CreateBasicDialog />
        </div>
      }
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}