import { useEffect, useState, useCallback, useRef } from "react"
import type { Skill } from '@/Schemas/skillSchema'
import { useProfileStore } from "@/store/profileStore"
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { getUserSection, deleteUserSection, type UserSection } from '@/services/apiService'
import { Button } from "@/components/ui/button"
import { Edit, Moon, Trash } from 'lucide-react'
import { useRefreshStore } from "@/store/refreshStore"
import { SkillDialog } from '@/components/Curriculum/Skill/SkillDialog'
import { LoadIndicator } from "@/components/LoadIndicator"
import { AlertDialogPrompt } from '@/components/AlertDialogPrompt'

export function SkillList() {

  const [skills, setSkills] = useState<Skill[]>([])
  const { user, token } = useProfileStore(state => state)
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const { skillStamp, setSkillStamp } = useRefreshStore(state => state)
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



    getUserSection<Skill>("skill", user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setSkills(apiResult.data)
        }
        else {
          setSkills([])
        }
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo competencias')
    })
      .finally(() => setLoading(false))

  }, [token, user, skillStamp])


  const alertDelete = (id: number) => {
    deleteRef.current = () => {
      handleDeleteSkill(id)
    };
    setIsOpenAlert(true)
  }

  const handleDeleteSkill = (id: number) => {
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

    deleteUserSection("skill", userSection, token).then((apiResult) => {
      if (apiResult.success) {
        setSkillStamp(Date.now())
      }
      else {
        notifyError(apiResult.message)
      }
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo competencias')
    })
      .finally(() => setLoading(false))
  }

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && <ul>{skills.map(model =>
        <li key={model.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{model.name}</p>
          <Button variant={"outline"} onClick={() => alertDelete(model.id)}>
            <Trash className="h-3 w-3" />
            <span className="sr-only">Eliminar compentencia</span>
          </Button>
          <SkillDialog editMode={true} initialState={model} />
        </li>
      )}</ul>}
      <AlertDialogPrompt open={isOpenAlert} setOpen={setIsOpenAlert} onActionClick={deleteRef.current} />
    </section>
  )
}