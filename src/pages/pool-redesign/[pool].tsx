// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';

import Layout from '../../components/Layout';
import AddressText from '../../components/AddressText';
import { Box, Stack, VStack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { StakingGuide } from '../../components/poolRedesign/StakingGuide';
import { StakingTabNavigation } from '../../components/poolRedesign/StakingTabNavigation';
import { useColorModeValue } from '@chakra-ui/react';
import { StakingActivity } from '../../components/poolRedesign/StakingActivity';
import { Staking } from '../../components/poolRedesign/Staking';
import { StakingDashboard } from '../../components/poolRedesign/StakingDashboard';
import { useStakingPool } from '../../services/pool';
import { useBalance, useBlockNumber } from '../../services/eth';
import { useCartesiToken } from '../../services/token';
import { useRouter } from 'next/router';
import { useWallet } from '../../contexts/wallet';
import { BigNumber } from 'ethers';

const poolRedesign = () => {
    const { account, chainId, active: isConnected } = useWallet();

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
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={5}
            >
                <Stack
                    justify="space-between"
                    alignItems={{ base: 'flex-start', lg: 'flex-end' }}
                    direction={{ base: 'column', lg: 'row' }}
                >
                    <VStack alignItems="flex-start" pb="5">
                        <Button
                            href="/pools"
                            as="a"
                            leftIcon={<ArrowBackIcon />}
                            variant="text"
                            size="sm"
                            pl="0"
                        >
                            Staking pool
                        </Button>

                        <AddressText
                            address={address}
                            chainId={chainId}
                            // icon={FaUsers}
                            fontSize={['xl', '3xl']}
                        />
                    </VStack>

                    <StakingTabNavigation />
                </Stack>
            </Box>

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 4, sm: 6, lg: 6 }}
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
                py={{ base: 6, sm: 8, lg: 8 }}
            >
                {isConnected && (
                    <Staking
                        userWalletBalance={balance}
                        allowance={allowance}
                        userPoolBalance={userBalance}
                        userETHBalance={userETHBalance}
                        stakedBalance={stakedBalance}
                        onWithdraw={withdraw}
                        onApprove={(amount) => approve(address, amount)}
                        onDeposit={deposit}
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

export default poolRedesign;
