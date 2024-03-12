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
    }
  }
)