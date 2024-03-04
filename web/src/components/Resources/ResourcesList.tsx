import { useEffect, useState } from "react"
import { getDevUserDevResources, getDevUserDevResourcesRow } from '@/services/apiService'
import { useProfileStore } from "@/store/profileStore"
import type { apiDevResourceDto } from '../../types/apiTypes'
import { CreateResourceModal } from '@/components/Resources/CreateResourceModal'
import type { ColumnDef } from "@tanstack/react-table"
import type { ResourceRow } from '@/Schemas/resourceSchema'
import { DataTable } from '@/components/Resources/data-table'
import { useNotify } from "@/hooks/useNotify"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { useAuthorization } from "@/hooks/useAuthorization"

export const columns: ColumnDef<ResourceRow>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-white">Título</div>,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-white">Descripción</div>,
  },
  {
    accessorKey: "url",
    header: () => <div className="text-white">Url</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-white">Tipo</div>,
  }
]

export function ResourcesList() {
  const [resources, setResources] = useState<ResourceRow[]>([])
  const { user, token } = useProfileStore(state => state)
  const [reloadStamp, setReloadStamp] = useState(Date.now())
  const [loading, setLoading] = useState(false)
  const { notifyError, notifySuccess } = useNotify()

  const refresh = () => setReloadStamp(Date.now())

  useEffect(() => {
    if (!user || !token) {
      navigate('/').then(() =>
        notifySuccess('Usuario no logado')
      )
      return
    }

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
    }).catch((error) => {
      console.log(error)
      notifyError('Error inesperado obteniendo recursos')
    })
      .finally(() => setLoading(false))
  }, [user, reloadStamp])

  return (
    <section className="w-full mx-auto my-2">
      <header className="flex flex-row justify-between mb-2">
        <h2 className="flex-1 text-start uppercase mb-2">Lista de recursos del usuario</h2>
        <CreateResourceModal callback={refresh} />
      </header>
      {!loading && <DataTable columns={columns} data={resources} />}
      {loading && <p>Cargando ... </p>}
    </section>
  )
}