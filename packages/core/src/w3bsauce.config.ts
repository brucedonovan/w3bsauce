import { W3bConfig } from "./types";

export default {
  inactiveConnectionListener: true, // listen the window.ethereum events even if not connected.
  
  suppressNetworkConnection: false, // disable fallback network connection
  
  useEip1193Bridge: false,
  reloadOnNetworkChange: true,

  showDiagnostics: true,

  defaultNetwork: 1,
  supportedNetworks: [1, 4],
  
  customNetworkProvider: undefined,

  defaultConnection: undefined,
  autoConnect:false,


} as W3bConfig;
