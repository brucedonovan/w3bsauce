import {
  EIP1193Provider,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from "./types/eip1193";

import { _w3bSubjects } from ".";

/**
 * generic EIP1193 connection
 * */
export const requestAccounts = async (
  connection: EIP1193Provider,
  callback: (x: any) => void = () => null
) => {
  connection
    .request({ method: "eth_requestAccounts", params: [] })
    .then((x: any) => callback(x))
    .catch((e) => {
      _w3bSubjects.error$.next(e as ProviderRpcError);
      _w3bSubjects.activating$.next(undefined);
    });
};

/**
 * listener handlers
 * */
const _handleAccountsChanged = (accounts: string[]) => {
  // Handle the new accounts, or lack thereof, [].
  _w3bSubjects.accounts$.next(accounts);
  _w3bSubjects.diagnostics$.next(`Account changed: ${accounts}`);
  if (accounts.length === 0)_w3bSubjects.active$.next(undefined); // set active to undefined if no account
};

const _handleChainChanged = (chainId: string) => {
  const _chainId = parseInt(chainId as string, 16);
  _w3bSubjects.chainId$.next(_chainId);
  _w3bSubjects.diagnostics$.next(`Network changed: ${chainId}`);

  // We recommend reloading the page unless you have good reason not to.
  _w3bSubjects.config$.subscribe(
    (x) => x.reloadOnNetworkChange && window.location.reload()
  );
};

const _handleMessage = (message: ProviderMessage) => {
  _w3bSubjects.diagnostics$.next(
    `Eip1193 message type: ${message.type} data: ${message.data} `
  );
};

const _handleConnect = (connectInfo: ProviderConnectInfo) => {
  _w3bSubjects.diagnostics$.next(`New connection: ${connectInfo.chainId}`);
};

const _handleDisconnect = (error: ProviderRpcError) => {
  error.message
    ? _w3bSubjects.diagnostics$.next(
        `Connection closed Error: ${error.message} (${error.code})`
      )
    : _w3bSubjects.diagnostics$.next(
        `Connection closed: ( error > ${error.message} code>${error.code} )`
      );
      _w3bSubjects.active$.next(undefined);
};

/**
 * listeners subscribe/unsubscribe
 * */
const handlerMap: Map<string, () => any> = new Map([
  ["connect", _handleConnect] as any,
  ["disconnect", _handleDisconnect],
  ["accountsChanged", _handleAccountsChanged],
  ["chainChanged", _handleChainChanged],
  ["message", _handleMessage],
]);

export const addAllEventListeners = (connection: EIP1193Provider) => {
  handlerMap.forEach((val: () => any, key: string) => {
    connection.on(key as any, val);
  });
};

export const addEventListener = (
  connection: EIP1193Provider,
  eventName: string
) => {
  handlerMap.get(eventName)
    ? connection.on(eventName as any, handlerMap.get(eventName)!)
    : _w3bSubjects.error$.next({
        name: "ListenerError",
        message: "Unknown Listener",
        code: 0,
      });
};

export const removeEventListener = (
  connection: EIP1193Provider,
  eventName: string
) => {
  handlerMap.get(eventName)
    ? connection.removeListener(eventName as any, handlerMap.get(eventName)!)
    : _w3bSubjects.error$.next({
        name: "ListenerError",
        message: "Unknown Listener",
        code: 0,
      });
};
