import { Modal } from '@/components/Modal.jsx'
import { useState, useRef } from 'react'
import { useNotify } from '@/hooks/useNotify'
import { createUserSection } from '@/services/apiService'
import { ResourceCreateSchema } from '@/Schemas/resourceSchema';
import type { ResourceCreate } from '@/Schemas/resourceSchema';

import { z } from 'astro/zod'
import { useProfileStore } from '@/store/profileStore';

export const CreateResourceModal = ({ text = 'Crear Recurso', callback }: {
  text?: string, callback: (...args: any[]) => any
}) => {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useNotify()
  const { user, token } = useProfileStore(state => state)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const typeInputRef = useRef<HTMLInputElement>(null)
  const keywordsInputRef = useRef<HTMLInputElement>(null)

  const showModal = () => {
    setShow(true)
  }

  const hideModal: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setErrors({})
    setShow(false)
    setLoading(false)
  }

  const confirmModal: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (!user) return

    setLoading(true)

    const resourceForm = {
      userId: user.id,
      title: titleInputRef?.current?.value,
      description: descriptionInputRef?.current?.value,
      url: urlInputRef?.current?.value,
      type: typeInputRef?.current?.value,
      keywords: keywordsInputRef?.current?.value,
    }

    const parsed = await ResourceCreateSchema.safeParseAsync(resourceForm)
    if (!parsed.success) {
      resourceForm
      const errors: { [key: string]: string } = {}
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
      const { success, message } = await createUserSection<ResourceCreate>("resource", parsed.data, user.id, token)
      if (success) {
        notifySuccess(message)
        setErrors({})
        callback()
        setShow(false)
        return
      }
      else {
        const errors: { [key: string]: string } = {}
        errors['generic'] = message
        setErrors(errors)
      }
    }
    finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'title', schema: 'title', desc: 'Recurso:', type: 'text', placeholder: 'xxxxxxxxxxx', ref: titleInputRef },
    { name: 'description', schema: 'description', desc: 'Descripción:', type: 'text', placeholder: 'xxxxxxxxxxx', ref: descriptionInputRef },
    { name: 'keywords', schema: 'keywords', desc: 'Keyword(s):', type: 'text', placeholder: 'xxxxxxxxxxx', ref: keywordsInputRef },
    { name: 'type', schema: 'type', desc: 'Tipo:', type: 'text', placeholder: 'xxxxxxxxxxx', ref: typeInputRef },
    { name: 'url', schema: 'url', desc: 'Url:', type: 'url', placeholder: 'https://...', ref: urlInputRef },
  ]

  return (
    <div>
      <Modal className="w-80 md:w-96" title='Nuevo recurso' textConfirm="Crear" show={show} handleCancel={hideModal} handleConfirm={confirmModal} loading={loading}>
        <form action="submit" className="px-3 md:px-5 py-2 text-xxs md:text-xs" >
          <fieldset >
            {fields.map((field) =>
              <div key={field.name} className="flex flex-col gap-1">
                <div className='flex flex-row'>
                  <label htmlFor={field.name} className="mb-2">{field.desc}</label>
                  {errors[field.schema] && <p className='text-xxs md:text-xs text-blue-500 ml-1'>{errors[field.schema]}</p>}
                </div>
                <input ref={field.ref} className="mb-4 w-full py-2 px-4 block text-xxs md:text-xs disabled:opacity-50 disabled:pointer-events-none bg-blue-950 border-blue-300 text-gray-50 focus:border-blue-500  focus:ring-blue-600 placeholder-gray-600"
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