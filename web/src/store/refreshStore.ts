import { create } from 'zustand'

interface refreshState {
  profileStamp: number,
  setProfileStamp: (profileStamp: number) => void,
  workStamp: number,
  setWorkStamp: (workStamp: number) => void,
  projectStamp: number,
  setProjectStamp: (projectStamp: number) => void,
  skillStamp: number,
  setSkillStamp: (projectStamp: number) => void,
  basicStamp: number,
  setBasicStamp: (basicStamp: number) => void
  locationStamp: number,
  setLocationStamp: (locationStamp: number) => void
  volunteerStamp: number,
  setVolunteerStamp: (volunteerStamp: number) => void
  educationStamp: number,
  setEducationStamp: (educationStamp: number) => void
  awardStamp: number,
  setAwardStamp: (awardStamp: number) => void
  certificateStamp: number,
  setCertificateStamp: (certificateStamp: number) => void
  publicationStamp: number,
  setPublicationStamp: (publicationStamp: number) => void
  languageStamp: number,
  setLanguageStamp: (languageStamp: number) => void
  interestStamp: number,
  setInterestStamp: (interestStamp: number) => void
  referenceStamp: number,
  setReferenceStamp: (referenceStamp: number) => void
}

export const useRefreshStore = create<refreshState>()(
  (set) => {
    return {
      profileStamp: 0,
      setProfileStamp: (profileStamp: number) => set({ profileStamp }),
      workStamp: 0,
      setWorkStamp: (workStamp: number) => set({ workStamp }),
      projectStamp: 0,
      setProjectStamp: (projectStamp: number) => set({ projectStamp }),
      skillStamp: 0,
      setSkillStamp: (skillStamp: number) => set({ skillStamp }),
      basicStamp: 0,
      setBasicStamp: (basicStamp: number) => set({ basicStamp }),
      locationStamp: 0,
      setLocationStamp: (locationStamp: number) => set({ locationStamp }),
      volunteerStamp: 0,
      setVolunteerStamp: (volunteerStamp: number) => set({ volunteerStamp }),
      educationStamp: 0,
      setEducationStamp: (educationStamp: number) => set({ educationStamp }),
      awardStamp: 0,
      setAwardStamp: (awardStamp: number) => set({ awardStamp }),
      certificateStamp: 0,
      setCertificateStamp: (certificateStamp: number) => set({ certificateStamp }),
      publicationStamp: 0,
      setPublicationStamp: (publicationStamp: number) => set({ publicationStamp }),
      languageStamp: 0,
      setLanguageStamp: (languageStamp: number) => set({ languageStamp }),
      interestStamp: 0,
      setInterestStamp: (interestStamp: number) => set({ interestStamp }),
      referenceStamp: 0,
      setReferenceStamp: (referenceStamp: number) => set({ referenceStamp }),
    }
  }
)