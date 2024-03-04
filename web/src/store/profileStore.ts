import type { apiUserDto } from '@/types/apiTypes'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface profileState {
  user: apiUserDto | undefined,
  token: string,
  setUser: (user: apiUserDto | undefined) => void
  setToken: (token: string) => void
}

export const useProfileStore = create<profileState>()(
  devtools(persist((set) => {
    return {
      token: 'not-loaded',
      user: undefined,
      setUser: (user: apiUserDto | undefined) => set({ user }),
      setToken: (token: string) => set({ token }),
    }
  }, {
    name: 'profile'
  }))
)