// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Collapse,
    HStack,
    IconButton,
    StackProps,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { FC } from 'react';
import { FaCoins } from 'react-icons/fa';
import { GrAdd, GrSubtract } from 'react-icons/gr';
import CTSI from './staking/CTSI';
import Title from './staking/Title';
import Wallet from './staking/Wallet';
import Allowance from './staking/Allowance';
import Deposit from './staking/Deposit';
import Pool from './staking/Pool';
import Withdraw from './staking/Withdraw';

export interface UserPoolProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userBalance: BigNumber; // user pool balance
    shares: BigNumber; // user shares
    staked: BigNumber; // user stake
    paused: boolean;
    onApprove: (amount: BigNumberish) => void;
    onDeposit: (amount: BigNumberish) => void;
    onWithdraw: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
    onUnstake: (amount?: BigNumberish) => void;
}

const UserPool: FC<UserPoolProps> = (props) => {
    const {
        balance,
        allowance,
        paused,
        shares,
        staked,
        userBalance,
        onApprove,
        onStake,
        onUnstake,
        onDeposit,
        onWithdraw,
        ...stackProps
    } = props;

    // controller for hidden fields
    const depositDisclosure = useDisclosure();
    const withdrawDisclosure = useDisclosure();
    const stakeDisclosure = useDisclosure();
    const unstakeDisclosure = useDisclosure();

    const onDepositChange = (value: BigNumberish) => {
        console.log('deposit', value.toString());
    };

    const onWithdrawChange = (value: BigNumberish) => {
        console.log('withdraw', value.toString());
    };

    return (
        <VStack
            shadow="md"
            p={5}
            align="stretch"
            borderLeft="10px solid black"
            {...stackProps}
        >
            <Wallet balance={balance} />
            <Allowance allowance={allowance} onApprove={onApprove} />
            <Collapse
                in={depositDisclosure.isOpen}
                animateOpacity
                unmountOnExit
            >
                <Deposit
                    allowance={allowance}
                    balance={balance}
                    onCancel={depositDisclosure.onClose}
                    onSubmit={onDeposit}
                    onChange={onDepositChange}
                />
            </Collapse>
            <Collapse
                in={withdrawDisclosure.isOpen}
                animateOpacity
                unmountOnExit
            >
                <Withdraw
                    balance={userBalance}
                    onCancel={withdrawDisclosure.onClose}
                    onSubmit={onWithdraw}
                    onChange={onWithdrawChange}
                />
            </Collapse>
            <Pool
                balance={userBalance}
                onDeposit={depositDisclosure.onOpen}
                onWithdraw={withdrawDisclosure.onOpen}
            />
            <HStack justify="space-between">
                <Title
                    title="Staked"
                    icon={<FaCoins />}
                    help="Amount of your staked tokens in the pool. You earn rewards proportional to your percentage of the pool total stake."
                />
                <HStack align="baseline">
                    <CTSI value={staked} />
                    <Text fontSize="small">CTSI</Text>
                    <HStack minW={100}>
                        <Tooltip label="Stake" placement="top">
                            <IconButton
                                icon={<GrAdd />}
                                aria-label="Stake"
                                size="md"
                                onClick={stakeDisclosure.onToggle}
                            />
                        </Tooltip>
                        <Tooltip label="Unstake" placement="top">
                            <IconButton
                                icon={<GrSubtract />}
                                aria-label="Unstake"
                                size="md"
                                onClick={unstakeDisclosure.onToggle}
                            />
                        </Tooltip>
                    </HStack>
                </HStack>
            </HStack>
        </VStack>
    );
};

export default UserPool;
