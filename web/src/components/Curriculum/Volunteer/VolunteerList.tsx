import { useEffect, useState, useCallback, useRef } from "react"
import type { Volunteer } from '@/Schemas/volunteerSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { VolunteerDialog } from '@/components/Curriculum/Volunteer/VolunteerDialog'
import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function VolunteerList() {

  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { volunteerStamp, setVolunteerStamp } = useRefreshStore(state => state)
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

    getUserSection<Volunteer>("volunteer", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setVolunteers(apiResult.data)
        }
        else {
          setVolunteers([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo voluntariados')
    })
      .finally(() => setLoading(false))

  }, [token, user, volunteerStamp])


  const alertDelete = (id: number) => {
    deleteRef.current = () => {
      handleDeleteVolunteer(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteVolunteer = (id: number) => {
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

    deleteUserSection<UserSection>("volunteer", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setVolunteerStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo voluntariados')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{volunteers.map(model =>
        <li key={model.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{model.organization}</p>
          <Button variant={"outline"} onClick={() => alertDelete(model.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar voluntariado</span>
          </Button>
          <VolunteerDialog editMode={true} initialState={model} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}