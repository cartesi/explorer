// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber} from '@ethersproject/bignumber';
import { ProxyManager } from '../contracts/ProxyManager';
import { ProxyManagerFactory } from '../contracts/ProxyManagerFactory';
const proxyManagerJson = require('@cartesi/util/build/contracts/ProxyManager.json');

export const provider = new Web3Provider(window.ethereum);

const getAddress = (json: any, networkId: string): string | undefined => {
    const networks: any = json.networks;
    const deployedNetworks = Object.keys(networks);
    if (deployedNetworks.length === 0) {
        return undefined;
    }
    // XXX: not a nice way to do it
    const addressEntry =
        networkId === '*'
            ? networks[Object.keys(networks)[0]]
            : networks[networkId];
    if (!addressEntry) return undefined;

    return addressEntry.address;
};

export const useBalance = (address: string) => {
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
    useEffect(() => {
        provider.getBalance(address).then(setBalance);
    }, [address]);
    return balance;
};

export const useAccount = (index: number) => {
    const [account, setAccount] = useState<string>(
        '0x0000000000000000000000000000000000000000'
    );
    useEffect(() => {
        provider.listAccounts().then((accounts) => {
            setAccount(accounts.length > 0 ? accounts[index] : '');
        });
    }, [index]);
    return account;
};

export const useProxyManager = () => {
    const [proxyManager, setProxyManager] = useState<ProxyManager>();

    useEffect(() => {
        // create the factory
        const factory = new ProxyManagerFactory(provider.getSigner());

        // query the provider network
        provider.getNetwork().then((network) => {
            const address = getAddress(proxyManagerJson, network.chainId.toString());
            if (!address) {
                throw new Error(
                    `ProxyManager not deployed at network ${network}`
                );
            }
            console.log(
                `Attaching ProxyManager to address '${address}' deployed at network '${network.chainId}'`
            );
            setProxyManager(factory.attach(address));
        });
    }, []);
    return proxyManager;
};

export const useUserProxies = (user: string) => {
    const proxyManager = useProxyManager();
    const [proxies, setProxies] = useState<string[]>([]);

    useEffect(() => {
        if (proxyManager) {
            Promise.all([
                proxyManager.queryFilter(proxyManager.filters.ProxyClaim(null, user)),
                proxyManager.queryFilter(proxyManager.filters.ProxyRelease(null, user))
            ]).then(([claims, releases]) => {
                // merge claim and release events into a single list
                // and sort by block number
                const events = [...claims, ...releases].sort((a,b) => a.blockNumber - b.blockNumber);

                // build final list of proxies considering every claim and release event
                // in history for the user
                const proxies = events.reduce((array: string[], ev) => {
                    const args: any = ev.args;
                    const proxy = args.proxy;
                    if (ev.event === 'ProxyClaim') {
                        array.push(proxy);
                    } else if (ev.event === 'ProxyRelease') {
                        array.splice(array.indexOf(proxy), 1);
                    }
                    return array;
                }, []);
                setProxies(proxies);
            });
        }
    }, [proxyManager, user]);

    return proxies;
};
