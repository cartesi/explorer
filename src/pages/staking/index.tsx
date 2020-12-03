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

import Layout from '../../components/Layout';
import Node from '../../components/Node';

import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import { BigNumber } from 'ethers';
import useUser from '../../graphql/hooks/useUser';
import ConfirmationIndicator from '../../components/ConfirmationIndicator';

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
        error: stakingError,
        transaction: stakingTransaction,
        clearStates: clearStakingStates,
        stake,
        unstake,
        withdraw,
    } = useStaking();

    const {
        balance,
        allowance,
        error: tokenError,
        transaction: tokenTransaction,
        clearStates: clearTokenStates,
        approve,
        formatCTSI,
        parseCTSI,
        toBigCTSI,
    } = useCartesiToken(account, staking?.address, blockNumber);

    const { user } = useUser(account);

    const [approveAmount, setApproveAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [editAllowance, setEditAllowance] = useState<boolean>(false);
    const [stakeAmount, setStakeAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [unstakeAmount, setUnstakeAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );

    const [stakeTab, setStakeTab] = useState<boolean>(true);
    const [maturingCountdown, setMaturingCountdown] = useState<number>();
    const [releasingCountdown, setReleasingCountdown] = useState<number>();

    const ongoingTransaction = tokenTransaction || stakingTransaction;
    const error = tokenError || stakingError;
    const waiting = !!ongoingTransaction;

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

    const showEditAllowance = () => {
        setEditAllowance(true);
        setApproveAmount(toBigCTSI(allowance));
    };

    const doApprove = () => {
        if (approveAmount.gt(0)) {
            setEditAllowance(false);

            if (!approveAmount.eq(toBigCTSI(allowance))) {
                approve(staking.address, parseCTSI(approveAmount));
                setApproveAmount(BigNumber.from(0));
            }
        }
    };

    const doStake = () => {
        if (stakeAmount.gt(0)) {
            stake(parseCTSI(stakeAmount));
            setStakeAmount(BigNumber.from(0));
        }
    };

    const doUnstake = () => {
        if (unstakeAmount.gt(0)) {
            unstake(parseCTSI(unstakeAmount));
            setUnstakeAmount(BigNumber.from(0));
        }
    };

    const doWithdraw = () => {
        withdraw(releasingBalance);
    };

    const validate = (value: string): number => {
        if (!value) return 0;
        value = value.split('.')[0];
        return parseInt(value);
    };

    const splitStakeAmount = () => {
        let fromReleasing = BigNumber.from(0),
            fromAllowance = BigNumber.from(0);
        let stakeAmountCTSI = parseCTSI(stakeAmount);

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
        let unstakeAmountCTSI = parseCTSI(unstakeAmount);

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

    const confirmationDone = () => {
        clearStakingStates();
        clearTokenStates();
    };

    const stakeSplit = splitStakeAmount();
    const unstakeSplit = splitUnstakeAmount();
    const totalBalance = balance
        .add(stakedBalance)
        .add(maturingBalance)
        .add(releasingBalance);

    if (typeof window !== 'undefined') {
        // ! Need to rethink if it's better to use this jquery stuff or separate component for tooltip such as react-tooltip
        const $ = require('jquery');
        $('[data-toggle="tooltip"]').tooltip();
    }

    return (
        <Layout className="staking">
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="page-header row align-items-center py-3">
                <div className="col col-12 col-lg-6 info-text-md text-white d-flex flex-row">
                    Staking
                    <ConfirmationIndicator
                        transaction={ongoingTransaction}
                        confirmationDone={confirmationDone}
                        error={error}
                    />
                </div>

                <div className="col col-12 col-sm-6 col-lg-3">
                    <div className="sub-title-2 white-text">
                        <img src="/images/wallet.png" />
                        &nbsp; Wallet Balance
                    </div>
                    <div className="info-text-md dark-white-text">
                        {`${account ? formatCTSI(balance) : 'N/A'}  `}
                        <span className="caption">CTSI</span>
                    </div>
                </div>

                <div className="col col-12 col-sm-6 col-lg-3">
                    <div className="sub-title-2 white-text">
                        <img src="/images/staked.png" />
                        &nbsp; Staked Balance
                    </div>
                    <div className="info-text-md dark-white-text">
                        {`${account ? formatCTSI(stakedBalance) : 'N/A'}`}
                        <span className="caption"> CTSI</span>
                    </div>
                </div>
            </div>

            <Node />

            <div className="d-flex staking-total-balances my-5">
                <div className="staking-total-balances-item">
                    <label className="body-text-1">Total Rewards</label>
                    <img
                        data-toggle="tooltip"
                        title="Total of CTSI rewards related to all blocks produced by this node"
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {user
                            ? formatCTSI(BigNumber.from(user.totalReward))
                            : 0}{' '}
                        <span className="small-text">CTSI</span>
                    </span>
                </div>

                <div className="staking-total-balances-item">
                    <label className="body-text-1">Total Balance</label>
                    <img
                        data-toggle="tooltip"
                        title="This is the sum of all maturing, staked, released/releasing balances"
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {formatCTSI(totalBalance)}{' '}
                        <span className="small-text">CTSI</span>
                    </span>
                </div>
            </div>

            <div className="row">
                <div className="col col-12 col-md-7 pr-3 staking-balances my-3">
                    <div className="staking-balances-item">
                        <div className="px-5 py-4 d-flex flex-row align-items-center justify-content-between">
                            <div className="d-flex flex-column align-items-start">
                                <div className="mb-1">
                                    <img src="/images/balance.png" />
                                    <span className="body-text-1 ml-3">
                                        Maturing
                                    </span>
                                </div>
                                {maturingBalance.gt(0) &&
                                    maturingCountdown > 0 && (
                                        <div className="staking-balances-item-timer">
                                            <span className="small-text">
                                                {displayTime(maturingCountdown)}
                                            </span>
                                        </div>
                                    )}
                            </div>

                            <span className="info-text-md">
                                {formatCTSI(maturingBalance)}{' '}
                                <span className="small-text">CTSI</span>
                            </span>
                        </div>

                        <div className="px-5 py-3 d-flex flex-row align-items-center justify-content-between gray-background">
                            <div className="d-flex flex-column align-items-start">
                                <div className="mb-1">
                                    <img src="/images/balance.png" />
                                    <span className="body-text-1 ml-3">
                                        Staked
                                    </span>
                                </div>
                            </div>

                            <span className="info-text-md">
                                {formatCTSI(stakedBalance)}{' '}
                                <span className="small-text">CTSI</span>
                            </span>
                        </div>
                    </div>

                    <div className="staking-balances-item mt-4">
                        <div className="px-5 py-4 d-flex flex-row align-items-center justify-content-between">
                            <div className="d-flex flex-column align-items-start">
                                <div className="mb-1">
                                    <img src="/images/releasing.png" />
                                    <span className="body-text-1 ml-3">
                                        {releasingBalance.gt(0) &&
                                        releasingCountdown === 0
                                            ? 'Released'
                                            : 'Releasing'}
                                    </span>
                                </div>
                                {releasingBalance.gt(0) &&
                                    releasingCountdown > 0 && (
                                        <div className="staking-balances-item-timer">
                                            <span className="small-text">
                                                {displayTime(
                                                    releasingCountdown
                                                )}
                                            </span>
                                        </div>
                                    )}
                                {releasingBalance.gt(0) &&
                                    releasingCountdown === 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-dark py-0 px-4 button-text mt-2"
                                            disabled={waiting}
                                            onClick={doWithdraw}
                                        >
                                            Withdraw
                                        </button>
                                    )}
                            </div>

                            <span className="info-text-md">
                                {formatCTSI(releasingBalance)}{' '}
                                <span className="small-text">CTSI</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col col-12 col-md-5 pl-3 staking-ops my-3">
                    <div className="d-flex flex-row">
                        <div
                            className={`staking-ops-tab body-text-1 
                                ${stakeTab ? 'active' : ''}`}
                            onClick={() => setStakeTab(true)}
                        >
                            Stake
                        </div>
                        <div
                            className={`staking-ops-tab body-text-1 
                                ${!stakeTab ? 'active' : ''}`}
                            onClick={() => setStakeTab(false)}
                        >
                            Unstake
                        </div>
                    </div>

                    <div className="staking-ops-content">
                        {stakeTab && (
                            <>
                                <div className="body-text-1">
                                    Allowance{' '}
                                    {!editAllowance && (
                                        <a onClick={showEditAllowance}>
                                            <img src="/images/pen.png" />
                                        </a>
                                    )}
                                </div>

                                {editAllowance ? (
                                    <div className="d-flex flex-column mt-2">
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="addon-inline form-control"
                                                id="approveAmount"
                                                value={approveAmount.toString()}
                                                disabled={waiting}
                                                onChange={(e) =>
                                                    setApproveAmount(
                                                        BigNumber.from(
                                                            validate(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                }
                                            />
                                            <span className="input-group-addon addon-inline input-source-observer small-text">
                                                CTSI
                                            </span>
                                        </div>

                                        <div className="d-flex flex-row align-items-center justify-content-between my-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-dark py-2 button-text flex-fill mr-2"
                                                onClick={() =>
                                                    setEditAllowance(false)
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-dark py-2 button-text flex-fill"
                                                disabled={waiting}
                                                onClick={doApprove}
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="info-text-md">
                                        {formatCTSI(allowance)}{' '}
                                        <span className="small-text">CTSI</span>
                                    </span>
                                )}

                                <div className="form-group mt-3">
                                    <label className="body-text-2 text-secondary">
                                        Amount to stake
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className={`addon-inline form-control ${
                                                stakeSplit ? '' : 'error'
                                            }`}
                                            id="stakeAmount"
                                            value={stakeAmount.toString()}
                                            disabled={editAllowance || waiting}
                                            onChange={(e) =>
                                                setStakeAmount(
                                                    BigNumber.from(
                                                        validate(e.target.value)
                                                    )
                                                )
                                            }
                                        />
                                        <span
                                            className={`input-group-addon addon-inline input-source-observer small-text ${
                                                stakeSplit ? '' : 'error'
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
                                                    <span>
                                                        From "releasing"
                                                    </span>
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
                                            Maximum staking limit exceeded!
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    disabled={editAllowance || waiting}
                                    className="btn btn-dark py-2 button-text flex-fill"
                                    onClick={doStake}
                                >
                                    Stake
                                </button>

                                <div className="small-text text-center mt-4 danger-text">
                                    The maturing status will restart counting.
                                </div>
                            </>
                        )}

                        {!stakeTab && (
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
                                            value={unstakeAmount.toString()}
                                            disabled={waiting}
                                            onChange={(e) =>
                                                setUnstakeAmount(
                                                    BigNumber.from(
                                                        validate(e.target.value)
                                                    )
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
                                        <div>
                                            Maximum unstaking limit exceeded!
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-dark py-2 button-text flex-fill"
                                    disabled={waiting}
                                    onClick={doUnstake}
                                >
                                    Unstake
                                </button>

                                <div className="small-text text-center mt-4 danger-text">
                                    The releasing status will restart counting.
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Staking;
