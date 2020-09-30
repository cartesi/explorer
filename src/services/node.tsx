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
import { IChainData, getChain } from './chain';
import { BigNumberish } from 'ethers';

export interface Node {
    address: string;
    chain: IChainData;
    minimumFunding?: BigNumberish;
    maximumFunding?: BigNumberish;
}

export const useLocalNode = (url: string = 'http://localhost:8545'): Node => {
    const [node, setNode] = useState<Node>(undefined);

    useEffect(() => {
        const provider = new JsonRpcProvider(url);
        provider
            .getSigner()
            .getAddress()
            .then((address) => {
                provider.getNetwork().then(({ chainId }) => {
                    getChain(chainId).then((chain) => {
                        setNode({
                            address,
                            chain,
                        });
                    });
                });
            })
            .catch((e) => setNode(undefined));
    }, []);

    return node;
};

export const useCartesiNodes = (chainId: number): Node[] => {
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        getChain(chainId).then((chain) => {
            const url = `https://${chain.name}.paas.cartesi.io`;
            // TODO: use URL to fetch nodes
            const testAddresses = [
                '0xD9C0550FC812bf53F6952d48FB2039DEed6f941D',
                '0x5B0132541eB13e2Df4F0816E4a47ccF3ac516AE5',
                '0x66CfA4E2fabEa4621Af6E5A8C9418457DfedB1B8',
            ];
            const nodes = testAddresses.map((address) => ({ address, chain }));
            setNodes(nodes);
        });
    }, [chainId]);

    return nodes;
};
