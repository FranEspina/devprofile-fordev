import { useProfileStore } from '@/store/profileStore'
import { SignInModal } from '@/components/SignInModal'

export function Wellcome() {
  const { user, token } = useProfileStore(state => state)
  return (
    <>
      <div className='m-4 text-xs md:text-base '>
        {token && <p>{`Bienvenido ${user.firstName}`}</p>}
        {(!token) && <p className='flex flex-row'>Para continuar ➡️<span className='mx-2'><SignInModal text='Inicia sesión' /></span></p>}
      </div>
    </>
  )
}