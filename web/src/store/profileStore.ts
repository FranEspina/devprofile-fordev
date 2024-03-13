import type { apiUserDto } from '@/types/apiTypes'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import Cookies from 'js-cookie';

interface profileState {
  user: apiUserDto | undefined,
  token: string,
  theme: "theme-light" | "dark" | "system" | "not-loaded"
  setUser: (user: apiUserDto | undefined) => void
  setToken: (token: string) => void
  setThemeState: (theme: "theme-light" | "dark" | "system") => void
}

export const useProfileStore = create<profileState>()(
  devtools(persist((set) => {
    return {
      token: 'not-loaded',
      user: undefined,
      theme: 'not-loaded',
      setUser: (user: apiUserDto | undefined) => {
        set({ user })
        Cookies.set('id', user?.id?.toString() || '', { secure: true });
      },
      setToken: (token: string) => {
        set({ token })
        Cookies.set('token', token, { secure: true });
      },
      setThemeState: (theme: "theme-light" | "dark" | "system") => set({ theme })
    }
  }, {
    name: 'profile'
  }))
)