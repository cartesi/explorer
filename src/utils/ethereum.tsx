// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
    ProxyManager,
    ProxyClaim,
    ProxyRelease,
} from '../contracts/ProxyManager';
const proxyManagerJson = require('@cartesi/util/build/contracts/ProxyManager.json');

export const provider = new Web3(Web3.givenProvider || 'ws://localhost:8545');

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
    const [balance, setBalance] = useState<string>('');
    useEffect(() => {
        provider.eth.getBalance(address).then(setBalance);
    }, [address]);
    return balance;
};

export const useAccount = (index: number) => {
    const [account, setAccount] = useState<string>(
        '0x0000000000000000000000000000000000000000'
    );
    useEffect(() => {
        provider.eth.requestAccounts().then((accounts) => {
            setAccount(accounts.length > 0 ? accounts[index] : '');
        });
    }, [index]);
    return account;
};

export const useProxyManager = () => {
    const [proxyManager, setProxyManager] = useState<ProxyManager>();

    useEffect(() => {
        // query the provider network
        provider.eth.net.getId().then((network) => {
            const address = getAddress(proxyManagerJson, network.toString());
            if (!address) {
                throw new Error(
                    `ProxyManager not deployed at network ${network}`
                );
            }
            console.log(
                `Attaching ProxyManager to address '${address}' deployed at network '${network}'`
            );
            setProxyManager(
                (new provider.eth.Contract(
                    proxyManagerJson.abi,
                    address
                ) as any) as ProxyManager
            );
        });
    }, []);
    return proxyManager;
};

export const useUserProxies = (user: string, proxy: string) => {
    const proxyManager = useProxyManager();
    const [proxies, setProxies] = useState<string[]>([]);

    useEffect(() => {
        if (proxyManager) {
            proxyManager
                .getPastEvents('allEvents', {
                    fromBlock: 'earliest',
                    filter: {
                        proxy: proxy,
                        user: user,
                    },
                })
                .then((events) => {
                    const proxies = events.reduce(
                        (array: string[], ev, index) => {
                            if (ev.event === 'ProxyClaim') {
                                const event = (ev as any) as ProxyClaim;
                                array.push(event.returnValues.proxy);
                            } else if (ev.event === 'ProxyRelease') {
                                const event = (ev as any) as ProxyRelease;
                                array.splice(
                                    array.indexOf(event.returnValues.proxy),
                                    1
                                );
                            }
                            return array;
                        },
                        []
                    );
                    setProxies(proxies);
                });
        }
    }, [proxyManager, user, proxy]);

    return proxies;
};
