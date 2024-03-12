import { useEffect } from 'react'
import { PublicSectionCheckbox } from './PublicCheck'
import { getUserSection } from '@/services/apiService'
import { type Section } from '@/Schemas/sectionSchema'
import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { useNotify } from '@/hooks/useNotify'
import { navigate } from 'astro/virtual-modules/transitions-router.js'
import { LoadIndicator } from '@/components/LoadIndicator'

export function SectionList() {
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const { user, token } = useProfileStore(state => state)
  const { notifySuccess, notifyError } = useNotify()


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
    getUserSection<Section>('section', user.id, token)
      .then(service => {
        if (service.success) {
          if (service.data) {
            console.log(service.data)
            setSections(service.data)
          }
        }
        else {
          notifyError('Error inesperado')
        }
      })
      .catch(error => {
        notifyError('Error inesperado')
      })
      .finally(
        () => setLoading(false)
      )
  }, [user, token])

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && sections.length === 0 && <p>No existen datos que mostrar</p>}
      {!loading && sections.length !== 0 && <ul>{sections.map(w =>
        <li key={w.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{w.id}</p>
        </li>
      )}</ul>}
    </section>
  )
}