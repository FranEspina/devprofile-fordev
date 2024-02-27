import { useProfileStore } from '@/store/profileStore'
import { ItemListNav } from "@/components/ItemListNav.tsx";
import { useNotify } from '@/hooks/useNotify'


interface LogoutProps {
  authRequired?: boolean,
  children?: React.JSX.Element | string
}

export function Logout({ authRequired, children }: LogoutProps) {

  const { setUser, setToken } = useProfileStore((state) => state);
  const { notifySuccess } = useNotify()

  const handleClick = () => {
    setUser(undefined)
    setToken('')
    notifySuccess('Sesión cerrada')
  }

  return <ItemListNav authRequired={authRequired} onClick={handleClick}>{children}</ItemListNav>
}