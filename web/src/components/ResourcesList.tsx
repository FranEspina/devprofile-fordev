import { useEffect, useState } from "react"
import { getDevUserDevResources } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import type { apiDevResourceDto } from '../types/apiTypes'
import { CreateResourceModal } from '@/components/Resources/CreateResourceModal'

export function ResourcesList() {
  const [resources, setResources] = useState<apiDevResourceDto[]>([])
  const { user, token } = useProfileStore(state => state)

  useEffect(() => {
    if (!user) return
    getDevUserDevResources(user.id, token).then((apiResult) => {
      console.log(apiResult)

      if (apiResult.success) {
        if (apiResult.data) {
          setResources(apiResult.data)
        }
        else {
          setResources([])
        }
      }
    })
  }, [user])

  return (
    <section className="w-full mx-auto">
      <header className="flex flex-row justify-between">
        <h2 className="flex-1 text-start">Lista de recursos</h2>
        <CreateResourceModal />
      </header>
      {resources.map(r => <li className="list-none" key={r.id}>{r.title} - {r.description}</li>)}
      {resources.length === 0 && <p>No existen recursos</p>}
    </section>
  )
}