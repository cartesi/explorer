// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import proxyManagerJson from '@cartesi/util/build/contracts/ProxyManager.json';
import { ProxyManagerFactory } from '../contracts/ProxyManagerFactory';
import { ProxyManager } from '../contracts/ProxyManager';

export const provider = new ethers.providers.Web3Provider(window.ethereum);
const proxyManagerFactory = new ProxyManagerFactory(provider.getSigner('0x18930e8a66a1DbE21D00581216789AAB7460Afd0'));

const getAddress = (json: any, networkId: string): string | undefined => {
    const networks: any = json.networks;
    const deployedNetworks = Object.keys(networks);
    if (deployedNetworks.length === 0) {
        return undefined;
    }
    // XXX: not a nice way to do it. ethers.js don't give me the correct network id of local ganache :-(
    const addressEntry =
        networkId === '*'
            ? networks[Object.keys(networks)[0]]
            : networks[networkId];
    if (!addressEntry) return undefined;

    return addressEntry.address;
};

export const useBalance = (address: string) => {
    const [balance, setBalance] = useState<BigNumber | undefined>(undefined);
    useEffect(() => {
        provider.getBalance(address).then(setBalance);
    }, [address]);
    return balance;
};

export const useProxyManager = () => {
    const [proxyManager, setProxyManager] = useState<ProxyManager>();

    useEffect(() => {
        // query the provider network
        provider.getNetwork().then((network) => {
            // XXX: not a nice way to do it. ethers.js don't give me the correct network id of local ganache :-(
            const networkId =
                network.name === 'unknown' ? '*' : network.chainId.toString();

            const address = getAddress(proxyManagerJson, networkId);
            if (!address) {
                throw new Error(
                    `ProxyManager not deployed at network ${networkId}`
                );
            }
            console.log(`Attaching ProxyManager to address '${address}'`);
            setProxyManager(proxyManagerFactory.attach(address));
        });
    }, []);
    return proxyManager;
};
