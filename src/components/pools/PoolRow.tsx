// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import {
    HStack,
    Icon,
    Td,
    Tooltip,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, LockIcon } from '@chakra-ui/icons';

import { StakingPool } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import labels from '../../utils/labels';
import { FaCoins } from 'react-icons/fa';
import IconLink from '../IconLink';

export interface PoolRowProps {
    chainId: number;
    pool: StakingPool;
    account?: string;
    size?: 'lg' | 'md' | 'sm' | 'xs';
}

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

const PoolRow: FunctionComponent<PoolRowProps> = ({
    chainId,
    account,
    pool,
    size = 'lg',
}) => {
    // hover style
    const backgroundColor = useColorModeValue('WhiteSmoke', 'gray.700');

    // accured commission
    const accuredCommissionLabel =
        pool.commissionPercentage > 0
            ? numberFormat.format(pool.commissionPercentage)
            : '-';

    // commission label
    let commissionLabel = '';
    if (pool.fee.commission) {
        commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;
    } else if (pool.fee.gas) {
        commissionLabel = `${pool.fee.gas} Gas`;
    }

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
        <Tr key={pool.id} _hover={{ backgroundColor }}>
            <Td>
                <Address ens address={pool.id} chainId={chainId} truncated />
            </Td>
            {(size == 'lg' || size == 'md') && (
                <Td isNumeric>{pool.totalUsers}</Td>
            )}
            <Td isNumeric>{formatCTSI(pool.amount, 2)} CTSI</Td>
            {size == 'lg' && (
                <Td isNumeric>{formatCTSI(pool.user.totalReward, 2)} CTSI</Td>
            )}
            {size == 'lg' && (
                <Td>
                    {commissionLabel}{' '}
                    {commissionTooltip && (
                        <Tooltip
                            placement="top"
                            label={commissionTooltip}
                            fontSize="small"
                            bg="black"
                            color="white"
                            size="md"
                        >
                            <Icon />
                        </Tooltip>
                    )}
                </Td>
            )}
            {(size == 'lg' || size == 'md') && (
                <Td>{accuredCommissionLabel}</Td>
            )}
            <Td>
                <HStack justify="flex-end">
                    {edit && (
                        <IconLink
                            href={'/pools/' + pool.id + '/edit'}
                            icon={<EditIcon />}
                            tooltip="Edit"
                        />
                    )}
                    <IconLink
                        href={'/pools/' + pool.id}
                        icon={<FaCoins />}
                        tooltip="Stake"
                    />
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
