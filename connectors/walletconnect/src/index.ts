import WalletConnectProvider from "@walletconnect/web3-provider";
import { ConnectionId, ProviderModule } from "@w3bsauce/core/bin/types";
import { EIP1193Provider } from "@w3bsauce/core/bin/types/eip1193";

declare const window: any;

const connectionId: ConnectionId = ConnectionId.walletconnect;
//  Create WalletConnect Provider
const walletConnectProvider = new WalletConnectProvider({
  infuraId: "2af222f674024a0f84b5f0aad0da72a2",
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

const activate: () => Promise<any> = walletConnectProvider.enable;
const disconnect: () => Promise<any> = walletConnectProvider.disconnect;

const provider: ProviderModule = {
  provider: walletConnectProvider as unknown as EIP1193Provider,
  connectionId,
  providerFunctionMap: new Map([
    ["activate", activate],
    ["disconnect", disconnect],
  ])
};

export default provider as ProviderModule;
