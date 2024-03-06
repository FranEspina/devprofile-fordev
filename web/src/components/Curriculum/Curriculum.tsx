import { CreateProfileDialog } from "@/components/Curriculum/Profile/CreateProfileDialog";
import { CreateWorkDialog } from "@/components/Curriculum/Work/CreateWorkDialog";
import { ProfileList } from "@/components/Curriculum/Profile/ProfileList";
import { useState } from "react";

export function CurriculumView() {


  return (<>
    <div className="grid grid-cols-3 gap-2" >
      <CreateProfileDialog />
      <CreateWorkDialog />
    </div>
    < div className="mt-2 w-full grid grid-cols-2 " >
      <ProfileList />
    </div>
  </>
  )
}