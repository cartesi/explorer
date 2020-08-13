// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';

export interface Node {
    address: string;
    chainId: number;
    minimumFunding?: BigNumberish;
    maximumFunding?: BigNumberish;
}

export const getLocalNode = async (url: string = 'http://localhost:8545'): Promise<Node | null> => {
    try {
        const provider = new JsonRpcProvider(url);
        const address = await provider.getSigner().getAddress();
        const { chainId } = await provider.getNetwork();
        return {
            address,
            chainId
        }
    } catch (e) {
        console.log('XXX', e);
        return null;
    }
};

export const useLocalNode = (url: string = 'http://localhost:8545'): Node => {
    const [node, setNode] = useState<Node>(undefined);
    const [provider, setProvider] = useState<JsonRpcProvider>(undefined);
    useEffect(() => {
        setProvider(new JsonRpcProvider(url));
    }, []);

    useEffect(() => {
        if (provider) {
            provider
                .getSigner()
                .getAddress()
                .then((address) => {
                    provider.getNetwork().then(({ chainId }) => {
                        setNode({
                            address,
                            chainId,
                        });
                    });
                });
        }
    }, [provider]);

    return node;
};

export const usePaasNodes = (
    url: string = 'https://api.paas.cartesi.io',
    chainId: number = 30137
): Node[] => {
    // TODO: use PaaS API to get nodes
    const addresses = [
        '0xD9C0550FC812bf53F6952d48FB2039DEed6f941D',
        '0x5B0132541eB13e2Df4F0816E4a47ccF3ac516AE5',
        '0x33D8888065a149349Cf65f3cd192d4A3C89ca3Ba',
    ];
    return addresses.map((address) => ({ address, chainId }));
};
