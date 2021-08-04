// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    HStack,
    Icon,
    IconButton,
    ScaleFade,
    StackDivider,
    StackProps,
    Text,
    Tooltip,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { FC } from 'react';
import { FaCoins, FaUser, FaUsers, FaWallet } from 'react-icons/fa';
import { GrAdd, GrSubtract } from 'react-icons/gr';
import { BsClockHistory } from 'react-icons/bs';
import CTSIText from '../CTSIText';
import { LockIcon } from '@chakra-ui/icons';
import UserStakeForm from './UserStakeForm';
import UserUnstakeForm from './UserUnstakeForm';

export interface UserPoolProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    shares: BigNumber;
    staked: BigNumber;
    released: BigNumber;
    withdrawBalance: BigNumber;
    paused: boolean;
    onDeposit: (amount: BigNumberish) => void;
    onWithdraw: (amount: BigNumberish) => void;
    onApprove: (amount: BigNumberish) => void;
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
        released,
        withdrawBalance,
        onApprove,
        onStake,
        onUnstake,
        onDeposit,
        onWithdraw,
        ...stackProps
    } = props;

    const stake = useDisclosure();
    const unstake = useDisclosure();
    const deposit = useDisclosure();
    const withdraw = useDisclosure();

    return (
        <VStack
            shadow="md"
            p={5}
            borderLeft="10px solid black"
            align="stretch"
            divider={<StackDivider />}
            {...stackProps}
        >
            <CTSIText value={balance} direction="row" icon={FaWallet}>
                <HStack>
                    <Text>Wallet</Text>
                </HStack>
            </CTSIText>
            <CTSIText value={released} direction="row" icon={FaUsers}>
                <HStack>
                    <Text>Pool</Text>
                    {!(withdraw.isOpen || deposit.isOpen) && (
                        <Tooltip
                            label={paused ? 'Deposit paused' : 'Deposit'}
                            placement="top"
                        >
                            <span>
                                <IconButton
                                    isDisabled={paused}
                                    icon={paused ? <LockIcon /> : <GrAdd />}
                                    aria-label="Deposit"
                                    size="md"
                                    onClick={deposit.onToggle}
                                />
                            </span>
                        </Tooltip>
                    )}
                    <ScaleFade
                        initialScale={0.9}
                        in={deposit.isOpen}
                        unmountOnExit
                    >
                        <UserStakeForm
                            allowance={allowance}
                            onApprove={onApprove}
                            onStake={onDeposit}
                            onCancel={deposit.onClose}
                        />
                    </ScaleFade>
                    {!(withdraw.isOpen || deposit.isOpen) && (
                        <Tooltip label="Withdraw" placement="top">
                            <IconButton
                                icon={<GrSubtract />}
                                aria-label="Withdraw"
                                size="md"
                                onClick={withdraw.onToggle}
                            />
                        </Tooltip>
                    )}
                    <ScaleFade
                        initialScale={0.9}
                        in={withdraw.isOpen}
                        unmountOnExit
                    >
                        <UserUnstakeForm
                            onUnstake={onUnstake}
                            onCancel={withdraw.onClose}
                        />
                    </ScaleFade>
                </HStack>
            </CTSIText>
            <CTSIText value={staked} direction="row" icon={FaCoins}>
                <HStack>
                    <Text>Staked</Text>
                    {!(unstake.isOpen || stake.isOpen) && (
                        <Tooltip
                            label={paused ? 'Stake paused' : 'Stake'}
                            placement="top"
                        >
                            <span>
                                <IconButton
                                    isDisabled={paused}
                                    icon={paused ? <LockIcon /> : <GrAdd />}
                                    aria-label="Stake"
                                    size="md"
                                    onClick={stake.onToggle}
                                />
                            </span>
                        </Tooltip>
                    )}
                    <ScaleFade
                        initialScale={0.9}
                        in={stake.isOpen}
                        unmountOnExit
                    >
                        <UserStakeForm
                            allowance={allowance}
                            onApprove={onApprove}
                            onStake={onStake}
                            onCancel={stake.onClose}
                        />
                    </ScaleFade>
                    {!(unstake.isOpen || stake.isOpen) && (
                        <Tooltip label="Unstake" placement="top">
                            <IconButton
                                icon={<GrSubtract />}
                                aria-label="Unstake"
                                size="md"
                                onClick={unstake.onToggle}
                            />
                        </Tooltip>
                    )}
                    <ScaleFade
                        initialScale={0.9}
                        in={unstake.isOpen}
                        unmountOnExit
                    >
                        <UserUnstakeForm
                            onUnstake={onUnstake}
                            onCancel={unstake.onClose}
                        />
                    </ScaleFade>
                </HStack>
            </CTSIText>{' '}
        </VStack>
    );
};

export default UserPool;
