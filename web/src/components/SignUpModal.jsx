import { Modal } from './Modal.jsx'
import { useState } from 'react'
import { useNotify } from '@/hooks/useNotify'
import { register } from '@/services/auth';
import { useProfileStore } from '@/store/profileStore'
import { UserRegisterFormSchema } from '@/Schemas/userSchema'
import { z } from 'astro/zod'

export const SignUpModal = ({ text = 'Registrar' }) => {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useNotify()
  const { setUser, setToken } = useProfileStore(state => state)

  const showModal = () => {
    setShow(true)
  }

  const hideModal = (e) => {
    e.preventDefault()
    setErrors([])
    setShow(false)
  }

  const confirmModal = async (e) => {
    setLoading(true)

    var form = document.getElementById("user-sign-up-form");
    const userForm = {
      firstName: form.elements['first_name'].value,
      lastName: form.elements['last_name'].value,
      email: form.elements['email'].value,
      password: form.elements['password'].value,
      passwordConfirmation: form.elements['password_confirmation'].value,
    }

    const parsed = await UserRegisterFormSchema.safeParseAsync(userForm)
    if (!parsed.success) {
      const errors = {};
      if (parsed.error instanceof z.ZodError) {
        parsed.error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
      } else {
        errors['generic'] = parsed.error
      }
      setErrors(errors)
      setLoading(false)
      return
    }

    try {
      var { success, message, token, data } = await register(userForm)
      if (success) {
        setUser(data)
        setToken(token || '')
        notifySuccess(message)
        setErrors([])
        setShow(false)
      }
      else {
        const errors = {}
        errors['generic'] = message
        setErrors(errors)
      }
    }
    finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'first_name', schema: 'firstName', desc: 'Nombre:', type: 'text', placeholder: 'xxxxx' },
    { name: 'last_name', schema: 'lastName', desc: 'Apellidos:', type: 'text', placeholder: 'xxxxx' },
    { name: 'email', schema: 'email', desc: 'Correo:', type: 'email', placeholder: 'xxxxx@xxxx.xxx' },
    { name: 'password', schema: 'password', desc: 'Clave:', type: 'password', placeholder: 'xxxxx' },
    { name: 'password_confirmation', schema: 'passwordConfirmation', desc: 'Repetir clave:', type: 'password', placeholder: 'xxxxx' }]


  return (
    <div>
      <Modal className="w-80 md:w-96" title='Registro' textConfirm="Registrar" show={show} handleCancel={hideModal} handleConfirm={confirmModal} loading={loading}>
        <form id='user-sign-up-form' action="submit" className="px-3 md:px-5 py-2 text-xxs md:text-xs" >
          <fieldset >
            {fields.map((field) =>
              <div key={field.name} className="flex flex-col gap-1">
                <div className='flex flex-row'>
                  <label htmlFor={field.name} className="mb-2">{field.desc}</label>
                  {errors[field.schema] && <p className='text-xxs md:text-xs text-blue-500 ml-1'>{errors[field.schema]}</p>}
                </div>
                <input className="mb-4 w-full py-2 px-4 block text-xxs md:text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                  type={field.type} id={field.name} name={field.name}
                  placeholder={field.placeholder} autocomplete="off" />
              </div>
            )}
          </fieldset>
          {errors['generic'] && <p className='text-xxs md:text-xs text-center text-blue-500 ml-1'>{errors['generic']}</p>}
        </form>
      </Modal>

      <button className='uppercase hover:text-blue-500 hover:cursor-pointer hover:shadow-lg transition-colors duration-300'
        type="button"
        onClick={showModal}>
        {text}
      </button>
    </div>
  )
}