// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    PoS,
    PoSV2FactoryImpl,
    PoSV2FactoryImpl__factory,
    PoS__factory,
    StakingImpl,
    StakingImpl__factory,
} from '@cartesi/pos';

import mainnet from '@cartesi/pos/export/abi/mainnet.json';
import sepolia from '@cartesi/pos/export/abi/sepolia.json';

import localhost from './localhost.json';

import { useFlag } from '@unleash/proxy-client-react';
import { ChainMap, useContract } from '.';

const abis: ChainMap = {
    1: mainnet,
    11155111: sepolia,
    31337: localhost,
};

export const useStakingContract = (): StakingImpl => {
    return useContract(StakingImpl__factory.connect, abis, 'StakingImpl');
};

export const usePoSContract = (): PoSV2FactoryImpl | PoS => {
    const posV2Enabled = useFlag('posV2Enabled');
    const posV2FactoryImpl = useContract(
        PoSV2FactoryImpl__factory.connect,
        abis,
        'PoSV2FactoryImpl'
    );

    const pos = useContract(PoS__factory.connect, abis, 'PoS');
    return posV2Enabled ? posV2FactoryImpl : pos;
};
