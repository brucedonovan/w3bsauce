import {W3bConnector, W3bConnectorId} from '@w3bsauce/core/bin/types';

declare const window: any;
const ethereum = window.ethereum;
const connectorId = W3bConnectorId.metamask;

const isMetaMask = ethereum.isMetaMask;

const switchEthereumChain = (chainIdAsHex: string) =>
  ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: chainIdAsHex }], // chainId must be in hexadecimal numbers
  });

const addEthereumChain = (chainIdAsHex: string) =>
  ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{ chainId: chainIdAsHex }], // chainId must be in hexadecimal numbers
  });

const watchAsset = (assetAddress: string) =>
  ethereum.request({
    method: "wallet_watchAsset",
    params: [{ address: assetAddress }], // chainId must be in hexadecimal numbers
  });

const activate = () => ethereum.request({ method: "eth_requestAccounts", params: [] })

const provider: W3bConnector = {
  provider: ethereum,
  connectorId,
  providerFunctionMap: new Map([
    ["activate", activate ],
    ["isMetaMask", isMetaMask],
    ["switchEthereumChain", switchEthereumChain],
    ["addEthereumChain", addEthereumChain],
    ["watchAsset", watchAsset],
  ]),
};

/* Restricted Methods */
// eth_requestAccounts
// wallet_getPermissions
// wallet_requestPermissions

/* Unrestricted Methods */
// eth_decrypt
// eth_getEncryptionPublicKey
// wallet_registerOnboarding

/* Mobile Specific RPC Methods */
// wallet_scanQRCode

export default provider as W3bConnector;
