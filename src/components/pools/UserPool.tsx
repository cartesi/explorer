// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Collapse, StackProps, useDisclosure, VStack } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { FC } from 'react';
import Wallet from './staking/Wallet';
import Allowance from './staking/Allowance';
import Deposit from './staking/Deposit';
import Pool from './staking/Pool';
import Withdraw from './staking/Withdraw';
import Staked from './staking/Staked';
import Stake from './staking/Stake';
import Unstake from './staking/Unstake';

export interface UserPoolProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userBalance: BigNumber; // user pool balance
    shares: BigNumber; // user shares
    staked: BigNumber; // user stake
    withdrawBalance: BigNumber; // amount of token user can actually withdraw
    paused: boolean;
    depositTimestamp: Date;
    lockTime: number;
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
        depositTimestamp,
        lockTime,
        staked,
        userBalance,
        withdrawBalance,
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
                    onSubmit={(amount) => {
                        onDeposit(amount);
                        depositDisclosure.onClose();
                    }}
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
                    onSubmit={(amount) => {
                        onWithdraw(amount);
                        withdrawDisclosure.onClose();
                    }}
                />
            </Collapse>
            <Pool
                balance={balance}
                allowance={allowance}
                userBalance={userBalance}
                withdrawBalance={withdrawBalance}
                paused={paused.valueOf()}
                onDeposit={depositDisclosure.onOpen}
                onWithdraw={withdrawDisclosure.onOpen}
            />
            <Collapse in={stakeDisclosure.isOpen} animateOpacity unmountOnExit>
                <Stake
                    balance={userBalance}
                    onCancel={stakeDisclosure.onClose}
                    onSubmit={(value) => {
                        onStake(value);
                        stakeDisclosure.onClose();
                    }}
                />
            </Collapse>
            <Collapse
                in={unstakeDisclosure.isOpen}
                animateOpacity
                unmountOnExit
            >
                <Unstake
                    staked={staked}
                    onCancel={unstakeDisclosure.onClose}
                    onSubmit={(value) => {
                        onUnstake(value);
                        unstakeDisclosure.onClose();
                    }}
                />
            </Collapse>
            <Staked
                balance={staked}
                depositTimestamp={depositTimestamp}
                lockTime={lockTime}
                onStake={stakeDisclosure.onOpen}
                onUnstake={unstakeDisclosure.onOpen}
            />
        </VStack>
    );
};

export default UserPool;
