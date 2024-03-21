import { BasicSection } from '@/components/Curriculum/Basic/BasicSection'

import { ProfileDialog } from './Profile/ProfileDialog';
import { ProfileList } from "@/components/Curriculum/Profile/ProfileList";

import { WorkDialog } from "@/components/Curriculum/Work/WorkDialog";
import { WorkList } from '@/components/Curriculum/Work/WorkList'

import { ProjectDialog } from "@/components/Curriculum/Project/ProjectDialog";
import { ProjectList } from '@/components/Curriculum/Project/ProjectList'

import { SkillDialog } from "@/components/Curriculum/Skill/SkillDialog";
import { SkillList } from '@/components/Curriculum/Skill/SkillList'

import { LocationDialog } from "@/components/Curriculum/Location/LocationDialog";
import { LocationList } from '@/components/Curriculum/Location/LocationList'

import { ReferenceDialog } from "@/components/Curriculum/Reference/ReferenceDialog";
import { ReferenceList } from '@/components/Curriculum/Reference/ReferenceList'

import { InterestDialog } from "@/components/Curriculum/Interest/InterestDialog";
import { InterestList } from '@/components/Curriculum/Interest/InterestList'

import { LanguageDialog } from "@/components/Curriculum/Language/LanguageDialog";
import { LanguageList } from '@/components/Curriculum/Language/LanguageList'

import { PublicationDialog } from "@/components/Curriculum/Publication/PublicationDialog";
import { PublicationList } from '@/components/Curriculum/Publication/PublicationList'

import { CertificateDialog } from "@/components/Curriculum/Certificate/CertificateDialog";
import { CertificateList } from '@/components/Curriculum/Certificate/CertificateList'

import { AwardDialog } from '@/components/Curriculum/Award/AwardDialog'
import { AwardList } from '@/components/Curriculum/Award/AwardList'

import { EducationDialog } from '@/components/Curriculum/Education/EducationDialog'
import { EducationList } from '@/components/Curriculum/Education/EducationList'

import { VolunteerDialog } from '@/components/Curriculum/Volunteer/VolunteerDialog'
import { VolunteerList } from '@/components/Curriculum/Volunteer/VolunteerList'


export function CurriculumView() {


  return (<section className="w-full ">
    <header>
      <h2 className="text-left text-sm md:text-base">Secciones del Curriculum</h2>
    </header>
    < div className="mt-2 w-full flex flex-col gap-4" >
      <div className="flex flex-col justify-start gap-1">
        <BasicSection />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <LocationDialog editMode={false} />
        <LocationList />
      </div>
    </div>
    < div className="mt-2 w-full flex flex-col md:grid md:grid-cols-2 gap-4" >

      <div className="flex flex-col justify-start gap-1">
        <ProfileDialog editMode={false} />
        <ProfileList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <WorkDialog editMode={false} />
        <WorkList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <ProjectDialog editMode={false} />
        <ProjectList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <SkillDialog editMode={false} />
        <SkillList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <ReferenceDialog editMode={false} />
        <ReferenceList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <InterestDialog editMode={false} />
        <InterestList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <LanguageDialog editMode={false} />
        <LanguageList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <PublicationDialog editMode={false} />
        <PublicationList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <CertificateDialog editMode={false} />
        <CertificateList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <AwardDialog editMode={false} />
        <AwardList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <EducationDialog editMode={false} />
        <EducationList />
      </div>
      <div className="flex flex-col justify-start gap-1">
        <VolunteerDialog editMode={false} />
        <VolunteerList />
      </div>
    </div>
  </section>
  )
}