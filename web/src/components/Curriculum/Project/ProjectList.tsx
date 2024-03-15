import { useEffect, useState, useCallback, useRef } from "react"
import type { Project } from '@/Schemas/projectSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { EditProjectDialog } from '@/components/Curriculum/Project/EditProjectDialog'
import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function ProjectList() {

  const [projects, setProjects] = useState<Project[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { projectStamp, setProjectStamp } = useRefreshStore(state => state)
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

    getUserSection<Project>("project", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setProjects(apiResult.data)
        }
        else {
          setProjects([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo proyectos')
    })
      .finally(() => setLoading(false))

  }, [token, user, projectStamp])


  const alertDelete = (id: number) => {
    console.log('dentro')
    deleteRef.current = () => {
      handleDeleteProject(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteProject = (id: number) => {
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

    deleteUserSection<UserSection>("project", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setProjectStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo proyectos')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{projects.map(w =>
        <li key={w.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{w.name}</p>
          <Button variant={"outline"} onClick={() => alertDelete(w.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar proyecto</span>
          </Button>
          <EditProjectDialog project={w} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}