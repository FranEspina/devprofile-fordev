import { Modal } from './Modal.jsx'
import { useState } from 'react'


export const SignUpModal = () => {
  const [show, setShow] = useState(false);

  const showModal = () => {
    setShow(true);
  };

  const hideModal = (e) => {
    e.preventDefault()
    setShow(false);
  };

  return (
    <div>
      <Modal title='Registro' textConfirm="Registrar" show={show} handleCancel={hideModal} handleAccept={hideModal}>
        
        <form action="submit" className="px-10 py-2 text-xs" >
          <fieldset >
            <div className="flex flex-col gap-1">
              <label for="name" className="mb-2">Nombre:</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"  type="text" id="firstname" name="first_name"
                placeholder='xxxxx'
                ></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="name">Apellidos</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600" type="text" id="lastname" name="last_name"
              placeholder='xxxxx xxxxx'></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="email">Correo electrónico</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600" type="email" id="email" name="email"
              placeholder='xxxxx@xxxxx.xxx'></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="password">Contraseña</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600" type="password" id="password" name="password" placeholder='xxxxx'></input>
            </div>
            <div className="flex flex-col gap-1">
              <label for="password-repeat">Contraseña</label>
              <input className="mb-4 w-full py-2 px-4 block text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600" type="password" id="password-repeat" name="password_repeat" placeholder='xxxxx'></input>
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