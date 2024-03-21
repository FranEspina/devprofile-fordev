import { Modal } from './Modal.jsx'
import { useState } from 'react'
import { useNotify } from '@/hooks/useNotify'
import { login } from '@/services/apiService'
import { useProfileStore } from '@/store/profileStore'
import { UserLoginFormSchema } from '@/Schemas/userSchema';
import { z } from 'astro/zod'
import { navigate } from 'astro/virtual-modules/transitions-router.js'

export const SignInModal = ({ text = 'Iniciar sesión' }) => {
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

    var form = document.getElementById("user-sign-in-form");
    const userForm = {
      email: form.elements['email'].value,
      password: form.elements['password'].value,
    }

    const parsed = await UserLoginFormSchema.safeParseAsync(userForm)
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
      var { success, message, token, data } = await login(userForm)
      if (success) {
        setUser(data)
        setToken(token ?? '')
        notifySuccess(message)
        setErrors([])
        setShow(false)
        navigate('/curriculum')
        return
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
    { name: 'email', schema: 'email', desc: 'Correo:', type: 'email', placeholder: 'xxxxx@xxxx.xxx' },
    { name: 'password', schema: 'password', desc: 'Clave:', type: 'password', placeholder: 'xxxxx' },
  ]

  return (
    <div>
      <Modal className="w-80 md:w-96" title='Inicio de sesión' textConfirm="Iniciar sesión" show={show} handleCancel={hideModal} handleConfirm={confirmModal} loading={loading}>
        <form id='user-sign-in-form' action="submit" className="px-3 md:px-5 py-2 text-xxs md:text-xs" >
          <fieldset >
            {fields.map((field) =>
              <div key={field.name} className="flex flex-col gap-1">
                <div className='flex flex-row'>
                  <label htmlFor={field.name} className="mb-2">{field.desc}</label>
                  {errors[field.schema] && <p className='text-xxs md:text-xs text-blue-500 ml-1'>{errors[field.schema]}</p>}
                </div>
                <input className="mb-4 w-full py-2 px-4 block text-xxs md:text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                  type={field.type} id={field.name} name={field.name}
                  placeholder={field.placeholder} />
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