import metamask from "@w3bsauce/metamask";
import walletconnect from "@w3bsauce/walletconnect";

const settings = {
  inactiveConnectionListener: true, // listen the window.ethereum events even if not connected.
  suppressNetworkConnection: false, // no fallback network
  
  useEip1193Bridge: false,

  defaultNetwork: 1,
  supportedNetworks: [1, 4],

  customNetworkProvider: undefined,
  showDiagnostics: true,

  reloadOnNetworkChange: false,
  
  defaultConnection: metamask,
  autoConnect: true,
}

export default settings;
