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
import { BigNumber } from '@ethersproject/bignumber';
import { ProxyManager } from '../contracts/ProxyManager';
import { ProxyManagerFactory } from '../contracts/ProxyManagerFactory';
import { parseUnits } from '@ethersproject/units';

type AbiMap = Record<number, any>;
const proxyManagerJson: AbiMap = {
    31337: require('@cartesi/util/deployments/localhost_31337/ProxyManager.json'),
};

export const provider = new Web3Provider(window.ethereum);

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

export const useProxyManager = (proxy: string) => {
    const [proxyManager, setProxyManager] = useState<ProxyManager>();

    // create the ProxyManager, asynchronously
    useEffect(() => {
        // create the factory
        const factory = new ProxyManagerFactory(provider.getSigner());

        // query the provider network
        provider.getNetwork().then((network) => {
            const address = proxyManagerJson[network.chainId].address;
            if (!address) {
                throw new Error(
                    `ProxyManager not deployed at network ${network.chainId}`
                );
            }
            console.log(
                `Attaching ProxyManager to address '${address}' deployed at network '${network.chainId}'`
            );
            setProxyManager(factory.attach(address));
        });
    }, []);

    const [owner, setOwner] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (proxyManager) {
            setLoading(true);
            setError('');
            proxyManager
                .getUser(proxy)
                .then((owner) => {
                    setLoading(false);
                    setOwner(owner);
                })
                .catch((e) => {
                    setError(e.message);
                });
        }
    }, [proxyManager, proxy]);

    const claimProxy = async () => {
        if (proxyManager) {
            // XXX: move this to a parameter
            const value = parseUnits('1', 'finney');

            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await proxyManager.claimProxy(proxy, {
                    value,
                });

                // wait for confirmation
                await transaction.wait(1);

                // query owner again
                const owner = await proxyManager.getUser(proxy);
                setOwner(owner);
                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const releaseProxy = async () => {
        if (proxyManager) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await proxyManager.freeProxy(proxy, []);

                // wait for confirmation
                await transaction.wait(1);

                // query owner again
                const owner = await proxyManager.getUser(proxy);
                setOwner(owner);
                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    return {
        proxyManager,
        owner,
        loading,
        submitting,
        error,
        claimProxy,
        releaseProxy,
    };
};

export const useUserProxies = (proxy: string, user: string) => {
    const { proxyManager } = useProxyManager(proxy);
    const [proxies, setProxies] = useState<string[]>([]);

    useEffect(() => {
        if (proxyManager) {
            Promise.all([
                proxyManager.queryFilter(
                    proxyManager.filters.ProxyClaim(null, user)
                ),
                proxyManager.queryFilter(
                    proxyManager.filters.ProxyRelease(null, user)
                ),
            ]).then(([claims, releases]) => {
                // merge claim and release events into a single list
                // and sort by block number
                const events = [...claims, ...releases].sort(
                    (a, b) => a.blockNumber - b.blockNumber
                );

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
