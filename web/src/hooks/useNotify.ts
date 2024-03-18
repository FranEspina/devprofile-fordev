import { toast, Bounce } from 'react-toastify';

export function useNotify() {

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })

  return { notifyError, notifySuccess }
}