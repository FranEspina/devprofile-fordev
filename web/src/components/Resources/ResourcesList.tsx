import { useEffect, useState } from "react"
import { getDevUserDevResources, getDevUserDevResourcesRow } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import type { apiDevResourceDto } from '../../types/apiTypes'
import { CreateResourceModal } from '@/components/Resources/CreateResourceModal'
import type { ColumnDef } from "@tanstack/react-table"
import type { ResourceRow } from '@/Schemas/resourceSchema'
import { DataTable } from '@/components/Resources/data-table'

export const columns: ColumnDef<ResourceRow>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "url",
    header: "Url",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  }
]

export function ResourcesList() {
  const [resources, setResources] = useState<ResourceRow[]>([])
  const { user, token } = useProfileStore(state => state)
  const [reloadStamp, setReloadStamp] = useState(Date.now())
  const [loading, setLoading] = useState(false)

  const refresh = () => setReloadStamp(Date.now())

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getDevUserDevResourcesRow(user.id, token).then((apiResult) => {
      if (apiResult.success) {
        if (apiResult.data) {
          setResources(apiResult.data)
        }
        else {
          setResources([])
        }
      }
    }).finally(() => setLoading(false))
  }, [user, reloadStamp])

  return (
    <section className="w-full mx-auto my-2">
      <header className="flex flex-row justify-between mb-2">
        <h2 className="flex-1 text-start uppercase mb-2">Lista de recursos del usuario</h2>
        <CreateResourceModal callback={refresh} />
      </header>
      {/* {resources.map(r => <li className="list-none" key={r.id}>{r.title} - {r.description}</li>)} */}
      {!loading && <DataTable columns={columns} data={resources} />}
      {!loading && resources.length === 0 && <p>No existen recursos</p>}
      {loading && <p>Cargando ... </p>}
    </section>
  )
}