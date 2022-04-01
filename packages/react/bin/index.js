var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { w3bObservables, w3bFunctions } from "@w3bsauce/core";
/* Build the context */
var W3bContext = React.createContext({});
/* useObservable hook */
export var useObservable = function (observable) {
    var _a = React.useState(), value = _a[0], setValue = _a[1];
    var _b = React.useState(), error = _b[0], setError = _b[1];
    useEffect(function () {
        var subscription = observable.subscribe({ next: setValue, error: setError });
        return function () { return subscription.unsubscribe(); };
    }, [observable]);
    return [value, error];
};
/* Build up the Provider state */
var W3bProvider = function (_a) {
    var children = _a.children;
    var accounts = useObservable(w3bObservables.accounts)[0];
    var activeConnector = useObservable(w3bObservables.activeConnector)[0];
    var activatingConnector = useObservable(w3bObservables.activatingConnector)[0];
    var provider = useObservable(w3bObservables.provider)[0];
    var networkProvider = useObservable(w3bObservables.networkProvider)[0];
    var chainId = useObservable(w3bObservables.chainId)[0];
    var error = useObservable(w3bObservables.error)[0];
    var diagnostics = useObservable(w3bObservables.diagnostics)[0];
    var w3bState = {
        accounts: accounts || [],
        activeConnector: activeConnector,
        activatingConnector: activatingConnector,
        provider: provider,
        networkProvider: networkProvider,
        chainId: chainId,
        error: error,
        diagnostics: diagnostics
    };
    return (_jsx(W3bContext.Provider, __assign({ value: { w3bState: w3bState, w3bFunctions: w3bFunctions } }, { children: children }), void 0));
};
/* Returns the Context, Provider (and raw Observables?) */
export { W3bContext, W3bProvider };
