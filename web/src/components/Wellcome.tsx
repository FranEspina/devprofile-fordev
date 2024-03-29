import { useProfileStore } from '@/store/profileStore'
import { SignInModal } from '@/components/SignInModal'
import { SignUpModal } from '@/components/SignUpModal'

export function Wellcome() {
  const { user, token } = useProfileStore(state => state)
  console.log(user)
  return (
    <>
      <div className='text-xs md:text-base  '>
        {(token && user)
          ?
          <div className='flex flex-col items-center ms:items-end'>
            <p>Bienvenido <span className='text-xl md:text-2xl text-blue-500'>{user.firstName}</span></p>
            <a className="hover:text-blue-400 hover:cursor-pointer hover:shadow-lg transition-colors duration-300  text-xs md:text-base" href="/curriculum/">
              Edita tu <span className='text-lg md:text-xl uppercase'>Curriculum</span>
            </a>
          </div>
          :
          <div className='flex flex-row gap-4 '>
            <div className='flex flex-row gap-2'>
              <p >➡️</p>
              <SignInModal text='Inicia sesión' dataCyOpenSignButton='open-modal-sign-button' dataCyConfirmSignButton='confirm-sign-button' />
            </div>
            <div className='flex flex-row gap-2'>
              <p >➡️</p>
              <SignUpModal text='Crear cuenta' />
            </div >
          </div >
        }
      </div>
    </>
  )
}