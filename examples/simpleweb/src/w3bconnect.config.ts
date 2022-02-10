import { W3bConfig } from "@w3bsauce/core/bin/types";
import metamask from "@w3bsauce/metamask";

const settings: W3bConfig = {
  inactiveConnectionListener: true, // listen the window.ethereum events even if not connected.
  suppressNetworkConnection: false, // no fallback network
  useEip1193Bridge: false,
  defaultNetwork: 1,
  supportedNetworks: [1, 4],
  customNetworkProvider: undefined,
  showDiagnostics: false,
  
  defaultConnection: metamask,
  autoConnect: true,
}

export default settings;
