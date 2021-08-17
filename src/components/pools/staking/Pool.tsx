// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { FaUsers } from 'react-icons/fa';
import { GrAdd, GrSubtract } from 'react-icons/gr';
import CTSI from './CTSI';
import Title from './Title';

export interface PoolProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber;
    userBalance: BigNumber; // user pool balance
    withdrawBalance: BigNumber; // amount of token user can actually withdraw
    onDeposit: () => void;
    onWithdraw: () => void;
}

const Pool: FC<PoolProps> = ({
    balance,
    allowance,
    userBalance,
    withdrawBalance,
    onDeposit,
    onWithdraw,
}) => {
    return (
        <HStack justify="space-between">
            <Title
                title="Pool"
                icon={<FaUsers />}
                help="Amount of free tokens in the pool assigned to you. You must deposit tokens before staking them."
            />
            <HStack align="baseline">
                <CTSI value={userBalance} />
                <Text fontSize="small">CTSI</Text>
                <HStack minW={100}>
                    <Tooltip label="Deposit" placement="top">
                        <span>
                            <IconButton
                                icon={<GrAdd />}
                                aria-label="Deposit"
                                size="md"
                                disabled={allowance.eq(0) || balance.eq(0)}
                                onClick={onDeposit}
                            />
                        </span>
                    </Tooltip>
                    <Tooltip label="Withdraw" placement="top">
                        <span>
                            <IconButton
                                icon={<GrSubtract />}
                                aria-label="Withdraw"
                                size="md"
                                disabled={withdrawBalance.eq(0)}
                                onClick={onWithdraw}
                            />
                        </span>
                    </Tooltip>
                </HStack>
            </HStack>
        </HStack>
    );
};

export default Pool;
