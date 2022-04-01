import { Networkish } from "@ethersproject/networks";
import { ethers } from "ethers";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { EIP1193Provider, ProviderRpcError } from "./eip1193";

export type AsyncFunction = (...args: any) => Promise<any>;

export interface W3bConnector {
  provider: EIP1193Provider;
  connectorId: W3bConnectorId;
  providerFunctionMap: Map<string, AsyncFunction>;
  providerSettings?: any;
}


export interface W3bFunctions {
  activate: (
    connection: W3bConnector | EIP1193Provider,
    id?: string,
    providerFunctionMap?: Map<string, AsyncFunction>
  ) => void;
  updateConfig: (config: W3bConfig) => void;
}

export interface W3bObservables {
  chainId: Observable<number>;
  provider: Observable<ethers.providers.Web3Provider>;
  networkProvider: Observable<ethers.providers.BaseProvider>;
  accounts: Observable<string[]>;
  error: Observable<ProviderRpcError>;
  diagnostics: Observable<string>;
  activeConnector: Observable<W3bConnectorId | undefined>;
  activatingConnector: Observable<W3bConnectorId | undefined>;
  providerFunctions: Observable<any>;
}

export interface W3bSubjects {
  diagnostics$: Subject<string>;
  chainId$: Subject<number>;
  accounts$: BehaviorSubject<string[]>;
  error$: Subject<ProviderRpcError>;
  activeConnector$: Subject<W3bConnectorId | undefined>;
  activatingConnector$: Subject<W3bConnectorId | undefined>;
  connection$: Subject<W3bConnector>;
  config$: Subject<W3bConfig>;
}

export interface W3bState {
  provider: ethers.providers.Web3Provider | undefined;
  networkProvider: ethers.providers.BaseProvider | undefined;
  chainId: number | undefined;
  accounts: string[];
  activeConnector: W3bConnectorId | undefined;
  activatingConnector: W3bConnectorId | undefined;
  error: ProviderRpcError | undefined;
  diagnostics: string | undefined;
}

export enum W3bConnectorId {
  "metamask" = "metamask",
  "walletconnect" = "walletconnect",
}

export interface W3bConfig {
  inactiveConnectionListener: boolean;
  suppressNetworkConnection: boolean;

  showDiagnostics: boolean;
  defaultNetwork: Networkish;
  supportedNetworks: Networkish[];
  
  defaultConnection: W3bConnector | undefined;
  autoConnect: boolean;

  customNetworkProvider: ethers.providers.BaseProvider | undefined; // EIP1193 provider
  cacheConnection?: boolean;
  useEip1193Bridge: boolean;

  reloadOnNetworkChange: boolean;
}
