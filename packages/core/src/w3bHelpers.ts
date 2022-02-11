import {
  EIP1193Provider,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from "./types/eip1193";

import { addAllEventListeners, requestAccounts } from "./eip1193Common";

import { _w3bSubjects } from ".";
import { ProviderModule } from "./types";

/**
 * 
 * Activate connection
 * @param _c Provider module
 *
 */
export const handleActivate = async (_c: ProviderModule) => {
  // set activating connection
  _w3bSubjects.activating$.next(_c.connectionId);

  // Custom Activate or gerneic eth_requestAccounts
  const customActivateFunction = _c.providerFunctionMap.get("activate");
  if (customActivateFunction) {
    // if there is a custom function use it:
    customActivateFunction()
      .then((_acc: string[]) => _handleActivateSuccess(_acc))
      .catch((err) => _handleActivateError(err));
  } else {
    // request the accounts from EIP1193Proivder:
    requestAccounts(_c.provider, (_acc: string[]) =>
      _handleActivateSuccess(_acc)
    );
  }
  const _handleActivateSuccess = (_acc: string[]) => {
    // return of any accounts.length signifies success ( therefore set connection as active)
    if (_acc.length) {
      _w3bSubjects.accounts$.next(_acc);
      _w3bSubjects.connection$.next(_c);
      _w3bSubjects.active$.next(_c.connectionId);
      _w3bSubjects.activating$.next(undefined);
    }
  };
  const _handleActivateError = (err: ProviderRpcError) => {
    _w3bSubjects.error$.next(err);
    _w3bSubjects.activating$.next(undefined);
  };
};
