// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, constants } from 'ethers';
import { HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import {
    FaCoins,
    FaPercentage,
    FaTrophy,
    FaUnlock,
    FaUsers,
    FaWallet,
} from 'react-icons/fa';

import Layout from '../../components/Layout';
import { useBlockNumber } from '../../services/eth';
import { useStakingPool } from '../../services/pool';
import { useCartesiToken } from '../../services/token';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import { useStaking } from '../../services/staking';
import CTSIText from '../../components/CTSIText';
import AddressText from '../../components/AddressText';
import StatsPanel from '../../components/home/StatsPanel';
import ActionsTab from '../../components/pools/ActionsTab';
import TransactionFeedback from '../../components/TransactionFeedback';
import BalancePanel from '../../components/pools/BalancePanel';
import UserStake from '../../components/pools/UserStake';

const Pool = () => {
    const router = useRouter();
    const { account, chainId } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const {
        pool,
        amount,
        amounts,
        stakedBalance,
        stakedShares,
        paused,
        releasedBalance,
        withdrawBalance,
        unstakeTimestamp,
        transaction,
        amountToShares,
        stake,
        unstake,
        withdraw,
        rebalance,
    } = useStakingPool(router.query.pool as string, account);

    const {
        balance,
        allowance,
        transaction: tokenTransaction,
        approve,
    } = useCartesiToken(account, router.query.pool as string, blockNumber);

    const { balance: poolBalance } = useCartesiToken(
        router.query.pool as string,
        null,
        blockNumber
    );

    const staking = useStaking(router.query.pool as string);
    const stakingPool = useStakingPoolQuery(router.query.pool as string);

    const now = new Date();
    const stakeLocked =
        stakedBalance.gt(0) &&
        unstakeTimestamp &&
        unstakeTimestamp.getTime() > now.getTime();

    const onUnstake = (amount?: BigNumber) => {
        if (amount) {
            // convert CTSI to shares
            unstake(amountToShares(amount));
        } else {
            // full unstake
            unstake(stakedShares);
        }
    };

    return (
        <Layout>
            <Head>
                <title>Cartesi - Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                px="6vw"
                py={5}
                justify="space-between"
                align="flex-end"
                bg="black"
                opacity={0.87}
                color="white"
            >
                <AddressText
                    address={stakingPool?.id}
                    chainId={chainId}
                    icon={FaUsers}
                >
                    <Text>Staking Pool</Text>
                </AddressText>
                <CTSIText
                    value={balance}
                    icon={FaWallet}
                    bg="black"
                    color="white"
                >
                    <Text bg="black" color="white">
                        Wallet Balance
                    </Text>
                </CTSIText>
            </HStack>
            {stakingPool &&
                account &&
                stakingPool.manager == account.toLowerCase() && (
                    <Link href={`/pools/${router.query.pool}/edit`}>
                        <EditIcon fontSize="xx-large" />
                    </Link>
                )}

            <VStack px="6vw" py={5} spacing={10}>
                <TransactionFeedback transaction={transaction}>
                    Sending transaction...
                </TransactionFeedback>
                <TransactionFeedback transaction={tokenTransaction}>
                    Sending transaction...
                </TransactionFeedback>
                <BalancePanel
                    w="100%"
                    amount={amount}
                    pool={poolBalance}
                    stake={amounts?.stake}
                    unstake={amounts?.unstake}
                    withdraw={amounts?.withdraw}
                    stakingMature={staking?.stakedBalance}
                    stakingMaturing={staking?.maturingBalance}
                    stakingReleasing={
                        staking?.releasingTimestamp?.getTime() > Date.now()
                            ? staking.releasingBalance
                            : constants.Zero
                    }
                    stakingReleased={
                        staking?.releasingTimestamp?.getTime() <= Date.now()
                            ? staking.releasingBalance
                            : constants.Zero
                    }
                    stakingMaturingTimestamp={staking?.maturingTimestamp}
                    stakingReleasingTimestamp={staking?.releasingTimestamp}
                    hideZeros={true}
                    onRebalance={rebalance}
                />
                <StakingDisclaimer key="readDisclaimer" />
            </VStack>

            <HStack
                px="6vw"
                justify="space-between"
                spacing={10}
                align="flex-start"
            >
                <UserStake
                    w="100%"
                    allowance={allowance}
                    shares={stakedShares}
                    staked={stakedBalance}
                    released={releasedBalance}
                    withdrawBalance={withdrawBalance}
                    paused={paused.valueOf()}
                    onApprove={(amount) => approve(pool.address, amount)}
                    onStake={stake}
                    onUnstake={onUnstake}
                    onWithdraw={withdraw}
                />
                <ActionsTab
                    minW={500}
                    maxW={500}
                    allowance={allowance}
                    paused={paused.valueOf()}
                    stakedAmount={stakedBalance}
                    stakedShares={stakedShares}
                    releasedBalance={releasedBalance}
                    withdrawBalance={withdrawBalance}
                    onApprove={(amount) => approve(pool.address, amount)}
                    onStake={(amount) => stake(amount)}
                    onUnstake={onUnstake}
                    onWithdraw={withdraw}
                >
                    <Text>Test</Text>
                </ActionsTab>
            </HStack>
            <StatsPanel w="100%">
                <CTSIText
                    icon={FaTrophy}
                    value={BigNumber.from(stakingPool?.user?.totalReward || 0)}
                >
                    <Text>Total Rewards</Text>
                </CTSIText>
                <CTSIText
                    icon={FaPercentage}
                    value={BigNumber.from(stakingPool?.totalCommission || 0)}
                >
                    <Text>Commission</Text>
                </CTSIText>
            </StatsPanel>
        </Layout>
    );
};

export default Pool;
