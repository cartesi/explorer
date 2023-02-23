// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import { useWallet } from '@explorer/wallet';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import PageHead from '../../../components/PageHead';
import { PoolBreadcrumbs } from '../../../components/stake/PoolBreadcrumbs';
import { PoolHeader } from '../../../components/stake/PoolHeader';
import { Staking } from '../../../components/stake/Staking';
import { StakingActivity } from '../../../components/stake/StakingActivity';
import { StakingDashboard } from '../../../components/stake/StakingDashboard';
import { StakingGuide } from '../../../components/stake/StakingGuide';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';
import { useBalance, useBlockNumber } from '../../../services/eth';
import { useStakingPool } from '../../../services/pool';
import { useCartesiToken } from '../../../services/token';
import { Operation } from '../../../types/stake';
import {
    Context,
    ENSStaticProps,
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../../utils/staticGeneration';

export async function getStaticPaths() {
    return getPoolsStaticPaths();
}

export async function getStaticProps(context: Context) {
    return getENSStaticProps(context);
}

const PoolStake = ({ formattedAddress }: ENSStaticProps) => {
    const { account, active: isConnected } = useWallet();

    // get pool address from path
    const router = useRouter();
    const address = router.query.pool as string;

    // query block number (continuously)
    const blockNumber = useBlockNumber();
    const stakingPool = useStakingPoolQuery(address);
    const isManager = account && account.toLowerCase() === stakingPool?.manager;

    // query pool data
    const {
        stakedShares,
        balance: userBalance,
        depositTimestamp,
        withdrawTransaction,
        lockTime,
        depositTransaction,
        stakeTransaction,
        unstakeTransaction,
        amountToShares,
        sharesToAmount,
        deposit,
        stake,
        unstake,
        withdraw,
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

    const bg = useColorModeValue('gray.80', 'header');

    const onUnstake = (action: Operation, amount?: BigNumber) => {
        if (action === 'partial' && amount) {
            // convert CTSI to shares
            unstake(amountToShares(amount));
        } else if (action === 'full') {
            // full unstake
            unstake(stakedShares);
        }
    };

    return (
        <Layout>
            <PageHead
                title={`Stake to ${formattedAddress}`}
                description={`Stake to ${formattedAddress}`}
            />
            <PoolHeader isManager={isManager} from="stake" />

            <PoolBreadcrumbs currentPage="Stake" />

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 4, sm: 6, lg: 8 }}
            >
                {isConnected ? (
                    <StakingDashboard
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
                        depositTransaction={depositTransaction}
                        withdrawTransaction={withdrawTransaction}
                        stakeTransaction={stakeTransaction}
                        unstakeTransaction={unstakeTransaction}
                    />
                )}
            </Box>

            {isConnected && (
                <Box
                    p={{ base: '40px', lg: '40px 0', xl: '40px 0' }}
                    width="800px"
                    maxWidth="100%"
                    margin="0 auto"
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

export default PoolStake;
