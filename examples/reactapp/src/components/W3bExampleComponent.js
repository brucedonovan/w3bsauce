import React, { useEffect } from "react";

import { W3bContext } from "@w3bsauce/react";
import { ConnectionId } from "@w3bsauce/core/bin/types";
import metamask from "@w3bsauce/metamask";

import walletconnect from "@w3bsauce/walletconnect";

import settings from "../w3bsauce.config";

const W3bExampleComponent = () => {
  const { w3bState, w3bFunctions } = React.useContext(W3bContext);

  // Example of using a w3bSauce config file.
  useEffect(() => {
    w3bFunctions.updateConfig(settings);
  }, []); //only do this once on load

  // Console.log errors ( and diagnostics if set)
  useEffect(() => {
    w3bState.diagnostics && console.log(w3bState.diagnostics);
    w3bState.error && console.log(w3bState.error);
  }, [w3bState.diagnostics, w3bState.error]);

  return (
    <div
      align="left"
      style={{
        backgroundImage: `url("https://user-images.githubusercontent.com/5603206/153614570-2a6f817c-fe12-4c14-b9d3-a79c170485ab.gif")`,
        height: '500px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        overflow:'auto'
      }}
    >
      {/* <img src="https://user-images.githubusercontent.com/5603206/153614570-2a6f817c-fe12-4c14-b9d3-a79c170485ab.gif" width="100%" alt='w3bSauce' /> */}

      {w3bState.active !== undefined ? (
        <p>Account Connected : {w3bState.accounts[0]} </p>
      ) : (
        <p> No Wallet connected </p>
      )}
      <div>
        <button
          onClick={() => w3bFunctions.activate(metamask)}
          disabled={
            w3bState.active === ConnectionId.metamask ||
            w3bState.activating === ConnectionId.metamask
          }
        >
          Connect to metamask
        </button>

        {w3bState.active === ConnectionId.walletconnect ? (
          <button onClick={() => walletconnect.provider.disconnect()}>
            Disconnect from walletconnect
          </button>
        ) : (
          <button onClick={() => w3bFunctions.activate(walletconnect)}>
            Connect to WalletConnect
          </button>
        )}
      </div>

      {w3bState.active && <p> Connected to : {w3bState.active}</p>}
      {w3bState.activating && (
        <p> Connecting to {w3bState.activating}: Please check your wallet. </p>
      )}
    </div>
  );
};

export { W3bExampleComponent };
