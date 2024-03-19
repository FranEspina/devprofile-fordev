import { useEffect, useState, useCallback, useRef } from "react"
import type { Language } from '@/Schemas/languageSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { LanguageDialog } from '@/components/Curriculum/Language/LanguageDialog'
import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function LanguageList() {

  const [languages, setLanguages] = useState<Language[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { languageStamp, setLanguageStamp } = useRefreshStore(state => state)
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

    getUserSection<Language>("language", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setLanguages(apiResult.data)
        }
        else {
          setLanguages([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo idiomas')
    })
      .finally(() => setLoading(false))

  }, [token, user, languageStamp])


  const alertDelete = (id: number) => {
    deleteRef.current = () => {
      handleDeleteLanguage(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteLanguage = (id: number) => {
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

    deleteUserSection<UserSection>("language", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setLanguageStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo idiomas')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{languages.map(loc =>
        <li key={loc.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{loc.language}</p>
          <Button variant={"outline"} onClick={() => alertDelete(loc.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar idioma</span>
          </Button>
          <LanguageDialog editMode={true} initialState={loc} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}