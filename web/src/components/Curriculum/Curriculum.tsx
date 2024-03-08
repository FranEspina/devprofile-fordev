import { CreateProfileDialog } from "@/components/Curriculum/Profile/CreateProfileDialog";
import { CreateWorkDialog } from "@/components/Curriculum/Work/CreateWorkDialog";
import { ProfileList } from "@/components/Curriculum/Profile/ProfileList";
import { WorkList } from '@/components/Curriculum/Work/WorkList'
import { useState } from "react";

export function CurriculumView() {


  return (<section className="w-full ">
    <header>
      <h2 className="text-left text-sm md:text-base">Secciones del Curriculum</h2>
    </header>
    < div className="mt-2 w-full flex flex-col md:grid md:grid-cols-2 gap-4" >
      <div className="flex flex-col justify-start gap-1">
        <CreateProfileDialog />
        <ProfileList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <CreateWorkDialog />
        <WorkList />
      </div>
    </div>
  </section>
  )
}