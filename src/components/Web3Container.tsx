// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import Web3Context from './Web3Context';
import { getChain, IChainData } from '../services/chain';

const Web3Container = ({ children }) => {
    const [provider, setProvider] = useState<Web3Provider>(undefined);
    const [chain, setChain] = useState<IChainData>(undefined);
    const [account, setAccount] = useState<string>(undefined);
    const [connected, setConnected] = useState<boolean>(undefined);

    React.useEffect(() => {
        if(window.ethereum.selectedAddress) {
            updateProvider(window.ethereum);
        }
    }, []);
    
    const updateProvider = (provider) => {
        if(provider) {
            provider.request({ method: 'eth_requestAccounts' })
                .then(accounts => setAccount(accounts[0]));

            provider.on('chainChanged', async (_chainId: string) => {
                const chain = await getChain(parseInt(_chainId, 16));
                setChain(chain);
            });
            provider.on('accountsChanged', (accounts: string[]) => {
                if(accounts && accounts.length > 0) {
                    setAccount(accounts[0])
                } else {
                    setConnected(false);
                    setChain(undefined);
                    setProvider(undefined);
                }
            });

            const web3Provider = new Web3Provider(provider, 'any');
            setProvider(web3Provider);
        }
    }

    React.useEffect(() => {
        if(provider) {
            connect(provider);
        }
    }, [provider]);

    const connect = async (provider) => {
        window.ethereum.autoRefreshOnNetworkChange = false;
        const connected = window.ethereum.isConnected();
        setConnected(connected);
        if (connected) {
            try {
                const network = await provider.getNetwork();
                const chain = await getChain(network.chainId);
                setChain(chain);
            } catch (e) {
                console.log(`Error obtaining chain from provider`, e);
            }
        }
        return provider;
    };

    return (
        <>
            <Web3Context.Provider value={{ provider, chain, account, connected, updateProvider }}>
                {children}
            </Web3Context.Provider>
        </>
    );
};

export default Web3Container;
