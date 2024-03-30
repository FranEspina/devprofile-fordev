'use client'
import { useProfileStore } from "@/store/profileStore";
import { EVENTS_MENU } from "@/constant";

interface ItemListNavProps {
  authRequired?: boolean,
  hideLogged?: boolean,
  hoverStyled?: boolean,
  children?: React.JSX.Element | string,
  onClick?: () => void
}

export function ItemListNav({ authRequired, hideLogged, children, hoverStyled = false, onClick }: ItemListNavProps) {

  const { token } = useProfileStore((state) => state);

  //Solo mostramos si está logado
  if (authRequired) {
    if (token === '' || token === 'not-loaded') {
      return null
    }
  }

  //No se muestra si está logado
  if (hideLogged) {
    if (token !== '' && token !== 'not-loaded') {
      return null
    }
  }

  return (
    <li className={hoverStyled ? 'hover:text-blue-400 hover:cursor-pointer hover:shadow-lg transition-colors duration-300 uppercase text-xs md:text-base' : 'text-xs md:text-base'}
      onClick={
        () => {
          if (onClick) {
            onClick()
            window.dispatchEvent(new Event(EVENTS_MENU.CloseMenu));
          }
        }
      }>
      {children}
    </li >
  )
}