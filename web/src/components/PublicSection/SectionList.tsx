import { useEffect } from 'react'
import { PublicSectionCheckbox } from './PublicCheck'
import { getUserSection } from '@/services/apiService'
import { type SectionData } from '@/Schemas/sectionSchema'
import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { useNotify } from '@/hooks/useNotify'
import { navigate } from 'astro/virtual-modules/transitions-router.js'
import { LoadIndicator } from '@/components/LoadIndicator'
import { set } from 'date-fns'

export function SectionList() {
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<SectionData[]>([])
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

    getUserSection<SectionData>('sectiondata', user.id, token)
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
    <section className="my-2 w-full">
      <div className="flex w-full items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && sections.length === 0 && <p>No existen datos que mostrar</p>}
      {!loading && sections.length !== 0 &&
        <ul>
          {sections.map(section =>
            <li key={section.id} className="flex flex-row gap-2 items-center justify-start my-2">
              <PublicSectionCheckbox section={section} />
              <p className="text-start text-xs md:text-sm">{section.sectionFullName} - {section.sectionDesc}</p>
            </li>
          )}
        </ul>}
    </section>
  )
}