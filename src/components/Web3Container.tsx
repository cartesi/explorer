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

import MetaMaskOnboarding from '@metamask/onboarding';
import {Modal, Button} from 'antd';

const Web3Container = ({ children }) => {
    const [provider, setProvider] = useState<Web3Provider>(undefined);
    const [chain, setChain] = useState<IChainData>(undefined);
    const [account, setAccount] = useState<string>(undefined);
    const [connected, setConnected] = useState<boolean>(undefined);
    const onboarding = React.useRef<MetaMaskOnboarding>();
    
    const handleNewAccounts = (newAccounts) => {
        setAccount(newAccounts[0]);
    }

    const connectMetaMask = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(handleNewAccounts);
            window.ethereum.on('accountsChanged', handleNewAccounts);
            return () => {
                window.ethereum.off('accountsChanged', handleNewAccounts);
            };
        } else {
            onboarding.current.startOnboarding();
        }
    }

    React.useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    React.useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (account) {
                onboarding.current.stopOnboarding();
                connect();
            }
        }
    }, [account]);

    React.useEffect(() => connectMetaMask(), []);

    const connect = async () => {
        window.ethereum.autoRefreshOnNetworkChange = false;
        const connected = window.ethereum.isConnected();
        setConnected(connected);
        if (connected) {
            const provider = new Web3Provider(window.ethereum, 'any');
            try {
                const network = await provider.getNetwork();
                const chain = await getChain(network.chainId);
                setChain(chain);
                setProvider(provider);

                window.ethereum.on('chainChanged', async (_chainId: string) => {
                    if (provider) {
                        provider.removeAllListeners();
                        const network = await provider.getNetwork();
                        const chain = await getChain(network.chainId);
                        setChain(chain);
                    }
                });
                window.ethereum.on('accountsChanged', (accounts: string[]) => {
                    if(accounts && accounts.length > 0) {
                        setAccount(accounts[0])
                    } else {
                        setConnected(false);
                    }
                });
                window.ethereum.on('connect', (connectInfo: any) =>
                    // setChainId(parseInt(connectInfo.chainId))
                    console.log('onConnect')
                );

            } catch (e) {
                console.log(`Error obtaining chain from provider`, e);
            }
        }
        return provider;
    };

    return (
        <>
            <Modal visible={!connected}
                title="Connect Provider"
                footer={null}
            >
                <Button onClick={connectMetaMask}>
                    Connect MetaMask
                </Button>
            </Modal>
            <Web3Context.Provider value={{ provider, chain, account, connected }}>
                {children}
            </Web3Context.Provider>
        </>
    );
};

export default Web3Container;
