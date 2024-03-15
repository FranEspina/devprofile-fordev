import { BasicSection } from '@/components/Curriculum/Basic/BasicSection'

import { CreateProfileDialog } from "@/components/Curriculum/Profile/CreateProfileDialog";
import { ProfileList } from "@/components/Curriculum/Profile/ProfileList";

import { CreateWorkDialog } from "@/components/Curriculum/Work/CreateWorkDialog";
import { WorkList } from '@/components/Curriculum/Work/WorkList'

import { CreateProjectDialog } from "@/components/Curriculum/Project/CreateProjectDialog";
import { ProjectList } from '@/components/Curriculum/Project/ProjectList'

import { CreateSkillDialog } from "@/components/Curriculum/Skill/CreateSkillDialog";
import { SkillList } from '@/components/Curriculum/Skill/SkillList'

import { LocationDialog } from "@/components/Curriculum/Location/LocationDialog";
import { LocationList } from '@/components/Curriculum/Location/LocationList'

import { ReferenceDialog } from "@/components/Curriculum/Reference/ReferenceDialog";
import { ReferenceList } from '@/components/Curriculum/Reference/ReferenceList'

export function CurriculumView() {


  return (<section className="w-full ">
    <header>
      <h2 className="text-left text-sm md:text-base">Secciones del Curriculum</h2>
    </header>
    < div className="mt-2 w-full flex flex-col gap-4" >
      <div className="flex flex-col justify-start gap-1">
        <BasicSection />
      </div>
    </div>
    < div className="mt-2 w-full flex flex-col md:grid md:grid-cols-2 gap-4" >
      <div className="flex flex-col justify-start gap-1">
        <LocationDialog editMode={false} />
        <LocationList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <CreateProfileDialog />
        <ProfileList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <CreateWorkDialog />
        <WorkList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <CreateProjectDialog />
        <ProjectList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <CreateSkillDialog />
        <SkillList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <ReferenceDialog editMode={false} />
        <ReferenceList />
      </div>
    </div>
  </section>
  )
}