import {
  EIP1193Provider,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
} from "./types/eip1193";
import { _w3bSubjects } from ".";

export const requestAccounts = async (
  connection: EIP1193Provider,
  callback: (x: any) => void = () => null
) => {
  connection
    .request({ method: "eth_requestAccounts", params: [] })
    .then((x: any) => callback(x) )
    .catch((e) => {
      _w3bSubjects.error$.next(e as ProviderRpcError);
      _w3bSubjects.activating$.next(undefined);
    });
};

/**
 * 
 * 
 * listener section 
 * 
 * */
const _handleAccountsChanged = (accounts: string[]) => {
  // Handle the new accounts, or lack thereof.
  _w3bSubjects.accounts$.next(accounts); // "accounts" will always be an array, but it can be empty.
  _w3bSubjects.diagnostics$.next('Diagnostics: account changed!!!!'); 
  if (accounts.length === 0) _w3bSubjects.active$.next(undefined); // set active to undefined if no account
};

const _handleChainChanged = (chainId: string) => {
  const _chainId = parseInt(chainId as string, 16);
  _w3bSubjects.chainId$.next(_chainId);
  _w3bSubjects.diagnostics$.next('_chainId changed!!!!'); 

  // We recommend reloading the page unless you have good reason not to.
  _w3bSubjects.config$.subscribe( (x) => x.reloadOnNetworkChange && window.location.reload() ) 
};

const _handleMessage = (message: ProviderMessage) => {
  console.log(`new message: type> ${message.type}, data>${message.data}`);
};

const _handleConnect = (connectInfo: ProviderConnectInfo) => {

  console.log( connectInfo )
  // console.log(`Connection established to ${connectInfo.chainId}`);
};

const _handleDisconnect = (error: ProviderRpcError) => {
  console.log(
    `Ethereum Provider connection closed: ${error.message}. Code: ${error.code}`
  );
  _w3bSubjects.active$.next(undefined);
};

export const addAllEventListeners = (connection: EIP1193Provider) => {
  connection.on("connect", _handleConnect);
  connection.on("disconnect", _handleDisconnect);
  connection.on("accountsChanged", _handleAccountsChanged);
  connection.on("chainChanged", _handleChainChanged);
  connection.on("message", _handleMessage);
};

export const addEventListener = (
  connection: EIP1193Provider,
  eventName: string
) => {
  switch (eventName) {
    case "accountsChanged":
      connection.on(eventName, _handleAccountsChanged);
      break;
    case "chainChanged":
      connection.on(eventName, _handleChainChanged);
      break;
    default:
      console.log("Event not recognised");
  }
};

export const removeEventListener = (
  connection: EIP1193Provider,
  eventName: string
) => {
  switch (eventName) {
    case "accountsChanged":
      connection.removeListener(eventName, _handleAccountsChanged);
      break;
    case "chainChanged":
      connection.removeListener(eventName, _handleChainChanged);
      break;
    default:
      console.log("Event not recognised");
  }
};
