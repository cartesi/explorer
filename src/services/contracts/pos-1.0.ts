// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Signer } from 'ethers';

import {
    StakingImpl__factory,
    StakingImpl,
    PoS__factory,
    PoS,
} from '@cartesi/pos-1.0';

import pos_mainnet from '@cartesi/pos-1.0/export/abi/mainnet.json';
import pos_rinkeby from '@cartesi/pos-1.0/export/abi/rinkeby.json';
import pos_goerli from '@cartesi/pos-1.0/export/abi/goerli.json';
import pos_kovan from '@cartesi/pos-1.0/export/abi/kovan.json';

import localhost from './localhost.json';

import { ChainMap, getAddress } from '.';

const posAbis: ChainMap = {
    1: pos_mainnet,
    4: pos_rinkeby,
    5: pos_goerli,
    42: pos_kovan,
    31337: localhost,
};

export const createStaking = (chainId: number, signer: Signer): StakingImpl => {
    const address = getAddress(chainId, posAbis, 'StakingImpl');
    if (!address) return undefined;
    return StakingImpl__factory.connect(address, signer);
};

export const createPoS = (chainId: number, signer: Signer): PoS => {
    const address = getAddress(chainId, posAbis, 'PoS');
    if (!address) return undefined;
    return PoS__factory.connect(address, signer);
};
