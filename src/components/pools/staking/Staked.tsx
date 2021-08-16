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
import { FaCoins } from 'react-icons/fa';
import { GrAdd, GrSubtract } from 'react-icons/gr';
import CTSI from './CTSI';
import Title from './Title';

export interface StakedProps {
    balance: BigNumber;
    onStake: () => void;
    onUnstake: () => void;
}

const Staked: FC<StakedProps> = ({ balance, onStake, onUnstake }) => {
    return (
        <HStack justify="space-between">
            <Title
                title="Staked"
                icon={<FaCoins />}
                help="Amount of your staked tokens in the pool. You earn rewards proportional to your percentage of the pool total stake."
            />
            <HStack align="baseline">
                <CTSI value={balance} />
                <Text fontSize="small">CTSI</Text>
                <HStack minW={100}>
                    <Tooltip label="Stake" placement="top">
                        <IconButton
                            icon={<GrAdd />}
                            aria-label="Deposit"
                            size="md"
                            onClick={onStake}
                        />
                    </Tooltip>
                    <Tooltip label="Unstake" placement="top">
                        <IconButton
                            icon={<GrSubtract />}
                            aria-label="Withdraw"
                            size="md"
                            onClick={onUnstake}
                        />
                    </Tooltip>
                </HStack>
            </HStack>
        </HStack>
    );
};

export default Staked;
