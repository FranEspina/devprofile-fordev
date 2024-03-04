import { useProfileStore } from '@/store/profileStore'
import { SignInModal } from '@/components/SignInModal'
import { SignUpModal } from '@/components/SignUpModal'

export function Wellcome() {
  const { user, token } = useProfileStore(state => state)
  return (
    <>
      <div className='m-4 text-xs md:text-base '>
        {token && user && <p>Bienvenido <span className='text-lg md:text-xl text-blue-500'>{user.firstName}</span></p>}
        {!(token && user) &&
          <div className='flex flex-col'>
            <div className='flex flex-row'>
              <p className='columns-1'>Para continuar ➡️</p>
              <SignInModal text='Inicia sesión' />
            </div>
            <div className='flex flex-row'>
              <p className='columns-1'>También puedes ➡️</p>
              <SignUpModal text='Crear cuenta' />
            </div >
          </div >
        }
      </div>
    </>
  )
}