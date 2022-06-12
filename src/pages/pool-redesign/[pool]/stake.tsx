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

import Layout from '../../../components/Layout';
import { Box } from '@chakra-ui/layout';
import { StakingGuide } from '../../../components/poolRedesign/StakingGuide';
import { useColorModeValue } from '@chakra-ui/react';
import { StakingActivity } from '../../../components/poolRedesign/StakingActivity';
import { Staking } from '../../../components/poolRedesign/Staking';
import { StakingDashboard } from '../../../components/poolRedesign/StakingDashboard';
import { useStakingPool } from '../../../services/pool';
import { useBalance, useBlockNumber } from '../../../services/eth';
import { useCartesiToken } from '../../../services/token';
import { useRouter } from 'next/router';
import { useWallet } from '../../../contexts/wallet';
import { BigNumber } from 'ethers';
import { PoolHeader } from '../../../components/poolRedesign/PoolHeader';
import { PoolBreadcrumbs } from '../../../components/poolRedesign/PoolBreadcrumbs';

const PoolRedesignStake = () => {
    const { account, active: isConnected } = useWallet();

    // get pool address from path
    const router = useRouter();
    const address = router.query.pool as string;

    // query block number (continuouly)
    const blockNumber = useBlockNumber();

    // query pool data
    const {
        // amount,
        // amounts,
        stakedShares,
        // paused,
        balance: userBalance,
        // withdrawBalance,
        depositTimestamp,
        lockTime,
        transaction,
        amountToShares,
        sharesToAmount,
        deposit,
        stake,
        unstake,
        withdraw,
        // rebalance,
    } = useStakingPool(address, account);

    const stakedBalance = sharesToAmount(stakedShares);
    const userETHBalance = useBalance(account);
    // query user balance and allowance
    const {
        balance,
        allowance,
        transaction: tokenTransaction,
        approve,
    } = useCartesiToken(account, address, blockNumber);

    const bg = useColorModeValue('gray.50', 'header');

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
                <title>Cartesi - Stake</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PoolHeader />

            <PoolBreadcrumbs currentPage="Stake" />

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                {isConnected ? (
                    <StakingDashboard
                        userBalance={userBalance}
                        userETHBalance={userETHBalance}
                        balance={balance}
                        allowance={allowance}
                        onApprove={(amount) => approve(address, amount)}
                    />
                ) : (
                    <StakingGuide />
                )}
            </Box>
            <Box
                bg={bg}
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                {isConnected && (
                    <Staking
                        userWalletBalance={balance}
                        allowance={allowance}
                        userPoolBalance={userBalance}
                        userETHBalance={userETHBalance}
                        stakedBalance={stakedBalance}
                        onApprove={(amount) => approve(address, amount)}
                        onDeposit={deposit}
                        onWithdraw={withdraw}
                        onStake={stake}
                        onUnstake={onUnstake}
                        depositTimestamp={depositTimestamp}
                        lockTime={Number(lockTime)}
                        tokenTransaction={tokenTransaction}
                        poolTransaction={transaction}
                    />
                )}
            </Box>

            {isConnected && (
                <Box
                    px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                    py={{ base: 8, sm: 12, lg: 16 }}
                >
                    <StakingActivity
                        userAccount={account}
                        poolAddress={address}
                    />
                </Box>
            )}
        </Layout>
    );
};

export default PoolRedesignStake;
