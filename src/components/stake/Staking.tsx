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
import React, { FC, useState } from 'react';
import { TimerIcon } from '../Icons';
import { InfoBanner } from './InfoBanner';
import { StakingDepositModal } from './modals/StakingDepositModal';
import { StakingStakeModal } from './modals/StakingStakeModal';
import { StakingUnstakeModal } from './modals/StakingUnstakeModal';
import { StakingWithdrawModal } from './modals/StakingWithdrawModal';
import { BigNumber, BigNumberish } from 'ethers';
import { Transaction } from '../../services/transaction';
import { useTimeLeft } from '../../utils/react';
import { TransactionInfoBanner } from './TransactionInfoBanner';
import { formatUnits } from 'ethers/lib/utils';
import { PoolBalanceSection } from './components/PoolBalanceSection';
import { StakedBalanceSection } from './components/StakedBalanceSection';
import { StakingInstructions } from './components/StakingInstructions';
import { DepositSection } from './components/DepositSection';

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
    onUnstake: (amount?: BigNumberish) => void;
    poolTransaction: Transaction<void>;
    tokenTransaction: Transaction<any>;
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
    poolTransaction,
    tokenTransaction,
}) => {
    const stakeUnlock = depositTimestamp
        ? depositTimestamp.getTime() + lockTime * 1000
        : 0;
    const unlock = useTimeLeft(stakeUnlock, 2, false);
    const unlockHumanized = useTimeLeft(stakeUnlock, 2, true);

    const infoColor = useColorModeValue('blue.500', 'blue.200');

    const depositDisclosure = useDisclosure();
    const withdrawDisclosure = useDisclosure();
    const stakeDisclosure = useDisclosure();
    const unstakeDisclosure = useDisclosure();

    const [currentTransaction, setCurrentTransaction] = useState<any>(null);
    const [transactionBanners, setTransactionBanners] = useState<any>({});

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(parseFloat(formatUnits(value, 18)));
    };

    const [allowanceTransaction, setAllowanceTransaction] = useState(false);

    return (
        <>
            <StakingInstructions />

            <VStack spacing={6} alignItems="stretch">
                <DepositSection
                    userWalletBalance={userWalletBalance}
                    userETHBalance={userETHBalance}
                    onDepositClick={depositDisclosure.onOpen}
                />

                <TransactionInfoBanner
                    title="Setting allowance..."
                    failTitle="Error setting allowance"
                    successDescription="New allowance set sucessfully."
                    transaction={tokenTransaction}
                />

                {transactionBanners?.deposit && (
                    <TransactionInfoBanner
                        title="Setting deposit..."
                        failTitle="Error setting deposit"
                        successDescription="New deposit set sucessfully."
                        transaction={
                            currentTransaction === 'deposit'
                                ? poolTransaction
                                : null
                        }
                    />
                )}
                {unlock && (
                    <InfoBanner
                        title={`${toCTSI(
                            userPoolBalance
                        )} CTSI will be ready for staking soon`}
                        content={`It will take ${
                            unlockHumanized || 'unknown'
                        } to unlock your deposited tokens before staking them.`}
                        isOpen
                        status="info"
                        icon={
                            <VStack mr={4} spacing={1} color={infoColor}>
                                <TimerIcon boxSize="6" />
                                <Box fontSize="xs" fontWeight="bold">
                                    {unlock}
                                </Box>
                            </VStack>
                        }
                    />
                )}
                {transactionBanners?.withdraw && (
                    <TransactionInfoBanner
                        title="Withdrawing..."
                        failTitle="Error withdrawing"
                        successDescription="Withdrawed sucessfully."
                        transaction={
                            currentTransaction === 'withdraw'
                                ? poolTransaction
                                : null
                        }
                    />
                )}

                <PoolBalanceSection
                    userPoolBalance={userPoolBalance}
                    isPoolBalanceLocked={!!unlock}
                    onStakeClick={stakeDisclosure.onOpen}
                    onWithdrawClick={withdrawDisclosure.onOpen}
                />

                {transactionBanners?.stake && (
                    <TransactionInfoBanner
                        title="Staking..."
                        failTitle="Error staking"
                        successDescription="Stake set sucessfully."
                        transaction={
                            currentTransaction === 'stake'
                                ? poolTransaction
                                : null
                        }
                    />
                )}
                {transactionBanners?.unstake && (
                    <TransactionInfoBanner
                        title="Unstaking..."
                        failTitle="Error unstaking"
                        successDescription="Unstaked sucessfully."
                        transaction={
                            currentTransaction === 'unstake'
                                ? poolTransaction
                                : null
                        }
                    />
                )}
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
                        setAllowanceTransaction(true);
                        onApprove(amount);
                    } else {
                        setCurrentTransaction('deposit');
                        setTransactionBanners({
                            ...transactionBanners,
                            deposit: true,
                        });
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
                onSave={(amount) => {
                    setCurrentTransaction('stake');
                    setTransactionBanners({
                        ...transactionBanners,
                        stake: true,
                    });
                    onStake(amount);
                }}
            />

            <StakingWithdrawModal
                isOpen={withdrawDisclosure.isOpen}
                onClose={withdrawDisclosure.onClose}
                userBalance={userPoolBalance}
                disclosure={withdrawDisclosure}
                onSave={(amount) => {
                    setCurrentTransaction('withdraw');
                    setTransactionBanners({
                        ...transactionBanners,
                        withdraw: true,
                    });
                    onWithdraw(amount);
                }}
            />

            {stakedBalance && (
                <StakingUnstakeModal
                    isOpen={unstakeDisclosure.isOpen}
                    onClose={unstakeDisclosure.onClose}
                    stakedBalance={stakedBalance}
                    disclosure={unstakeDisclosure}
                    onSave={(amount) => {
                        setCurrentTransaction('unstake');
                        setTransactionBanners({
                            ...transactionBanners,
                            unstake: true,
                        });
                        onUnstake(amount);
                    }}
                />
            )}
        </>
    );
};
