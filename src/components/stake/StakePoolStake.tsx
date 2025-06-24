// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import { Box } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import Layout from '../Layout';
import { PoolBreadcrumbs } from './PoolBreadcrumbs';
import { PoolHeader } from './PoolHeader';
import { Staking } from './Staking';
import { StakingActivity } from './StakingActivity';
import { StakingDashboard } from './StakingDashboard';
import { StakingGuide } from './StakingGuide';
import { useWallet } from '../wallet';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import { useBalance, useBlockNumber } from '../../services/eth';
import { useStakingPool } from '../../services/pool';
import { useCartesiToken } from '../../services/token';
import { Operation } from '../../types/stake';
import { useParams } from 'next/navigation';
import { useColorModeValue } from '../ui/color-mode';

const PoolStake = () => {
    const { account, active: isConnected } = useWallet();

    // get pool address from path
    const params = useParams();
    const address = params.pool as string;

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

    const layoutBg = useColorModeValue('white', 'dark.gray.quaternary');
    const borderColor = useColorModeValue(
        'transparent',
        'dark.border.quaternary'
    );
    const bg = useColorModeValue('gray.80', 'dark.gray.primary');
    const sectionBg = useColorModeValue('white', 'dark.gray.quaternary');
    const sectionBoxShadow = useColorModeValue('md', 'none');

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
        <Layout bg={layoutBg}>
            <PoolHeader isManager={isManager} from="stake" />

            <PoolBreadcrumbs currentPage="Stake" />

            <Box
                position="relative"
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 4, sm: 6, lg: 8 }}
                bg={sectionBg}
                borderTopWidth={1}
                borderColor={borderColor}
                shadow={sectionBoxShadow}
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
