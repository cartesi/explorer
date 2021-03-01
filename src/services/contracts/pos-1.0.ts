// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { PoS__factory, PoS } from '@cartesi/pos-1.0';

import mainnet from '@cartesi/pos-1.0/export/abi/mainnet.json';
import rinkeby from '@cartesi/pos-1.0/export/abi/rinkeby.json';
import goerli from '@cartesi/pos-1.0/export/abi/goerli.json';
import kovan from '@cartesi/pos-1.0/export/abi/kovan.json';

import localhost from './localhost.json';

import { ChainMap, useContract } from '.';

const abis: ChainMap = {
    1: mainnet,
    4: rinkeby,
    5: goerli,
    42: kovan,
    31337: localhost,
};

export const usePoSContract = (): PoS => {
    return useContract(PoS__factory.connect, abis, 'PoS');
};
