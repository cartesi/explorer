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

import Layout from '../../components/Layout';
import Node from '../../components/Node';
import ConfirmationIndicator from '../../components/ConfirmationIndicator';

import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';

import useUser from '../../graphql/hooks/useUser';
import useSummary from '../../graphql/hooks/useSummary';

import labels from '../../utils/labels';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import { formatCTSI, isInfinite } from '../../utils/token';

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
        waiting: stakingWaiting,
        stake,
        unstake,
        withdraw,
    } = useStaking();

    const summary = useSummary();

    const {
        balance,
        allowance,
        error: tokenError,
        waiting: tokenWaiting,
        approve,
        parseCTSI,
        toBigCTSI,
    } = useCartesiToken(account, staking?.address, blockNumber);

    const user = useUser(account);

    const [readDisclaimer, setReadDisclaimer] = useState<boolean>(true);

    const [stakeAmount, setStakeAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [infiniteApproval, setInfiniteApproval] = useState<boolean>(false);
    const [unstakeAmount, setUnstakeAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );

    const [stakeTab, setStakeTab] = useState<boolean>(true);
    const [maturingCountdown, setMaturingCountdown] = useState<number>();
    const [releasingCountdown, setReleasingCountdown] = useState<number>();

    const [nodeWaiting, setNodeWaiting] = useState<boolean>(false);
    const [nodeError, setNodeError] = useState<string>();

    const waiting = stakingWaiting || tokenWaiting || nodeWaiting;

    const error = tokenError || stakingError || nodeError;

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
        if (stakeAmount.gt(0)) {
            if (infiniteApproval) {
                approve(staking.address, constants.MaxUint256);
            } else if (!stakeAmount.eq(toBigCTSI(allowance))) {
                approve(staking.address, parseCTSI(stakeAmount));
            }
        }
    };

    const doApproveOrStake = () => {
        if (!stakeSplit) {
            doApprove();
        } else if (stakeAmount.gt(0)) {
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

    const validate = (value: string): string => {
        if (!value) return '0';
        value = value.split('.')[0];
        return value;
    };

    const acceptDisclaimer = () => {
        setReadDisclaimer(true);
        localStorage.setItem('readDisclaimer', 'true');
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

    const stakeSplit = splitStakeAmount();
    const unstakeSplit = splitUnstakeAmount();
    const totalBalance = stakedBalance
        .add(maturingBalance)
        .add(releasingBalance);
    const totalStaked =
        summary && summary.totalStaked ? toBigCTSI(summary.totalStaked) : 0;

    return (
        <Layout className="staking">
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {!readDisclaimer && (
                <div className="staking-disclaimer-container">
                    <StakingDisclaimer />

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

            <div className="page-header row align-items-center py-3">
                <div className="col col-12 col-lg-6 info-text-md text-white d-flex flex-row">
                    Staking
                    <ConfirmationIndicator loading={waiting} error={error} />
                </div>

                <div className="col col-12 col-sm-6 col-lg-3">
                    <div className="sub-title-2 white-text">
                        <img src="/images/wallet.png" />
                        &nbsp; Wallet Balance
                    </div>
                    <div className="info-text-md dark-white-text">
                        {`${account ? formatCTSI(balance, 2) : 'N/A'}  `}
                        <span className="caption">CTSI</span>
                    </div>
                </div>

                <div className="col col-12 col-sm-6 col-lg-3">
                    <div className="sub-title-2 white-text">
                        <img src="/images/staked.png" />
                        &nbsp; Staked Balance
                    </div>
                    <div className="info-text-md dark-white-text">
                        {`${account ? formatCTSI(stakedBalance, 2) : 'N/A'}`}
                        <span className="caption"> CTSI</span>
                    </div>
                </div>
            </div>

            <Node setWaiting={setNodeWaiting} setError={setNodeError} />

            <div className="d-flex staking-total-balances my-5">
                <div className="staking-total-balances-item">
                    <label className="body-text-1">Total Rewards</label>
                    <img
                        data-tip={labels.totalRewards}
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {user
                            ? formatCTSI(BigNumber.from(user.totalReward), 2)
                            : 0}{' '}
                        <span className="small-text">CTSI</span>
                    </span>
                </div>

                <div className="staking-total-balances-item">
                    <label className="body-text-1">In-contract Balance</label>
                    <img
                        data-tip={labels.inContractBalance}
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {formatCTSI(totalBalance, 2)}{' '}
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

                        <div className="px-5 py-4 d-flex flex-row align-items-center justify-content-between gray-background">
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
                                            disabled={!account || waiting}
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
                                <div className="body-text-1">Allowance</div>

                                <span className="info-text-md">
                                    {formatCTSI(allowance)}{' '}
                                    <span className="small-text">CTSI</span>
                                </span>

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
                                            value={stakeAmount.toString()}
                                            disabled={!account || waiting}
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
                                            Please approve more allowance to
                                            stake.
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
                                        <div className="body-text-1">
                                            <i className="fas fa-info-circle"></i>{' '}
                                            This stake currently corresponds to
                                            a{' '}
                                            {totalStaked
                                                ? (
                                                      (stakeAmount.toNumber() *
                                                          100) /
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
                                            disabled={!account || waiting}
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
                                    disabled={!account || waiting}
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
            <ReactTooltip />
        </Layout>
    );
};

export default Staking;
