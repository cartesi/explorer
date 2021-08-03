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
import { BigNumber, constants } from 'ethers';
import ReactTooltip from 'react-tooltip';
import { Flex, Box, Text, Button } from '@chakra-ui/react';

import Layout from '../../components/Layout';
import Node from '../../components/Node';

import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';

import useUser from '../../graphql/hooks/useUser';
import useSummary from '../../graphql/hooks/useSummary';

import StakingDisclaimer from '../../components/StakingDisclaimer';
import { formatCTSI, isInfinite } from '../../utils/token';
import { TokenAmount } from '../../components/TokenAmount';
import Balances from '../../components/staking/Balances';
import StakingTabs from '../../components/staking/Tabs';
import StakingCard from '../../components/staking/Card';
import TotalBalances from '../../components/staking/TotalBalances';
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
        stake,
        unstake,
        withdraw,
    } = useStaking(account);

    const summary = useSummary();

    const {
        balance,
        allowance,
        transaction: tokenTransaction,
        approve,
        parseCTSI,
        toBigCTSI,
        toCTSI,
    } = useCartesiToken(account, staking?.address, blockNumber);

    const user = useUser(account);

    const [readDisclaimer, setReadDisclaimer] = useState<boolean>(true);

    const [stakeAmount, setStakeAmount] = useState<number>(0);
    const [infiniteApproval, setInfiniteApproval] = useState<boolean>(false);
    const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

    const [maturingCountdown, setMaturingCountdown] = useState<number>();
    const [releasingCountdown, setReleasingCountdown] = useState<number>();

    const [nodeWaiting, setNodeWaiting] = useState<boolean>(false);
    const [nodeError, setNodeError] = useState<string>();

    const waiting =
        stakingTransaction.submitting ||
        tokenTransaction.submitting ||
        nodeWaiting;

    const error =
        tokenTransaction.error || stakingTransaction.error || nodeError;

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

    const doApprove = () => {
        if (stakeAmount > 0) {
            if (infiniteApproval) {
                approve(staking.address, constants.MaxUint256);
            } else if (stakeAmount != toCTSI(allowance)) {
                approve(staking.address, parseCTSI(stakeAmount));
            }
        }
    };

    const doApproveOrStake = () => {
        if (!stakeSplit) {
            doApprove();
        } else if (stakeAmount > 0) {
            stake(parseCTSI(stakeAmount));
            setStakeAmount(0);
        }
    };

    const doUnstake = () => {
        if (unstakeAmount > 0) {
            unstake(parseCTSI(unstakeAmount));
            setUnstakeAmount(0);
        }
    };

    const doWithdraw = () => {
        withdraw(releasingBalance);
    };

    const acceptDisclaimer = () => {
        setReadDisclaimer(true);
        localStorage.setItem('readDisclaimer', 'true');
    };

    const splitStakeAmount = () => {
        let fromReleasing = BigNumber.from(0),
            fromAllowance = BigNumber.from(0);
        const stakeAmountCTSI = parseCTSI(stakeAmount);

        if (releasingBalance.add(allowance).lt(stakeAmountCTSI)) {
            return null;
        }

        if (releasingBalance.eq(0)) {
            fromAllowance = stakeAmountCTSI;
        } else {
            if (releasingBalance.gt(stakeAmountCTSI)) {
                fromReleasing = stakeAmountCTSI;
            } else {
                fromReleasing = releasingBalance;
                fromAllowance = stakeAmountCTSI.sub(releasingBalance);
            }
        }

        return {
            releasing: fromReleasing,
            wallet: fromAllowance,
        };
    };

    const splitUnstakeAmount = () => {
        let fromMaturing = BigNumber.from(0),
            fromStaked = BigNumber.from(0);
        const unstakeAmountCTSI = parseCTSI(unstakeAmount);

        if (maturingBalance.add(stakedBalance).lt(unstakeAmountCTSI)) {
            return null;
        }

        if (maturingBalance.eq(0)) {
            fromStaked = unstakeAmountCTSI;
        } else {
            if (maturingBalance.gt(unstakeAmountCTSI)) {
                fromMaturing = unstakeAmountCTSI;
            } else {
                fromMaturing = maturingBalance;
                fromStaked = unstakeAmountCTSI.sub(maturingBalance);
            }
        }

        return {
            maturing: fromMaturing,
            staked: fromStaked,
        };
    };

    const stakeSplit = splitStakeAmount();
    const unstakeSplit = splitUnstakeAmount();
    const totalBalance = stakedBalance
        .add(maturingBalance)
        .add(releasingBalance);
    const totalStaked =
        summary && summary.totalStaked ? toBigCTSI(summary.totalStaked) : 0;

    return (
        <Layout>
            <Head>
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!readDisclaimer && (
                <div className="staking-disclaimer-container">
                    <StakingDisclaimer key="readDisclaimer" />

                    <div className="w-100 d-flex flex-row align-center justify-content-end mt-2">
                        <button
                            type="button"
                            className="btn btn-dark button-text"
                            onClick={acceptDisclaimer}
                        >
                            Accept and continue
                        </button>
                    </div>
                </div>
            )}

            <Balances
                waiting={waiting}
                error={error}
                balance={balance}
                stakedBalance={stakedBalance}
            />

            <Node setWaiting={setNodeWaiting} setError={setNodeError} />

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
                    Stake={
                        <>
                            <div className="body-text-1">Allowance</div>
                            <TokenAmount amount={allowance} />

                            <div className="form-group mt-3">
                                <label className="body-text-2 text-secondary">
                                    Amount to stake
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className={`addon-inline form-control ${
                                            isInfinite(stakeAmount)
                                                ? 'error'
                                                : ''
                                        }`}
                                        id="stakeAmount"
                                        value={stakeAmount}
                                        disabled={!account || waiting}
                                        onChange={(e) =>
                                            setStakeAmount(
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : 0
                                            )
                                        }
                                    />
                                    <span
                                        className={`input-group-addon addon-inline input-source-observer small-text ${
                                            isInfinite(stakeAmount)
                                                ? 'error'
                                                : ''
                                        }`}
                                    >
                                        CTSI
                                    </span>
                                </div>
                            </div>

                            <div className="mt-2 mb-4 mx-2 px-2 border-left border-dark body-text-1">
                                {stakeSplit ? (
                                    <>
                                        {stakeSplit.releasing.gt(0) && (
                                            <div className="d-flex flex-row align-items-center justify-content-between">
                                                <span>
                                                    {formatCTSI(
                                                        stakeSplit.releasing
                                                    )}{' '}
                                                    <span className="small-text">
                                                        CTSI
                                                    </span>
                                                </span>
                                                <span>From "releasing"</span>
                                            </div>
                                        )}
                                        {stakeSplit.wallet.gt(0) && (
                                            <div className="d-flex flex-row align-items-center justify-content-between">
                                                <span>
                                                    {formatCTSI(
                                                        stakeSplit.wallet
                                                    )}{' '}
                                                    <span className="small-text">
                                                        CTSI
                                                    </span>
                                                </span>
                                                <span>From "wallet"</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div>
                                        Maximum staking limit exceeded! Please
                                        approve more allowance to stake.
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={
                                    isInfinite(stakeAmount) ||
                                    !account ||
                                    waiting ||
                                    !!stakeSplit
                                }
                                className="btn btn-dark py-2 button-text flex-fill"
                                onClick={doApproveOrStake}
                            >
                                Approve
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isInfinite(stakeAmount) ||
                                    !account ||
                                    waiting ||
                                    !stakeSplit
                                }
                                className="btn btn-dark py-2 mt-2 button-text flex-fill"
                                onClick={doApproveOrStake}
                            >
                                Stake
                            </button>

                            {stakeSplit ? (
                                <>
                                    <div className="small-text text-center mt-4 danger-text">
                                        The maturing status will restart
                                        counting.
                                    </div>
                                    <br />
                                    {stakeAmount > 0 && (
                                        <div className="body-text-1">
                                            <i className="fas fa-info-circle"></i>{' '}
                                            This stake currently corresponds to
                                            a{' '}
                                            {totalStaked
                                                ? (
                                                      (stakeAmount * 100) /
                                                      totalStaked.toNumber()
                                                  ).toFixed(2)
                                                : 0}
                                            % chance of producing the current
                                            block (
                                            <a
                                                href="https://github.com/cartesi/noether/wiki/FAQ#whats-the-minimum-amount-of-ctsi-to-stake"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Learn more
                                            </a>
                                            )
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center mt-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={infiniteApproval}
                                        onChange={(e) =>
                                            setInfiniteApproval(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Infinite Approval
                                </div>
                            )}
                        </>
                    }
                    Unstake={
                        <>
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Amount to unstake
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className={`addon-inline form-control ${
                                            unstakeSplit ? '' : 'error'
                                        }`}
                                        id="unstakeAmount"
                                        value={unstakeAmount}
                                        disabled={!account || waiting}
                                        onChange={(e) =>
                                            setUnstakeAmount(
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : 0
                                            )
                                        }
                                    />
                                    <span
                                        className={`input-group-addon addon-inline input-source-observer small-text ${
                                            unstakeSplit ? '' : 'error'
                                        }`}
                                    >
                                        CTSI
                                    </span>
                                </div>
                            </div>

                            <div className="mt-2 mb-4 mx-2 px-2 border-left border-dark body-text-1">
                                {unstakeSplit ? (
                                    <>
                                        {unstakeSplit.maturing.gt(0) && (
                                            <div className="d-flex flex-row align-items-center justify-content-between">
                                                <span>
                                                    {formatCTSI(
                                                        unstakeSplit.maturing
                                                    )}{' '}
                                                    <span className="small-text">
                                                        CTSI
                                                    </span>
                                                </span>
                                                <span>From "maturing"</span>
                                            </div>
                                        )}
                                        {unstakeSplit.staked.gt(0) && (
                                            <div className="d-flex flex-row align-items-center justify-content-between">
                                                <span>
                                                    {formatCTSI(
                                                        unstakeSplit.staked
                                                    )}{' '}
                                                    <span className="small-text">
                                                        CTSI
                                                    </span>
                                                </span>
                                                <span>From "staked"</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div>Maximum unstaking limit exceeded!</div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="btn btn-dark py-2 button-text flex-fill"
                                disabled={!account || waiting}
                                onClick={doUnstake}
                            >
                                Unstake
                            </button>

                            <div className="small-text text-center mt-4 danger-text">
                                The releasing status will restart counting.
                            </div>
                        </>
                    }
                />
            </Flex>

            <div className="row">
                <div className="col col-12 col-md-7 pr-3 staking-balances my-3"></div>
            </div>

            <ReactTooltip />
        </Layout>
    );
};

export default Staking;
