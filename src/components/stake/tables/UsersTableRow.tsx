// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Icon,
    Td,
    Tooltip,
    Tr,
    useColorModeValue,
    Text,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { PoolBalanceWithAccumulatedShares } from '../../../graphql/models';
import Address from '../../Address';
import { formatCTSI } from '../../../utils/token';
import { useStakingPool } from '../../../services/pool';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    hourCycle: 'h23',
    dateStyle: 'medium',
    timeStyle: 'short',
});

export interface UsersTableRowProps {
    chainId: number;
    balance: PoolBalanceWithAccumulatedShares;
}

const UsersTableRow: FC<UsersTableRowProps> = ({ chainId, balance }) => {
    const backgroundColor = useColorModeValue('WhiteSmoke', 'gray.700');
    const borderColor = useColorModeValue('gray.100', 'header');
    const { sharesToAmount } = useStakingPool(balance.pool.id, balance.user.id);
    const formattedStakeTime = dateTimeFormat.format(
        balance.stakeTimestamp * 1000
    );
    const stakedBalance = sharesToAmount(BigNumber.from(balance.shares));
    const truncateNumber = (num) => Math.trunc(num * 100) / 100;

    return (
        <Tr
            key={balance.pool.id}
            _hover={{ backgroundColor }}
            data-testid="users-table-row"
        >
            <Td borderColor={borderColor} data-testid="user-col">
                <Address
                    ens
                    address={balance.user.id}
                    chainId={chainId}
                    responsive
                    truncated
                    size="md"
                    bg="blue.50"
                    px="0.5rem"
                    py="0.25rem"
                    color="gray.900"
                    minWidth="120px"
                    shouldDisplayFallbackAvatar
                />
            </Td>

            <Td borderColor={borderColor} data-testid="stake-since-col">
                {formattedStakeTime}
            </Td>

            <Td borderColor={borderColor} data-testid="total-staked-col">
                {formatCTSI(stakedBalance, 2)} CTSI
            </Td>

            <Td borderColor={borderColor} data-testid="shares-col" isNumeric>
                <Text as="span">
                    {truncateNumber(balance.sharesPercent * 100)}%
                </Text>
                <Text as="span" verticalAlign="text-top" marginStart={1}>
                    <Tooltip label={`Unformatted: ${balance.sharesPercent} %`}>
                        <Icon />
                    </Tooltip>
                </Text>
            </Td>

            <Td
                borderColor={borderColor}
                data-testid="accumulated-shared-col"
                isNumeric
            >
                {truncateNumber(balance.accumulatedSharesPercent * 100)}%
            </Td>
        </Tr>
    );
};

export default UsersTableRow;
