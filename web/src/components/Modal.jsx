import React, { useEffect, useRef, useState } from 'react';
import CloseButton from './CloseButton'
import classNames from 'classnames';

// Modal Component
export const Modal = ({ title, show, handleConfirm, textConfirm, handleCancel, className = '', loading, children }) => {
  return (show &&
    <div className="fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-black/90">
      <section className={classNames('bg-[#101015] my-[5%] w-[80%] mx-auto  shadow-md shadow-blue-500 flex flex-col border border-blue-500', className)}>
        <header className="relative bg-blue-800 p-2">
          <h1 className='text-gray-50 text-base md:text-lg' >{title}</h1>
          <CloseButton size='mobile' onClick={handleCancel} />
        </header>
        <main className="flex-1 mt-3 md:my-3">
          {children}
        </main>
        <footer className="flex flex-row justify-center gap-2 mb-4 md:mb-7 text-[10px]" >
          <button
            className={classNames('uppercase border border-gray-50 px-2 md:px-5 py-1', loading ? '' : ' hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer hover:shadow-lg transition-colors duration-300')}
            onClick={handleConfirm} disabled={loading}>
            {loading &&
              <svg class="animate-spin h-5 w-5 "
                fill="none"
                viewBox='0 0 24 24'
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
            {!loading && textConfirm}
          </button>

          <button
            className='uppercase border border-gray-50 px-5 py-1 hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer hover:shadow-lg transition-colors duration-300'
            onClick={handleCancel}>
            Cancelar
          </button>

        </footer>
      </section>
    </div>
  )
}





