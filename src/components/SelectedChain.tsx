// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { InjectedConnector } from '@web3-react/injected-connector';
import { IChainData, getChain } from '../services/chain';
import { networks } from '../utils/networks';

const SelectedChain = () => {
    const {
        chainId,
        activate,
        deactivate,
        error,
        active,
    } = useWeb3React<Web3Provider>();
    const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
    const [chain, setChain] = useState<IChainData>(undefined);
    const hasMetaMask = MetaMaskOnboarding.isMetaMaskInstalled();

    React.useEffect(() => {
        if (window?.ethereum?.selectedAddress) {
            connectNetwork();
        }
    }, []);

    // get chain name
    useEffect(() => {
        if (chainId) {
            getChain(chainId).then(setChain);
        } else if (error) {
            setChain(undefined);
        }
    }, [chainId, error]);

    const connectNetwork = () => {
        const supportedChainIds = Object.keys(networks).map((key) =>
            parseInt(key)
        );
        const connector = new InjectedConnector({ supportedChainIds });
        activate(connector);
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (!accounts || accounts.length == 0) {
                    deactivate();
                    setChain(undefined);
                }
            });
        }
    };

    return (
        <div className="selected-chain">
            {chain && (
                <div>
                    <span style={{ color: 'white' }}>{chain.name}</span>
                </div>
            )}
            {isUnsupportedChainIdError && (
                <button type="button" className="btn btn-danger button-text">
                    <img src="/images/metamask.png" />
                    Unsupported Network
                </button>
            )}
            {!active && !isUnsupportedChainIdError && (
                <button
                    type="button"
                    className="btn btn-primary button-text"
                    onClick={connectNetwork}
                >
                    <img src="/images/metamask.png" />
                    {hasMetaMask ? 'Connect To Wallet' : 'Install MetaMask'}
                </button>
            )}
        </div>
    );
};

export default SelectedChain;
