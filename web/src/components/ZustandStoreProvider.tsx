import React, { useEffect } from 'react';
import { useRefreshStore } from "../store/refreshStore"
import type { EnumType } from 'typescript';

export const enum EVENTS_UPDATE {
  RefreshBasic = "RefreshBasic",
  RefreshAll = "RefreshAll"
}

const ZustandStoreProvider = () => {
  const { setBasicStamp, setAllStamp } = useRefreshStore(state => state);

  useEffect(() => {
    const refreshBasic = () => {
      setBasicStamp(Date.now());
    };

    const refreshAll = () => {
      setAllStamp();
    };

    window.addEventListener(EVENTS_UPDATE.RefreshBasic, refreshBasic);
    window.addEventListener(EVENTS_UPDATE.RefreshAll, refreshAll);

    return () => {
      window.removeEventListener(EVENTS_UPDATE.RefreshBasic, refreshBasic);
      window.removeEventListener(EVENTS_UPDATE.RefreshAll, refreshAll);

    };
  }, []);
};

export default ZustandStoreProvider;