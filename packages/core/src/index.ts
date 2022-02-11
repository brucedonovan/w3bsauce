import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import {
  combineLatest,
  Subject,
  Observable,
  map,
  skipWhile,
  BehaviorSubject,
  share,
  first,
  filter,
} from "rxjs";

import {
  W3bConfig,
  ConnectionId,
  Connector,
  W3bObservables,
  W3bFunctions,
  W3bSubjects,
} from "./types";
import { ProviderRpcError, EIP1193Provider } from "./types/eip1193";

import { handleActivate } from "./w3bHelpers";
import { addAllEventListeners, requestAccounts } from "./eip1193Common";
import { mapToErrorHandledObject } from "./utils";

import defaultConfig from "./w3bsauce.config";

const supportedConnections: ConnectionId[] = [
  ConnectionId.metamask,
  ConnectionId.walletconnect,
];

const config$: BehaviorSubject<W3bConfig> = new BehaviorSubject(defaultConfig);
const updateConfig = (config: W3bConfig) => {
  config$.next({ ...defaultConfig, ...config });
};

/* handle auto connect on first load */
config$
  .pipe(
    filter(
      (_config: W3bConfig) =>
        _config.autoConnect && _config.defaultConnection !== undefined
    ),
    first() // only once at the beginning if the above is true (ie. not on every config change)
  )
  .subscribe((_config: W3bConfig) => {
    activate(_config.defaultConnection!, undefined, undefined);
  });

const chainId$: Subject<number> = new Subject();
const chainId: Observable<number> = chainId$.pipe(share()); // shared for multiple subscriptions, check.

const accounts$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
const accounts: Observable<string[]> = accounts$.pipe(
  map((_addrs) => {
    if (_addrs.length === 0) {
      active$.next(undefined);
    }
    return _addrs;
  }),
  share() // shared for multiple subscriptions, check.
);

const error$: Subject<ProviderRpcError> = new Subject();
const error: Observable<ProviderRpcError> = error$.pipe(share());

const diagnostics$: Subject<string> = new Subject();
const diagnostics: Observable<string> = combineLatest([
  diagnostics$,
  config$,
]).pipe(
  skipWhile(([_diagnostics, _config]) => !_config.showDiagnostics),
  map(([_diagnostics, _config]) => _diagnostics),
  // new feature request: we can easily create a log list here if required.
  share()
);

const active$: Subject<ConnectionId | undefined> = new Subject();
const active: Observable<ConnectionId | undefined> = active$.pipe(share());

const activating$: Subject<ConnectionId | undefined> = new Subject();
const activating: Observable<ConnectionId | undefined> = activating$.pipe(
  share()
);

const connection$: Subject<Connector> = new Subject();

const networkConnection$: Subject<ethers.providers.BaseProvider | undefined> =
  new Subject();
networkConnection$.next(undefined);

// Set the provider and appropriate listeners()
const provider = connection$.pipe(
  map((_connection) => {
    // 1. Activate the Eip1193 Listeners for the connection
    addAllEventListeners(_connection.provider);
    // 2. Set the provider functions to those of the connection
    providerFunctions$.next(_connection.providerFunctionMap);
    return new ethers.providers.Web3Provider(_connection.provider, "any");
  }),
  share() // share() here so we can subscribe to it multiple times without duplicating fn calls.
);

const providerFunctions$: Subject<unknown> = new Subject();
const providerFunctions: Observable<unknown> = providerFunctions$.pipe(
  // pass on the args to the provider function and catch the error
  map((x: any) => mapToErrorHandledObject(x, error$))
);

// Set the custom network provider if used */
const customNetworkProvider: Observable<BaseProvider | undefined> =
  combineLatest([chainId, networkConnection$]).pipe(
    map(([_chainId, _networkConnection]) => {
      return _networkConnection;
    })
  );

// Set the networkProvider ( note: networkProvider should never be *undefined* )
// 1. Set to same network when window.ethereum.chainId/provider.chainId changes.
// 2. Set to provider (primary connection) if the particular chainId/network is unsupported by the defaultNetworkprovider.
// 3. Set to defaultNetwork chainId as a last resort
const networkProvider = combineLatest([
  chainId,
  provider,
  customNetworkProvider,
  config$,
]).pipe(
  map(([_chainId, _provider, _customNetworkProvider, _config]) => {
    try {
      const _networkProvider =
        _customNetworkProvider || ethers.getDefaultProvider(_chainId); // try to match the selected chainId
      diagnostics$.next(
        `networkProvider changed to match ChainId of provider, (${_chainId}).`
      );
      return _networkProvider;
    } catch (e) {
      // case: Matching to selected chainId failed! ( eg. when infura doesn't support a particular network )>>
      if (_provider) {
        diagnostics$.next(
          `Chain Id ${_chainId} unsupported by networkProvider: Using *provider* as networkProvider`
        );
        return _provider; // use the provider
      } else {
        const _defaultNetworkProvider = ethers.getDefaultProvider(
          _config.defaultNetwork
        );
        diagnostics$.next(
          `No provider connected and chainId unsupported by networkProvider: Resorting to default ChainId, ${_config.defaultNetwork}`
        );
        return _defaultNetworkProvider; // use the default networkProvider with the deafultNetwork
      }
    }
  }),
  share()
);

const activate = (
  _provider: Connector | EIP1193Provider,
  _id: string | undefined = undefined,
  _providerFns: Map<string, any> | undefined
) => {

  // check Provider has required
  const isConnector = supportedConnections.includes(
    (_provider as Connector).connectionId
  );

  // check if a customEIP1193 is provided:
  const isCustomEIP1193Provider =
    (_provider as EIP1193Provider).request !== undefined; // TODO fix this loose check

  // Case: _connection is a recognised ConnectionId
  if (isConnector) handleActivate(_provider as Connector);

  // Case: _connection is a EIPPRovider ( ie. not a recognised ConnectionId  )
  if (isCustomEIP1193Provider) {
    console.log("building Connector");
    // build custom EIP1193 Connector from the custom EIP1193
    const customConnector: Connector = {
      provider: _provider as EIP1193Provider,
      connectionId: _id as ConnectionId,
      providerFunctionMap: _providerFns?.size
        ? mapToErrorHandledObject(_providerFns, error$) // handle RPC errors from custom function map
        : undefined,
    };
    handleActivate(customConnector);
  }

  // Case: neither EIP1193 provider nor recognised ConnectionId
  if (!isConnector && !isCustomEIP1193Provider)
    console.log(
      "Connection not supported! Check that connection module/package is installed, or try to use a generic EIP1193Provider"
    );
};

const w3bObservables: W3bObservables = {
  chainId,
  accounts,
  networkProvider, // deps: provider, chainId, customNetworkProvider , networkConnection
  provider, // deps: chainId, connection
  error, // deps : zero
  diagnostics, // deps: zero
  activating, // the eip1193 that is connecting (if different from the active connection) - deps: active
  active, // the active eip1193 connection (NB!! only if accounts.length ) - deps: accounts
  providerFunctions, // note: this is an observable with all the available/custom provider functions
};

const w3bFunctions: W3bFunctions = {
  activate,
  updateConfig,
};

const _w3bSubjects: W3bSubjects = {
  chainId$,
  accounts$,
  error$,
  diagnostics$,
  active$,
  activating$,
  config$,
  connection$
};

export { w3bObservables, w3bFunctions, _w3bSubjects };
