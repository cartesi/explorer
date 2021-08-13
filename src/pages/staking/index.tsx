// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import useUser from '../../graphql/hooks/useUser';
import Layout from '../../components/Layout';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import Node from '../../components/staking/Node';
import Balances from '../../components/staking/Balances';
import StakingTabs from '../../components/staking/Tabs';
import StakingCard from '../../components/staking/Card';
import TotalBalances from '../../components/staking/TotalBalances';
import UnstakeForm from '../../components/staking/UnstakeForm';
import StakeForm from '../../components/staking/StakeForm';
import useSummary from '../../graphql/hooks/useSummary';
import theme from '../../styles/theme';

const Staking = () => {
    const { account } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const {
        staking,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        transaction: stakingTransaction,
        withdraw,
    } = useStaking(account);

    const { transaction: tokenTransaction } = useCartesiToken(
        account,
        staking?.address,
        blockNumber
    );
    const summary = useSummary();

    const user = useUser(account);

    const [readDisclaimer, setReadDisclaimer] = useState<boolean>(true);
    const [maturingCountdown, setMaturingCountdown] = useState<number>();
    const [releasingCountdown, setReleasingCountdown] = useState<number>();
    const [nodeWaiting, setNodeWaiting] = useState<boolean>(false);

    const waiting =
        stakingTransaction.submitting ||
        tokenTransaction.submitting ||
        nodeWaiting;

    const updateTimers = () => {
        if (maturingBalance.gt(0)) {
            setMaturingCountdown(
                maturingTimestamp > new Date()
                    ? maturingTimestamp.getTime() - new Date().getTime()
                    : 0
            );
        }

        if (releasingBalance.gt(0)) {
            setReleasingCountdown(
                releasingTimestamp > new Date()
                    ? releasingTimestamp.getTime() - new Date().getTime()
                    : 0
            );
        }
    };

    useEffect(() => {
        const readDisclaimer = localStorage.getItem('readDisclaimer');
        if (!readDisclaimer || readDisclaimer == 'false')
            setReadDisclaimer(false);
    }, []);

    useEffect(() => {
        updateTimers();

        const interval = setInterval(() => {
            updateTimers();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [maturingTimestamp, releasingTimestamp]);

    const displayTime = (milliseconds: number): string => {
        const hours = Math.floor(milliseconds / 1000 / 60 / 60);
        const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
        const seconds = Math.floor(milliseconds / 1000) % 60;

        return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${(
            '0' + seconds
        ).slice(-2)}`;
    };

    const doWithdraw = () => {
        withdraw(releasingBalance);
    };

    const acceptDisclaimer = () => {
        setReadDisclaimer(true);
        localStorage.setItem('readDisclaimer', 'true');
    };

    const totalBalance = stakedBalance
        .add(maturingBalance)
        .add(releasingBalance);

    return (
        <Layout>
            <Head>
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!readDisclaimer && (
                <Box
                    position="fixed"
                    right={0}
                    width="100%"
                    zIndex={theme.zIndices.xxl}
                    bg="orange.100"
                    pb={2}
                >
                    <StakingDisclaimer persistanceKey="readDisclaimer" />

                    <Flex align="center" justify="flex-end" mt={2} pr={2}>
                        <Button
                            color="white"
                            bg={theme.colors.primary}
                            onClick={acceptDisclaimer}
                        >
                            Accept and continue
                        </Button>
                    </Flex>
                </Box>
            )}

            <Balances />

            <Node setWaiting={setNodeWaiting} mt="-2.5vw" />

            <TotalBalances user={user} totalBalance={totalBalance} my={5} />

            <Flex
                direction={['column', 'column', 'column', 'row']}
                p="50px 6vw 50px 6vw"
            >
                <Box flex="3" pr={[0, 0, 0, 8]} mb={[8, 8, 8, 0]}>
                    <Box mb={8} boxShadow={theme.boxShadows.lg}>
                        <StakingCard title="Maturing" balance={maturingBalance}>
                            {maturingBalance.gt(0) && maturingCountdown > 0 && (
                                <Box mt={1}>
                                    <Text fontSize="sm">{displayTime(1)}</Text>
                                </Box>
                            )}
                        </StakingCard>

                        <StakingCard
                            title="Staked"
                            balance={stakedBalance}
                            isActive
                        />
                    </Box>

                    <StakingCard
                        title={
                            releasingBalance.gt(0) && releasingCountdown === 0
                                ? 'Released'
                                : 'Releasing'
                        }
                        icon="down"
                        balance={maturingBalance}
                        boxShadow={theme.boxShadows.lg}
                    >
                        {releasingBalance.gt(0) && releasingCountdown > 0 && (
                            <Box mt={1}>
                                <Text fontSize="sm">
                                    {displayTime(releasingCountdown)}
                                </Text>
                            </Box>
                        )}

                        {releasingBalance.gt(0) && releasingCountdown === 0 && (
                            <Button
                                size="sm"
                                mt={4}
                                borderRadius={2}
                                color="white"
                                bg={theme.colors.gray9}
                                disabled={!account || waiting}
                                onClick={doWithdraw}
                            >
                                Withdraw
                            </Button>
                        )}
                    </StakingCard>
                </Box>

                <StakingTabs
                    flex={2}
                    Stake={<StakeForm summary={summary} waiting={waiting} />}
                    Unstake={<UnstakeForm waiting={waiting} />}
                />
            </Flex>
        </Layout>
    );
};

export default Staking;
