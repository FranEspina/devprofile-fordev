import { Modal } from './Modal.jsx'
import { useState } from 'react'
import { useNotify } from '@/hooks/useNotify'
import { register } from '@/services/auth.ts';
import { useProfileStore } from '@/store/profileStore'


export const SignUpModal = () => {
  const [show, setShow] = useState(false);

  const { notifyError, notifySuccess } = useNotify()
  const { setUser, setToken } = useProfileStore(state => state)


  const showModal = () => {
    setShow(true)
  }

  const hideModal = (e) => {
    e.preventDefault()
    setShow(false)
  }

  const confirmModal = async (e) => {
    e.preventDefault()

    var form = document.getElementById("signUpForm");
    var formData = new FormData(form);


    const userForm = {
      firstName: form.elements['first_name'].value,
      lastName: form.elements['last_name'].value,
      email: form.elements['email'].value,
      password: form.elements['password'].value,
    }

    var { success, message, token, user } = await register(userForm)
    if (success) {
      setUser(user)
      setToken(token || '')
      notifySuccess(message)
      setShow(false)
    }
    else {
      notifyError(message)
    }
  }

  const fields = [
    { name: 'first_name', desc: 'Nombre:', type: 'text', placeholder: 'xxxxx' },
    { name: 'last_name', desc: 'Apellidos:', type: 'text', placeholder: 'xxxxx' },
    { name: 'email', desc: 'Correo electrónico:', type: 'email', placeholder: 'xxxxx' },
    { name: 'password', desc: 'Contraseña:', type: 'password', placeholder: 'xxxxx' },
    { name: 'password_repeat', desc: 'Repetir contraseña:', type: 'password', placeholder: 'xxxxx' }]


  return (
    <div>
      <Modal className="w-80 md:w-96" title='Registro' textConfirm="Registrar" show={show} handleCancel={hideModal} handleConfirm={confirmModal}>
        <form id='signUpForm' action="submit" className="px-10 py-2 text-xs" >
          <fieldset >
            {fields.map((field) =>
              <div key={field.name} className="flex flex-col gap-1">
                <label htmlFor={field.name} className="mb-2">{field.desc}</label>
                <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                  type={field.type} id={field.name} name={field.name}
                  placeholder={field.placeholder} />
              </div>
            )}
          </fieldset>
        </form>
      </Modal>

      <button className='hover:text-blue-500 hover:cursor-pointer hover:shadow-lg transition-colors duration-300'
        type="button"
        onClick={showModal}>
        Registro
      </button>
    </div>
  )
}