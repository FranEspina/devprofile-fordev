import { Modal } from './Modal.jsx'
import { useState } from 'react'
import axios from 'axios'


export const SignUpModal = () => {
  const [show, setShow] = useState(false);

  const showModal = () => {
    setShow(true)
  }

  const hideModal = (e) => {
    e.preventDefault()
    setShow(false)
  }

  const confirmModal = (e) => {
    e.preventDefault()

    var form = document.getElementById("signUpForm");
    var formData = new FormData(form);

    const body = {
      firstName: form.elements['first_name'].value,
      lastName: form.elements['last_name'].value,
      email: form.elements['email'].value,
      password: form.elements['password'].value,
    }

    const baseUrl = 'https://devprofile-fordev-dev-knsf.1.ie-1.fl0.io/auth/register'
    axios.post(baseUrl, body)
      .then((response) => {
        console.log(response.data);
        setShow(false)
      })
      .catch((err) => {
        console.log('error')
        console.log(err)
      })
  }

  return (
    <div>
      <Modal title='Registro' textConfirm="Registrar" show={show} handleCancel={hideModal} handleConfirm={confirmModal}>

        <form id='signUpForm' action="submit" className="px-10 py-2 text-xs" >
          <fieldset >
            <div className="flex flex-col gap-1">
              <label for="first_name" className="mb-2">Nombre:</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                type="text" id="first_name" name="first_name"
                placeholder='xxxxx'
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="last_name">Apellidos</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                type="text" id="last_name" name="last_name"
                placeholder='xxxxx xxxxx'></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="email">Correo electrónico</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                type="email" id="email" name="email"
                placeholder='xxxxx@xxxxx.xxx'></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="password">Contraseña</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                type="password" id="password" name="password" placeholder='xxxxx'></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="password_repeat">Contraseña</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
                type="password" id="password_repeat" name="password_repeat" placeholder='xxxxx'></input>
            </div>
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