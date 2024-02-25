import React, { useEffect, useRef, useState } from 'react';
import CloseButton from './CloseButton';

// Modal Component
export const Modal = ({ title, show, handleConfirm, textConfirm, handleCancel, children }) => {

  return (show &&
    <div className="fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-black/90">
      <section className='bg-[#101015] my-[5%] mx-auto w-[80%] shadow-md shadow-blue-500 flex flex-col border border-blue-500'>
        <header className="relative bg-blue-800 p-2">
          <h1 className='text-gray-50 text-2xl' >{title}</h1>
          <CloseButton onClick={handleCancel}/>
        </header>
        <main className="flex-1 my-3">
          {children}
        </main>
        <footer className="flex flex-row justify-end gap-2 mb-7 mr-10" >
       
          {<button className='border border-gray-50 px-5 py-2 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer hover:shadow-lg transition-colors duration-300' onClick={handleConfirm}>
            {textConfirm}
          </button>}

          <button className='border border-gray-50 px-5 py-2 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer hover:shadow-lg transition-colors duration-300' onClick={handleCancel}>
            Cancelar
          </button>

        </footer>
      </section>
    </div>
  )
}





