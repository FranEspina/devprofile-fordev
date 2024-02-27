import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface profileState {
  user: any,
  token: string,
  setUser: (user: any) => void
  setToken: (token: string) => void
}

export const useProfileStore = create<profileState>()(
  devtools(persist((set, get) => {
    return {
      token: '',
      user: undefined,
      setUser: (user: any) => set({ user }),
      setToken: (token: string) => set({ token }),
    }
  }, {
    name: 'profile'
  }))
)