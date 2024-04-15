import { useEffect, useState, useCallback, useRef } from "react"
import type { Basic } from '@/Schemas/basicSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { BasicDialog } from '@/components/Curriculum/Basic/BasicDialog'

import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'
import { BasicSkeleton } from '@/components/Curriculum/Basic/BasicSkeleton'

export function BasicSection() {

  const [basics, setBasics] = useState<Basic>()
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { basicStamp, setBasicStamp } = useRefreshStore(state => state)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const deleteRef = useRef(() => undefined);
  const MAX_PARAGRAPH_SUMMARY = 3

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

    deleteUserSection("basic", userSection, token).then((apiResult) => {
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

  if (loading)
    return <BasicSkeleton />

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
            <Button className="mr-2" variant={"outline"} onClick={() => alertDelete(basics.id)}>
              <Trash className="h-3 w-3" />
              <span className="sr-only">Eliminar</span>
            </Button>
            <BasicDialog editMode={true} initialState={basics} />
          </div>
        </li>
        <li className="text-start my-4 text-xs md:text-sm text-gray-500 dark:text-gray-300 ">
          {basics.summary && basics.summary.split("\n").slice(0, Math.min(MAX_PARAGRAPH_SUMMARY, basics.summary.split("\n").length)).map((p) => <p className="mb-2">{p}</p>)}
          {basics.summary && basics.summary.split("\n").length > MAX_PARAGRAPH_SUMMARY
            ? <BasicDialog editMode={true} initialState={basics}>
              <button className="mt-2 font-bold">Leer más ➡️</button>
            </BasicDialog>
            : ''
          }
        </li>
      </ul>}
      {!loading && !basics &&
        <div className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">No existen datos</p>
          <BasicDialog editMode={false} />
        </div>
      }
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}