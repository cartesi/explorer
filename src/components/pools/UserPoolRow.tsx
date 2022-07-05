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
    Button,
    Flex,
    HStack,
    Progress,
    Td,
    Tooltip,
    Tr,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ArrowBackIcon, ArrowForwardIcon, LockIcon } from '@chakra-ui/icons';
import { BigNumber } from '@ethersproject/bignumber';

import { PoolBalance } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import { userShare } from '../../graphql/hooks/usePoolBalances';
import { useStakingPool } from '../../services/pool';

export interface UserPoolRowProps {
    chainId: number;
    walletBalance: BigNumber;
    balance: PoolBalance;
    account?: string;
}

const UserPoolRow: FC<UserPoolRowProps> = ({
    chainId,
    walletBalance,
    account,
    balance,
}) => {
    // hover style
    const backgroundColor = useColorModeValue('WhiteSmoke', 'gray.700');

    // poor manager is logged user, allow edit
    const edit = account && account.toLowerCase() === balance.pool.manager;

    const percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
    });

    const address = balance.pool.id;

    // query pool data
    const {
        balance: unstakedBalance,
        stakedShares,
        withdrawBalance,
        depositTimestamp,
        stakeTimestamp,
        stake,
        withdraw,
        transaction,
        sharesToAmount,
    } = useStakingPool(address, account);

    const stakedBalance = sharesToAmount(stakedShares);

    // indicator for time to stake
    const lock = stakeTimestamp?.getTime() - depositTimestamp?.getTime();
    const now = Date.now();
    let percentElapsed = ((now - depositTimestamp?.getTime()) / lock) * 100;
    percentElapsed = Math.min(percentElapsed, 100);
    percentElapsed = Math.max(percentElapsed, 0);

    const bp = useBreakpointValue([0, 1, 2, 3]);

    return (
        <Tr key={balance.pool.id} _hover={{ backgroundColor }}>
            <Td>
                <Address
                    ens
                    address={balance.pool.id}
                    chainId={chainId}
                    truncated
                />

                <HStack justify="flex-start" mt="0.6em">
                    {edit && (
                        <NextLink href={`/pools/${balance.pool.id}/edit`}>
                            <Button size="sm">Manage</Button>
                        </NextLink>
                    )}
                    <NextLink href={`/pool-redesign/${balance.pool.id}`}>
                        <Button size="sm">Stake</Button>
                    </NextLink>
                    {balance.pool.paused && (
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
            <Td isNumeric>{formatCTSI(walletBalance, 2)} CTSI</Td>
            <Td hidden={bp < 3} isNumeric>
                <Flex direction="column" align="center">
                    <Button
                        leftIcon={<ArrowBackIcon />}
                        size="sm"
                        w={100}
                        disabled={
                            unstakedBalance.isZero() ||
                            withdrawBalance.lt(unstakedBalance)
                        }
                        onClick={() => withdraw(unstakedBalance)}
                        isLoading={transaction.submitting}
                    >
                        Withdraw
                    </Button>
                </Flex>
            </Td>
            <Td isNumeric>{formatCTSI(unstakedBalance, 2)} CTSI</Td>
            <Td hidden={bp < 3} isNumeric>
                <Flex direction="column" align="center">
                    <Button
                        rightIcon={<ArrowForwardIcon />}
                        size="sm"
                        w={100}
                        disabled={
                            unstakedBalance.isZero() ||
                            Date.now() < stakeTimestamp?.getTime()
                        }
                        onClick={() => stake(unstakedBalance)}
                        isLoading={transaction.submitting}
                    >
                        Stake
                    </Button>
                    {percentElapsed > 0 && percentElapsed < 100 && (
                        <Progress
                            value={percentElapsed}
                            size="xs"
                            w={100}
                            colorScheme="blue"
                        />
                    )}
                </Flex>
            </Td>
            <Td isNumeric>{formatCTSI(stakedBalance, 2)} CTSI</Td>
            <Td isNumeric>{percentFormatter.format(userShare(balance))}</Td>
        </Tr>
    );
};

export default UserPoolRow;
