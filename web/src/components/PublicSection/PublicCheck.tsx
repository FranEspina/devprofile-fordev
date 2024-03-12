import { LoadIndicator } from "../LoadIndicator";
import { Children, useEffect, useState, type ReactComponentElement, useCallback } from "react";
import { cn } from '@/lib/utils'
import { type Section } from '@/Schemas/sectionSchema'

export function PublicSectionCheckbox({ section }: { section: Section }) {

  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (section) {
      setIsPublic(section.isPublic)
    }
  }, [section])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {
    setLoading(true)
    setIsPublic(e.target.checked)
    await setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  return <div className="flex flex-row gap-1 items-center justify-center">
    <div className="h-5 w-5">
      <input className={cn("hover:cursor-pointer", loading ? 'hidden' : '')} type="checkbox" checked={isPublic} onChange={handleChange} />
      <LoadIndicator loading={loading} />
    </div>
  </div>
}




