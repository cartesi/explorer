// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    StakingImpl__factory,
    StakingImpl,
    PoSV2FactoryImpl__factory,
    PoSV2FactoryImpl,
    PoS__factory,
    PoS,
} from '@cartesi/pos';

import mainnet from '@cartesi/pos/export/abi/mainnet.json';
import goerli from '@cartesi/pos/export/abi/goerli.json';

import localhost from './localhost.json';

import { ChainMap, useContract } from '.';
import { useFlag } from '@unleash/proxy-client-react';

const abis: ChainMap = {
    1: mainnet,
    5: goerli,
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
