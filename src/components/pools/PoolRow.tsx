// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { ethers, FixedNumber } from 'ethers';
import { HStack, Icon, Td, Tooltip, Tr } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';

import { StakingPool } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import { useStakingPoolCommission } from '../../services/pool';
import labels from '../../utils/labels';

export interface PoolRowProps {
    pool: StakingPool;
    account?: string;
}

const PoolRow: FunctionComponent<PoolRowProps> = ({ account, pool }) => {
    // calculate accured commission
    const totalReward = FixedNumber.from(pool.user.totalReward);
    const totalCommission = FixedNumber.from(pool.totalCommission);
    const accuredCommissionLabel = totalReward.isZero()
        ? '-'
        : `${totalCommission
              .divUnsafe(totalReward)
              .mulUnsafe(FixedNumber.from(100))
              .toUnsafeFloat()
              .toFixed(2)} %`;

    // commission label
    let commissionLabel = '';
    if (pool.fee.commission) {
        commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;
    } else if (pool.fee.gas) {
        commissionLabel = `${pool.fee.gas} Gas`;
    }

    // calculate commission for next block, by calling the fee contract
    const reward = ethers.utils.parseUnits('2900', 18); // XXX this value should come from the RewardManager
    const nextCommission = useStakingPoolCommission(pool.id, reward);
    const nextCommissionLabel = nextCommission.value
        ? `${(nextCommission.value * 100).toFixed(2)} %`
        : '';

    // commission help tooptip
    let commissionTooltip: string = undefined;
    if (pool.fee.commission) {
        commissionTooltip = labels.flatRateCommission;
    } else if (pool.fee.gas) {
        commissionTooltip = labels.gasTaxCommission;
    }

    // poor manager is logged user, allow edit
    const edit = account && account.toLowerCase() === pool.manager;

    return (
        <Tr key={pool.id}>
            <Td>
                <Address ens address={pool.id} />
            </Td>
            <Td isNumeric>{pool.totalUsers}</Td>
            <Td isNumeric>{formatCTSI(pool.user.stakedBalance, 2)} CTSI</Td>
            <Td isNumeric>{formatCTSI(pool.user.totalReward, 2)} CTSI</Td>
            <Td>
                {commissionLabel}{' '}
                {commissionTooltip && (
                    <Tooltip
                        placement="top"
                        label={commissionTooltip}
                        fontSize="small"
                        bg="black"
                        color="white"
                    >
                        <Icon />
                    </Tooltip>
                )}
            </Td>
            <Td>{accuredCommissionLabel}</Td>
            <Td>
                <HStack justify="flex-end">
                    {edit && (
                        <Link href={'/pools/' + pool.id + '/edit'}>Edit</Link>
                    )}
                    <Link href={'/pools/' + pool.id}>Stake</Link>
                    {pool.paused && (
                        <Tooltip
                            placement="top"
                            label="This pool is not accepting stake at the moment"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <LockIcon />
                        </Tooltip>
                    )}
                </HStack>
            </Td>
        </Tr>
    );
};

export default PoolRow;
