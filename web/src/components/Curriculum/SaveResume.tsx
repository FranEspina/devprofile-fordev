import { saveFile } from "@/lib/savefile";
import { Save } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";
import { getUserResume } from "@/services/apiService";
import { type Work } from "@/Schemas/workSchema";
import { type Basic } from "@/Schemas/basicSchema";
import { type Skill } from "@/Schemas/skillSchema";
import { type Education } from "@/Schemas/educationSchema";
import { type Award } from "@/Schemas/awardSchema";
import { type Interest } from "@/Schemas/interestSchema";
import { type Reference } from "@/Schemas/referenceSchema";
import { ArrowRight } from "lucide-react";
import { useNotify } from '@/hooks/useNotify'
import { LoadIndicator } from "../LoadIndicator";

interface resultData {
  work: Work[];
  basic: Basic[];
  skills: Skill[];
  education: Education[];
  awards: Award[];
  interests: Interest[];
  references: Reference[];
}


export function SaveResume({ userId }: { userId: number }) {
  const { notifySuccess, notifyError } = useNotify()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave: React.MouseEventHandler<HTMLButtonElement>
    = useCallback((event) => {
      setIsLoading(true)

      getUserResume<resultData>(userId)
        .then(result => {
          saveFile(JSON.stringify(result.data, null, 2), "")
            .then((result) => {
              if (result) {
                notifySuccess('Fichero exportado correctamente')
              }
            })
            .catch((error) => {
              throw error
            })
        }
        ).catch((error) => {
          console.log('dentro')
          notifyError('Error recuperando información')
        }).finally(
          () => setIsLoading(false))
    }, [])

  return (
    <Button variant={"outline"} onClick={handleSave}>
      <Save className="h-3 w-3 mr-2" />
      <span className="text-xs md:text-sm" >Exportar JSON Público</span>

      <span className="ml-2">
        {!isLoading && <ArrowRight className="text-blue-500" />}
        <LoadIndicator loading={isLoading} />
      </span>

    </Button>
  )
}