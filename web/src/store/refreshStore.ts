import { create } from 'zustand'

interface refreshState {
  profileStamp: number,
  setProfileStamp: (profileStamp: number) => void
}

export const useRefreshStore = create<refreshState>()(
  (set) => {
    return {
      profileStamp: 0,
      setProfileStamp: (profileStamp: number) => set({ profileStamp }),
    }
  }
)