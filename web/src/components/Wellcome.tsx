import { useProfileStore } from '@/store/profileStore'

export function Wellcome() {
  const { user, token } = useProfileStore(state => state)
  return (
    <>
      {token && <p>{`Bienvenido ${user.firstName}`}</p>}
      {(!token) && <p>Recuerda iniciar sesión</p>}
    </>
  )
}