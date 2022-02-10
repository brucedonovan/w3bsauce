import { Networkish } from "@ethersproject/networks";
import { ethers } from "ethers";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { EIP1193Provider, ProviderRpcError } from "./eip1193";

export type AsyncFunction = (...args: any) => Promise<any>;

export interface ProviderModule {
  provider: EIP1193Provider;
  connectionId: ConnectionId;
  providerFunctionMap: Map<string, AsyncFunction>;
}

export interface W3bObservables {
  chainId: Observable<number>;
  provider: Observable<ethers.providers.Web3Provider>;
  networkProvider: Observable<ethers.providers.BaseProvider>;
  accounts: Observable<string[]>;
  error: Observable<ProviderRpcError>;
  diagnostics: Observable<string>;
  active: Observable<ConnectionId | undefined>;
  activating: Observable<ConnectionId | undefined>;
  providerFunctions: Observable<any>;
}

export interface W3bFunctions {
  connect: (
    connection: ProviderModule | EIP1193Provider,
    id?: string,
    providerFunctionMap?: Map<string, AsyncFunction>
  ) => void;
  updateConfig: (config: W3bConfig) => void;
}

export interface W3bSubjects {
  diagnostics$: Subject<string>;
  chainId$: Subject<number>;
  accounts$: BehaviorSubject<string[]>;
  error$: Subject<ProviderRpcError>;
  active$: Subject<ConnectionId | undefined>;
  activating$: Subject<ConnectionId | undefined>;
  config$: Subject<any>;
}

export interface W3bState {
  provider: ethers.providers.Web3Provider | undefined;
  networkProvider: ethers.providers.BaseProvider | undefined;
  chainId: number | undefined;
  accounts: string[];
  active: ConnectionId | undefined;
  activating: ConnectionId | undefined;
  error: ProviderRpcError | undefined;
  diagnostics: string | undefined;
}

export enum ConnectionId {
  "metamask" = "metamask",
  "walletconnect" = "walletconnect",
}

export interface W3bConfig {
  inactiveConnectionListener: boolean;
  suppressNetworkConnection: boolean;

  showDiagnostics: boolean;
  defaultNetwork: Networkish;
  supportedNetworks: Networkish[];
  
  defaultConnection: ProviderModule | undefined;
  autoConnect: boolean;

  customNetworkProvider: ethers.providers.BaseProvider | undefined; // EIP1193 provider
  cacheConnection?: boolean;
  useEip1193Bridge: boolean;

  reloadOnNetworkChange: boolean;
}
