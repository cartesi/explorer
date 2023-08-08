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
    Flex,
    TableCellProps,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { PoolBalanceWithAccumulatedShares } from '../../../graphql/models';
import { Address } from '@explorer/ui';
import { formatCTSI } from '../../../utils/token';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    hourCycle: 'h23',
    dateStyle: 'medium',
    timeStyle: 'short',
});

export interface UsersTableRowProps {
    chainId: number;
    balance: PoolBalanceWithAccumulatedShares;
}

const calculateStakedCTSI = (
    balance: PoolBalanceWithAccumulatedShares
): BigNumber => {
    const uShares = BigNumber.from(balance.shares ?? 0);
    const pAmount = BigNumber.from(balance.pool.amount ?? 0);
    const pShares = BigNumber.from(balance.pool.shares ?? 1);

    return uShares.mul(pAmount).div(pShares);
};

const UsersTableRow: FC<UsersTableRowProps> = ({ chainId, balance }) => {
    const formattedStakeTime = dateTimeFormat.format(
        balance.stakeTimestamp * 1000
    );

    const stakedBalance = calculateStakedCTSI(balance);
    const truncateNumber = (num) => Math.trunc(num * 100) / 100;

    const backgroundColor = useColorModeValue('white', 'dark.gray.primary');
    const backgroundHoverColor = useColorModeValue(
        'WhiteSmoke',
        'dark.gray.quaternary'
    );
    const borderColor = useColorModeValue('gray.100', 'dark.gray.quinary');
    const addressColor = useColorModeValue('gray.900', 'white');
    const addressTextDecoration = useColorModeValue('none', 'underline');
    const addressBackground = useColorModeValue('blue.50', 'transparent');
    const tdProps: TableCellProps = {
        borderColor,
        paddingTop: 4,
        paddingBottom: 4,
    };

    return (
        <Tr
            key={balance.pool.id}
            backgroundColor={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            data-testid="users-table-row"
        >
            <Td data-testid="user-col" {...tdProps}>
                <Address
                    ens
                    address={balance.user.id}
                    chainId={chainId}
                    responsive
                    truncated
                    size="md"
                    textDecoration={addressTextDecoration}
                    bg={addressBackground}
                    px="0.5rem"
                    py="0.25rem"
                    color={addressColor}
                    minWidth="120px"
                    shouldDisplayFallbackAvatar
                />
            </Td>

            <Td data-testid="stake-since-col" {...tdProps}>
                {formattedStakeTime}
            </Td>

            <Td data-testid="total-staked-col" {...tdProps}>
                {formatCTSI(stakedBalance, 2)} CTSI
            </Td>

            <Td data-testid="shares-col" isNumeric {...tdProps}>
                <Flex alignItems="center">
                    <Text as="span" mr={1}>
                        {truncateNumber(balance.sharesPercent * 100)}%
                    </Text>
                    <Tooltip label={`Unformatted: ${balance.sharesPercent} %`}>
                        <Icon />
                    </Tooltip>
                </Flex>
            </Td>

            <Td data-testid="accumulated-shared-col" isNumeric {...tdProps}>
                {truncateNumber(balance.accumulatedSharesPercent * 100)}%
            </Td>
        </Tr>
    );
};

export default UsersTableRow;
