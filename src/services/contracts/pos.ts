// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { StakingImpl__factory, PoS__factory, PoS, Staking } from '@cartesi/pos';

import mainnet from '@cartesi/pos/export/abi/mainnet.json';
import goerli from '@cartesi/pos/export/abi/goerli.json';

import localhost from './localhost.json';

import { ChainMap, useContract } from '.';

const abis: ChainMap = {
    1: mainnet,
    5: goerli,
    31337: localhost,
};

export const useStakingContract = (): Staking => {
    return useContract(StakingImpl__factory.connect, abis, 'StakingImpl');
};

export const usePoSContract = (): PoS => {
    return useContract(PoS__factory.connect, abis, 'PoS');
};
