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

  const [resume, setResume] = useState<unknown>(null)

  useEffect(() => {
    getUserResume<resultData>(userId)
      .then(result => {
        setResume(result.data)
      }
      );
  }
    , [])

  const handleSave: React.MouseEventHandler<HTMLButtonElement>
    = useCallback((event) => {
      saveFile(JSON.stringify(resume, null, 2), "resume.json")
    }, [resume])

  return (
    <Button variant={"outline"} onClick={handleSave}>
      <Save className="h-3 w-3 mr-2" />
      <span className="text-xs md:text-sm" >Exportar JSON Público</span>
      <ArrowRight
        className="ml-2 text-blue-500"
      />
    </Button>
  )
}