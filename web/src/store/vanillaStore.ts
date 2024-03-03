// import type { apiUserDto } from '@/types/apiTypes'
// import { createStore } from 'zustand/vanilla';
// import { persist, devtools } from 'zustand/middleware'

// export interface profileState {
//   user: apiUserDto | undefined,
//   token: string,
//   setUser: (user: apiUserDto) => void
//   setToken: (token: string) => void
// }

// export const profileStore = createStore<profileState>()(
//   devtools(persist((set, get) => {
//     return {
//       token: '',
//       user: undefined,
//       setUser: (user: apiUserDto) => set({ user }),
//       setToken: (token: string) => set({ token }),
//     }
//   }, {
//     name: 'profile'
//   }))
// )

// import type { profileState } from './vanillaStore'
// import { profileStore } from './vanillaStore'
// import React from 'react'

// export function useProfileStore(selector = (state: profileState) => state) {
//   const [state, setState] = React.useState(selector(profileStore.getState()))

//   React.useEffect(() => {
//     const unsubscribe = profileStore.subscribe(newState => {
//       setState(selector(newState))
//     })
//     return unsubscribe
//   }, [selector])

//   return state
// }