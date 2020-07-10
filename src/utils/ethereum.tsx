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

export const provider = new ethers.providers.Web3Provider(window.ethereum);

const createContract = async (json: any, networkId: string) => {
    const { contractName, abi } = json;
    const networks: any = json.networks;

    // use provider network to get the address from the json
    // const networkId = network.chainId.toString();
    const deployedNetworks = Object.keys(networks);

    if (deployedNetworks.length === 0) {
        throw new Error(
            `Contract '${contractName}' not deployed to any network`
        );
    }

    // XXX: not a nice way to do it. ethers.js don't give me the correct network id of local ganache :-(
    const addressEntry =
        networkId === '*'
            ? networks[Object.keys(networks)[0]]
            : networks[networkId];
    if (!addressEntry)
        throw new Error(
            `Contract '${contractName}' not deployed at network ${networkId}`
        );

    console.log(
        `Creating '${contractName}' instance deployed at ${addressEntry.address} at network ${networkId}`
    );
    return new ethers.Contract(addressEntry.address, abi, provider);
};

export const useBalance = (address: string) => {
    const [balance, setBalance] = useState<BigNumber | undefined>(undefined);
    useEffect(() => {
        const getBalance = async () => {
            setBalance(await provider.getBalance(address));
        };
        getBalance();
    }, [address]);
    return balance;
};

export const useProxyManager = () => {
    const [proxyManager, setProxyManager] = useState<ethers.Contract>();

    useEffect(() => {
        // query the provider network
        provider.getNetwork().then((network) => {
            // XXX: not a nice way to do it. ethers.js don't give me the correct network id of local ganache :-(
            const networkId =
                network.name === 'unknown' ? '*' : network.chainId.toString();
            createContract(proxyManagerJson, networkId).then(setProxyManager);
        });
    }, []);
    return proxyManager;
};
