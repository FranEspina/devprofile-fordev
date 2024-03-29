import { LoadIndicator } from "../LoadIndicator";
import { useEffect, useState, useCallback } from "react";
import { cn } from '@/lib/utils'
import type { SectionData, Section } from '@/Schemas/sectionSchema'
import { updateUserSection } from '@/services/apiService'
import { useNotify } from "@/hooks/useNotify";
import { useProfileStore } from "@/store/profileStore";
import { Checkbox } from "@/components/ui/checkbox"
import { type CheckedState } from '@radix-ui/react-checkbox'

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



  const handleChangeCheck = useCallback(async (checked: CheckedState) => {
    const isPublic = (checked === true) ? true : false

    setLoading(true)
    setIsPublic(isPublic)

    const sectionToUpdate: Section = {
      id: section.id,
      userId: section.userId,
      sectionId: section.sectionId,
      sectionName: section.sectionName,
      isPublic: isPublic
    }

    section.isPublic = isPublic

    try {
      var { success, message } = await updateUserSection<Section>('section', sectionToUpdate, token)
      if (success) {
        notifySuccess(message)
      }
      else {
        setIsPublic(!isPublic)
        section.isPublic = !isPublic
        notifyError('Error inesperado actualizando sección')
      }
    }
    catch (error) {
      setIsPublic(!isPublic)
      section.isPublic = !isPublic
      console.log(error)
      notifyError('Error inesperado actualizando sección')
    }
    finally {
      setLoading(false)
    }
  }, [token])


  return <div className="flex flex-row gap-1 items-center justify-center">
    <div className="h-5 w-5">
      <Checkbox disabled={loading} className={cn("hover:cursor-pointer", loading ? 'hidden' : '')} checked={isPublic} onCheckedChange={handleChangeCheck} />
      <LoadIndicator loading={loading} />
    </div>
  </div>
}




