import React, { useEffect } from 'react';
import { useRefreshStore } from "../store/refreshStore"
import { useProfileStore } from "../store/profileStore"
import type { EnumType } from 'typescript';
import { useNotify } from '@/hooks/useNotify';

export const enum EVENTS_UPDATE {
  RefreshBasic = "RefreshBasic",
  RefreshAll = "RefreshAll",
  Unauthorized = "Unauthorized"
}

const ZustandStoreProvider = () => {
  const { setBasicStamp, setAllStamp } = useRefreshStore(state => state);
  const { setToken, setUser } = useProfileStore(state => state)
  const { notifyError } = useNotify()

  useEffect(() => {
    const refreshBasic = () => {
      setBasicStamp(Date.now());
    };

    const refreshAll = () => {
      setAllStamp();
    };

    const unauthorized = () => {
      setToken('')
      setUser(undefined)
      notifyError('Usuario no autorizado')
    }

    window.addEventListener(EVENTS_UPDATE.RefreshBasic, refreshBasic);
    window.addEventListener(EVENTS_UPDATE.RefreshAll, refreshAll);
    window.addEventListener(EVENTS_UPDATE.Unauthorized, unauthorized);

    return () => {
      window.removeEventListener(EVENTS_UPDATE.RefreshBasic, refreshBasic);
      window.removeEventListener(EVENTS_UPDATE.RefreshAll, refreshAll);
      window.removeEventListener(EVENTS_UPDATE.Unauthorized, unauthorized);

    };
  }, []);
};

export default ZustandStoreProvider;