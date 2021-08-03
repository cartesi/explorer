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
import { BigNumber, BigNumberish, constants } from 'ethers';
import { FC } from 'react';
import { FaCoins } from 'react-icons/fa';
import { CgRemove } from 'react-icons/cg';
import { GrAdd, GrSubtract } from 'react-icons/gr';
import { BsClockHistory } from 'react-icons/bs';
import CTSIText from '../CTSIText';
import { ExternalLinkIcon, LockIcon } from '@chakra-ui/icons';
import UserStakeForm from './UserStakeForm';
import UserUnstakeForm from './UserUnstakeForm';

export interface UserStakeProps extends StackProps {
    allowance: BigNumber;
    shares: BigNumber;
    staked: BigNumber;
    released: BigNumber;
    withdrawBalance: BigNumber;
    paused: boolean;
    onWithdraw: () => void;
    onApprove: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
    onUnstake: (amount?: BigNumberish) => void;
}

const UserStake: FC<UserStakeProps> = (props) => {
    const {
        allowance,
        paused,
        shares,
        staked,
        released,
        withdrawBalance,
        onApprove,
        onStake,
        onUnstake,
        onWithdraw,
        ...stackProps
    } = props;

    const stake = useDisclosure();
    const unstake = useDisclosure();

    return (
        <VStack
            shadow="md"
            p={5}
            borderLeft="10px solid black"
            align="stretch"
            divider={<StackDivider />}
            {...stackProps}
        >
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
            </CTSIText>
            <CTSIText
                value={released}
                direction="row"
                icon={
                    released.gt(constants.Zero) && withdrawBalance.isZero()
                        ? BsClockHistory
                        : CgRemove
                }
            >
                <HStack>
                    <Text>Released</Text>
                    {withdrawBalance.gt(0) && (
                        <Tooltip label="Withdraw" placement="top">
                            <IconButton
                                icon={<ExternalLinkIcon />}
                                size="sm"
                                aria-label="Withdraw "
                                onClick={() => onWithdraw()}
                            />
                        </Tooltip>
                    )}
                    {released.gt(constants.Zero) && withdrawBalance.isZero() && (
                        <Tooltip
                            label="Waiting for withdraw availability"
                            placement="top"
                        >
                            <Icon />
                        </Tooltip>
                    )}
                </HStack>
            </CTSIText>
        </VStack>
    );
};

export default UserStake;
