import { useEffect } from 'react'
import { PublicSectionCheckbox } from './PublicCheck'
import { getUserSection } from '@/services/apiService'
import { type Section } from '@/Schemas/sectionSchema'
import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { useNotify } from '@/hooks/useNotify'
import { navigate } from 'astro/virtual-modules/transitions-router.js'
import { LoadIndicator } from '@/components/LoadIndicator'
import { set } from 'date-fns'

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

    console.log('antes')
    setSections([
      { id: 1, userId: 2, sectionName: 'profile', sectionId: 1, isPublic: true, desc: 'Instagram' },
      { id: 2, userId: 2, sectionName: 'profile', sectionId: 2, isPublic: true, desc: 'LinkedIn' },
      { id: 3, userId: 2, sectionName: 'work', sectionId: 3, isPublic: true, desc: 'Desarrollador .NET' },
      { id: 4, userId: 2, sectionName: 'work', sectionId: 4, isPublic: true, desc: 'Jefe Proyecto Adecco' },
      { id: 5, userId: 2, sectionName: 'project', sectionId: 5, isPublic: true, desc: 'Dev for Dev' },
      { id: 6, userId: 2, sectionName: 'project', sectionId: 6, isPublic: true, desc: 'Selfdriving c#' },
      { id: 7, userId: 2, sectionName: 'project', sectionId: 7, isPublic: true, desc: 'Portfolio WEB' },
    ])
    setLoading(false)

    console.log(sections)

    // getUserSection<Section>('section', user.id, token)
    //   .then(service => {
    //     if (service.success) {
    //       if (service.data) {
    //         console.log(service.data)
    //         setSections(service.data)
    //       }
    //     }
    //     else {

    //       notifyError('Error inesperado')
    //     }
    //   })
    //   .catch(error => {
    //     notifyError('Error inesperado')
    //   })
    //   .finally(
    //     () => setLoading(false)
    //   )
  }, [user, token])

  return (
    <section className="my-2">
      <div className="w-full flex items-center justify-center">
        <LoadIndicator loading={loading} />
      </div>
      {!loading && sections.length === 0 && <p>No existen datos que mostrar</p>}
      {!loading && sections.length !== 0 && <ul>{sections.map(section =>
        <li key={section.id} className="flex flex-row w-full gap-2 items-center">
          <p className="flex-1 text-start text-xs md:text-sm">{section.sectionName}</p>
          <p className="flex-1 text-start text-xs md:text-sm">{section.desc}</p>
          <PublicSectionCheckbox section={section} />
        </li>
      )}</ul>}
    </section>
  )
}