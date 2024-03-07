import { create } from 'zustand'

interface refreshState {
  profileStamp: number,
  setProfileStamp: (profileStamp: number) => void,
  workStamp: number,
  setWorkStamp: (workStamp: number) => void
}

export const useRefreshStore = create<refreshState>()(
  (set) => {
    return {
      profileStamp: 0,
      setProfileStamp: (profileStamp: number) => set({ profileStamp }),
      workStamp: 0,
      setWorkStamp: (workStamp: number) => set({ workStamp }),
    }
  }
)