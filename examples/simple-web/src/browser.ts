import { ethers } from "ethers";

import { w3bFunctions, w3bObservables } from "@w3bsauce/core";
import metamask from "@w3bsauce/metamask";

// import walletconnect from "@w3bsauce/walletconnect";

import type { W3bConnector, W3bConfig, W3bFunctions } from "@w3bsauce/core/bin/types";

import settings from './w3bsauce.config';

declare const window: any;

const chainIdObserver = {
  next(x: any) {
    document.getElementById("noteDiv")!.innerHTML = `ChainId${x}`;
  },
  error(err: Error) {
    console.error("something wrong occurred: " + err);
  },
  // complete() { console.log('done');}
};

w3bObservables.chainId.subscribe(chainIdObserver);
w3bObservables.chainId.subscribe((_chainId: number | undefined) =>
  console.log("chainId: ", _chainId)
);
w3bObservables.accounts.subscribe((_accounts: string[]) =>
  console.log("accounts are: ", _accounts)
);
w3bObservables.activeConnector.subscribe((_connectorId: string | undefined) =>
  console.log("active: ", _connectorId)
);
w3bObservables.activatingConnector.subscribe((_connectorId: string | undefined) =>
  console.log("activating: ", _connectorId)
);

// handling networkProvider change example
w3bObservables.networkProvider?.subscribe(
  async (_networkProvider: ethers.providers.BaseProvider) =>
    _networkProvider &&
    console.log(
      "networkProvider chainId",
      (await _networkProvider.getNetwork()).chainId
    )
);

// handling provider change example
w3bObservables.provider?.subscribe(
  async (_provider: ethers.providers.Web3Provider) =>
    _provider &&
    console.log("provider chainId", (await _provider.getNetwork()).chainId)
);

// handling an error event example
w3bObservables.error.subscribe((x: any) => {
  console.log(x.code, x.message);
  window.alert(x.message);
});

// EXAMPLE: handling diagnostics
w3bObservables.diagnostics.subscribe((x: string) => {
  console.log(x);
});

// EXAMPLE: Handling an active connection
w3bObservables.activeConnector?.subscribe((x) => {
  if (x) {
    console.log("CONNECTED:", x);
    document.getElementById("connectedButton")!.removeAttribute("disabled");
    document.getElementById("connectedDiv")!.innerHTML = `Connected to:  ${x}`;
    document.getElementById(
      "activeWalletDiv"
    )!.innerHTML = `Is wallet connected: ${!!x}`;
  } else {
    console.log("not connected");
    document.getElementById("connectedDiv")!.style.display = "none";
    document.getElementById(
      "activeWalletDiv"
    )!.innerHTML = `Is wallet connected: ${!!x}`;
  }
});

// EXAMPLE: Handling activating connection!
w3bObservables.activatingConnector?.subscribe((x) => {
  x && console.log("CONNECTING TO.....", x);
});


// EXMAPLE use config in an external file:
w3bFunctions.updateConfig( settings );
// EXAMPLE change ONE config setting the w3bconfig: 
w3bFunctions.updateConfig( { useEip1193Bridge:false } as W3bConfig);

// EXAMPLE setting the W3bConnector to Metamask package (imported up top):
const selectedW3bConnector: W3bConnector = metamask;

// EXAMPLE: Add all w3bfunctions and customProviderFunctions to the global window state
(window as W3bFunctions).activate = () =>
  w3bFunctions.activate(selectedW3bConnector);
w3bObservables.providerFunctions.subscribe((fns: any) => {
  window.providerFunctions = { ...fns };
});
