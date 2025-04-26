// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Flex, Icon, Table, TableCellProps, Text } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { FC } from 'react';
import { PoolBalanceWithAccumulatedShares } from '../../../graphql/models';
import { formatCTSI } from '../../../utils/token';
import Address from '../../Address';
import { useColorModeValue } from '../../ui/color-mode';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '../../Tooltip';

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
    const tdProps: TableCellProps = {
        borderColor,
        paddingTop: 4,
        paddingBottom: 4,
    };

    return (
        <Table.Row
            key={balance.pool.id}
            backgroundColor={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            data-testid="users-table-row"
        >
            <Table.Cell data-testid="user-col" {...tdProps}>
                <Address
                    ens
                    address={balance.user.id}
                    chainId={chainId}
                    responsive
                    truncated
                    textDecoration="underline"
                    px="0.5rem"
                    py="0.25rem"
                    color={addressColor}
                    minWidth="120px"
                    shouldDisplayFallbackAvatar
                />
            </Table.Cell>

            <Table.Cell data-testid="stake-since-col" {...tdProps}>
                {formattedStakeTime}
            </Table.Cell>

            <Table.Cell data-testid="total-staked-col" {...tdProps}>
                {formatCTSI(stakedBalance, 2)} CTSI
            </Table.Cell>

            <Table.Cell data-testid="shares-col" {...tdProps}>
                <Flex alignItems="center">
                    <Text as="span" mr={1}>
                        {truncateNumber(balance.sharesPercent * 100)}%
                    </Text>
                    <Tooltip
                        showArrow
                        content={`Unformatted: ${balance.sharesPercent} %`}
                        positioning={{ placement: 'top' }}
                        openDelay={0}
                    >
                        <Icon as={FaRegQuestionCircle} />
                    </Tooltip>
                </Flex>
            </Table.Cell>

            <Table.Cell data-testid="accumulated-shared-col" {...tdProps}>
                {truncateNumber(balance.accumulatedSharesPercent * 100)}%
            </Table.Cell>
        </Table.Row>
    );
};

export default UsersTableRow;
