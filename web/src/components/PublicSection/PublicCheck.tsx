import { LoadIndicator } from "../LoadIndicator";
import { Children, useEffect, useState, type ReactComponentElement, useCallback } from "react";
import { cn } from '@/lib/utils'
import type { SectionData, Section } from '@/Schemas/sectionSchema'
import { updateUserSection } from '@/services/apiService'
import { useNotify } from "@/hooks/useNotify";
import { useProfileStore } from "@/store/profileStore";

export function PublicSectionCheckbox({ section }: { section: SectionData }) {

  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const token = useProfileStore(state => state.token)

  if (token === 'not-loaded') {
    return
  }

  useEffect(() => {
    if (section) {
      setIsPublic(section.isPublic)
    }
  }, [section])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {
    setLoading(true)
    setIsPublic(e.target.checked)

    const sectionToUpdate: Section = {
      id: section.id,
      userId: section.userId,
      sectionId: section.sectionId,
      sectionName: section.sectionName,
      isPublic: e.target.checked
    }

    try {
      var { success, message, data } = await updateUserSection<Section>('section', sectionToUpdate, token)
      if (success) {
        notifySuccess(message)
      }
      else {
        setIsPublic(!e.target.checked)
        notifyError('Error inesperado actualizando sección')
      }
    }
    catch (error) {
      setIsPublic(!e.target.checked)
      console.log(error)
      notifyError('Error inesperado actualizando sección')
    }
    finally {
      setLoading(false)
    }
  }, [token])

  return <div className="flex flex-row gap-1 items-center justify-center">
    <div className="h-5 w-5">
      <input disabled={loading} className={cn("hover:cursor-pointer", loading ? 'hidden' : '')} type="checkbox" checked={isPublic} onChange={handleChange} />
      <LoadIndicator loading={loading} />
    </div>
  </div>
}




