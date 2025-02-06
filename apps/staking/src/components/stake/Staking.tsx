// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    StackProps,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC } from 'react';
import { Transaction } from '../../services/transaction';
import { Operation } from '../../types/stake';
import { useTimeLeft } from '../../utils/react';
import { TimerIcon } from '../Icons';
import TransactionBanner from '../TransactionBanner';
import { DepositSection } from './components/DepositSection';
import { PoolBalanceSection } from './components/PoolBalanceSection';
import { StakedBalanceSection } from './components/StakedBalanceSection';
import { StakingInstructions } from './components/StakingInstructions';
import { InfoBanner } from './InfoBanner';
import { StakingDepositModal } from './modals/StakingDepositModal';
import { StakingStakeModal } from './modals/StakingStakeModal';
import { StakingUnstakeModal } from './modals/StakingUnstakeModal';
import { StakingWithdrawModal } from './modals/StakingWithdrawModal';

export interface StakingProps extends StackProps {
    userWalletBalance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userPoolBalance: BigNumber; // user pool balance
    userETHBalance: BigNumber; // user ETH balance
    stakedBalance: BigNumber; // user stake balance
    depositTimestamp: Date;
    lockTime: number;
    onApprove: (amount: BigNumberish) => void;
    onDeposit: (amount: BigNumberish) => void;
    onWithdraw: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
    onUnstake: (op: Operation, amount?: BigNumberish) => void;
    tokenTransaction: Transaction<any>;
    depositTransaction: Transaction<any>;
    withdrawTransaction: Transaction<any>;
    stakeTransaction: Transaction<any>;
    unstakeTransaction: Transaction<any>;
}

export const Staking: FC<StakingProps> = ({
    userWalletBalance,
    userPoolBalance,
    userETHBalance,
    stakedBalance,
    allowance,
    depositTimestamp,
    lockTime,
    onApprove,
    onDeposit,
    onWithdraw,
    onStake,
    onUnstake,
    tokenTransaction,
    depositTransaction,
    withdrawTransaction,
    stakeTransaction,
    unstakeTransaction,
}) => {
    const stakeUnlock = depositTimestamp
        ? depositTimestamp.getTime() + lockTime * 1000
        : 0;
    const unlock = useTimeLeft(stakeUnlock, 2, false);
    const unlockHumanized = useTimeLeft(stakeUnlock, 2, true);
    const isMaturingDeposit = Date.now() < stakeUnlock;
    const iconColor = useColorModeValue('blue.500', 'dark.primary');

    const depositDisclosure = useDisclosure();
    const withdrawDisclosure = useDisclosure();
    const stakeDisclosure = useDisclosure();
    const unstakeDisclosure = useDisclosure();

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(parseFloat(formatUnits(value, 18)));
    };

    return (
        <>
            <StakingInstructions />

            <VStack
                spacing={6}
                alignItems="stretch"
                width="800px"
                maxWidth="100%"
                margin="0 auto"
            >
                <DepositSection
                    userWalletBalance={userWalletBalance}
                    userETHBalance={userETHBalance}
                    onDepositClick={depositDisclosure.onOpen}
                />

                <TransactionBanner
                    title="Setting allowance..."
                    failTitle="Error setting allowance"
                    successDescription="New allowance set successfully."
                    transaction={tokenTransaction}
                />

                <TransactionBanner
                    title="Setting deposit..."
                    failTitle="Error setting deposit"
                    successDescription="New deposit set successfully."
                    transaction={depositTransaction}
                />

                {isMaturingDeposit && (
                    <InfoBanner
                        title={`${toCTSI(
                            userPoolBalance
                        )} CTSI will be ready for staking soon`}
                        content={`It will take ${
                            unlockHumanized || 'unknown'
                        } to unlock your deposited tokens before staking them.`}
                        isOpen
                        status="info"
                        role="info-banner"
                        icon={
                            <VStack mr={4} spacing={1}>
                                <TimerIcon boxSize="6" color={iconColor} />
                                <Box fontSize="xs" fontWeight="bold">
                                    {unlock}
                                </Box>
                            </VStack>
                        }
                    />
                )}

                <TransactionBanner
                    title="Withdrawing..."
                    failTitle="Error withdrawing"
                    successDescription="Withdrawed successfully."
                    transaction={withdrawTransaction}
                />

                <PoolBalanceSection
                    userPoolBalance={userPoolBalance}
                    isPoolBalanceLocked={isMaturingDeposit}
                    onStakeClick={stakeDisclosure.onOpen}
                    onWithdrawClick={withdrawDisclosure.onOpen}
                />

                <TransactionBanner
                    title="Staking..."
                    failTitle="Error staking"
                    successDescription="Stake set successfully."
                    transaction={stakeTransaction}
                />

                <TransactionBanner
                    title="Unstaking..."
                    failTitle="Error unstaking"
                    successDescription="Unstaked successfully."
                    transaction={unstakeTransaction}
                />

                <StakedBalanceSection
                    stakedBalance={stakedBalance}
                    onUnstakeClick={unstakeDisclosure.onOpen}
                />
            </VStack>

            <StakingDepositModal
                isOpen={depositDisclosure.isOpen}
                onClose={depositDisclosure.onClose}
                allowance={allowance}
                balance={userWalletBalance}
                disclosure={depositDisclosure}
                onSave={(amount, where) => {
                    if (where === 'allowance') {
                        onApprove(amount);
                    } else {
                        onDeposit(amount);
                    }
                }}
            />

            <StakingStakeModal
                isOpen={stakeDisclosure.isOpen}
                onClose={stakeDisclosure.onClose}
                balance={userWalletBalance}
                userBalance={userPoolBalance}
                disclosure={stakeDisclosure}
                onSave={onStake}
            />

            <StakingWithdrawModal
                isOpen={withdrawDisclosure.isOpen}
                onClose={withdrawDisclosure.onClose}
                userBalance={userPoolBalance}
                disclosure={withdrawDisclosure}
                onSave={onWithdraw}
            />

            {stakedBalance && (
                <StakingUnstakeModal
                    isOpen={unstakeDisclosure.isOpen}
                    onClose={unstakeDisclosure.onClose}
                    stakedBalance={stakedBalance}
                    disclosure={unstakeDisclosure}
                    onSave={onUnstake}
                />
            )}
        </>
    );
};
