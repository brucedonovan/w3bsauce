"use client";

import React, { useEffect } from "react";
import { Observable } from 'rxjs';
import { w3bObservables, w3bFunctions, _w3bSubjects } from "@w3bsauce/core";
import { W3bState } from "@w3bsauce/core/bin/types";

/* Build the context */
const W3bContext = React.createContext<any>({});

/* useObservable hook */
export const useObservable = (observable:  Observable<any>) => {
  const [value, setValue] = React.useState()
  const [error, setError] = React.useState()
  useEffect(() => {
    const subscription = observable.subscribe( { next: setValue, error: setError })
    return () => subscription.unsubscribe()
  }, [observable])
  return [value, error];
}

/* Build up the Provider state */
const W3bProvider = ({ children }: any) => {

  const accounts = useObservable( w3bObservables.accounts)[0];
  const activeConnector = useObservable( w3bObservables.activeConnector)[0];
  const activatingConnector = useObservable( w3bObservables.activatingConnector)[0];
  const provider = useObservable( w3bObservables.provider)[0];
  const networkProvider = useObservable( w3bObservables.networkProvider)[0];
  const chainId= useObservable( w3bObservables.chainId)[0];
  const error= useObservable( w3bObservables.error)[0];
  const diagnostics= useObservable( w3bObservables.diagnostics)[0];

  const w3bState: W3bState = { 
    accounts: accounts || [],
    activeConnector, 
    activatingConnector,
    provider,
    networkProvider,
    chainId,
    error,
    diagnostics
  }

  return (
    <W3bContext.Provider value={{ w3bState, w3bFunctions }}>
      {children}
    </W3bContext.Provider>
  );
};

/* Returns the Context, Provider (and raw Observables?) */
export { W3bContext, W3bProvider };
