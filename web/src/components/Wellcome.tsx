import { useProfileStore } from '@/store/profileStore'
import { SignInModal } from '@/components/SignInModal'
import { SignUpModal } from '@/components/SignUpModal'

export function Wellcome() {
  const { user, token } = useProfileStore(state => state)
  return (
    <>
      <div className='m-4 text-xs md:text-base '>
        {token && user && <p>{`Bienvenido ${user.firstName}`}</p>}
        {(!token) && <p className='flex flex-row'>Para continuar ➡️<span className='mx-2'><SignInModal text='Inicia sesión' /></span></p>}
        {(!token) && <p className='flex flex-row'>También puedes ➡️<span className='mx-2'><SignUpModal text='Crear cuenta' /></span></p>}
      </div>
    </>
  )
}