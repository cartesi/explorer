// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import useFlag from '../../hooks/useFlag';
import { useContract } from '.';
import {
    posAbi,
    posAddress,
    posV2FactoryAbi,
    posV2FactoryAddress,
    stakingAbi,
    stakingAddress,
} from './generated';

export const useStakingContract = () =>
    useContract(stakingAbi, stakingAddress, 'StakingImpl');

/** PoS v2 is behind the posV2Enabled flag; v1 PoS is the default. */
export const usePoSContract = () => {
    const posV2Enabled = useFlag('posV2Enabled');
    const posV2FactoryImpl = useContract(
        posV2FactoryAbi,
        posV2FactoryAddress,
        'PoSV2FactoryImpl',
    );

    const pos = useContract(posAbi, posAddress, 'PoS');
    return posV2Enabled ? posV2FactoryImpl : pos;
};
