// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, constants, ethers, FixedNumber } from 'ethers';
import ReactTooltip from 'react-tooltip';

import Layout from '../../components/Layout';
import ConfirmationIndicator from '../../components/ConfirmationIndicator';

import { useBlockNumber } from '../../services/eth';
import { useStakingPool, useStakingPoolCommission } from '../../services/pool';
import { useCartesiToken } from '../../services/token';

import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import labels from '../../utils/labels';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import { formatCTSI, isInfinite } from '../../utils/token';
import { useENS } from '../../services/ens';
import { tinyString } from '../../utils/stringUtils';
import { StakingPool } from '../../graphql/models';
import Link from 'next/link';

const PoolCommission = (props: { pool: StakingPool }) => {
    const { pool } = props;

    // commission simulation
    const reward = ethers.utils.parseUnits('2900', 18);
    const nextCommission = useStakingPoolCommission(pool.id, reward);

    // calculate historical commission
    const totalReward = FixedNumber.from(pool.user.totalReward);
    const totalCommission = FixedNumber.from(pool.totalCommission);
    const accuredCommissionLabel = totalReward.isZero()
        ? ''
        : `${totalCommission
              .divUnsafe(totalReward)
              .mulUnsafe(FixedNumber.from(100))
              .toUnsafeFloat()
              .toFixed(2)} %`;

    // commission label
    let commissionLabel = '';
    if (pool.fee.commission) {
        commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;
    } else if (pool.fee.gas) {
        commissionLabel = `${pool.fee.gas} Gas`;
    }

    // calculate commission for next block, by calling the fee contract
    const nextCommissionLabel = nextCommission.value
        ? `(${(nextCommission.value * 100).toFixed(2)} %)`
        : '';

    // commission help tooptip
    let commissionTooltip: string = undefined;
    if (pool.fee.commission) {
        commissionTooltip = labels.flatRateCommission;
    } else if (pool.fee.gas) {
        commissionTooltip = labels.gasTaxCommission;
    }

    return (
        <div className="staking-total-balances-item">
            <label className="body-text-1">Commission</label>
            {commissionTooltip && (
                <img data-tip={commissionTooltip} src="/images/question.png" />
            )}
            <span className="info-text-md">
                {accuredCommissionLabel} ({commissionLabel}){' '}
            </span>
        </div>
    );
};

const Pool = () => {
    const router = useRouter();
    const { pool } = router.query;

    const { account } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const {
        staking,
        stakedBalance,
        paused,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        error: stakingError,
        waiting: stakingWaiting,
        stake,
        unstake,
        withdraw,
    } = useStakingPool(pool as string);

    const {
        balance,
        allowance,
        error: tokenError,
        waiting: tokenWaiting,
        approve,
        parseCTSI,
        toCTSI,
    } = useCartesiToken(account, staking?.address, blockNumber);

    const stakingPool = useStakingPoolQuery(pool as string);

    // resolve address to name (if possible)
    const ensEntry = useENS(pool as string);

    const [readDisclaimer, setReadDisclaimer] = useState<boolean>(true);

    const [stakeAmount, setStakeAmount] = useState<number>(0);
    const [infiniteApproval, setInfiniteApproval] = useState<boolean>(false);
    const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

    const [stakeTab, setStakeTab] = useState<boolean>(true);
    const [maturingCountdown, setMaturingCountdown] = useState<number>();
    const [releasingCountdown, setReleasingCountdown] = useState<number>();

    const waiting = stakingWaiting || tokenWaiting;

    const error = tokenError || stakingError;

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

    return (
        <Layout className="staking">
            <Head>
                <title>Cartesi - Pool</title>
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
                    Staking Pool:{' '}
                    {ensEntry.name || tinyString(ensEntry.address)}
                    {stakingPool &&
                        account &&
                        stakingPool.manager == account.toLowerCase() && (
                            <Link href={`/pools/${pool}/edit`}>
                                <button
                                    type="button"
                                    className="btn btn-dark button-text py-0 mx-2"
                                >
                                    Edit
                                </button>
                            </Link>
                        )}
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

            <div className="d-flex staking-total-balances my-5">
                <div className="staking-total-balances-item">
                    <label className="body-text-1">Total Rewards</label>
                    <img
                        data-tip={labels.totalRewardsPool}
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {stakingPool && stakingPool.user
                            ? formatCTSI(
                                  BigNumber.from(stakingPool.user.totalReward),
                                  2
                              )
                            : 0}{' '}
                        <span className="small-text">CTSI</span>
                    </span>
                </div>

                <div className="staking-total-balances-item">
                    <label className="body-text-1">In-contract Balance</label>
                    <img
                        data-tip={labels.inContractBalancePool}
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {formatCTSI(totalBalance, 2)}{' '}
                        <span className="small-text">CTSI</span>
                    </span>
                </div>
            </div>

            <div className="d-flex staking-total-balances my-5">
                <div className="staking-total-balances-item">
                    <label className="body-text-1">Total Staked</label>
                    <img
                        data-tip={labels.totalStakedPool}
                        src="/images/question.png"
                    />
                    <span className="info-text-md">
                        {formatCTSI(
                            stakingPool && stakingPool.user
                                ? stakingPool.user.stakedBalance
                                : 0,
                            2
                        )}{' '}
                        <span className="small-text">CTSI</span>
                    </span>
                </div>

                {stakingPool && <PoolCommission pool={stakingPool} />}
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
                            Stake{' '}
                            {paused && (
                                <i
                                    className="fa fa-lock"
                                    aria-hidden="true"
                                ></i>
                            )}
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
                                            value={stakeAmount}
                                            disabled={!account || waiting}
                                            onChange={(e) =>
                                                setStakeAmount(
                                                    parseFloat(e.target.value)
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
                                        paused.valueOf() ||
                                        isInfinite(stakeAmount) ||
                                        !account ||
                                        waiting ||
                                        !stakeSplit
                                    }
                                    className="btn btn-dark py-2 mt-2 button-text flex-fill"
                                    onClick={doApproveOrStake}
                                >
                                    Stake{' '}
                                    {paused && (
                                        <i
                                            className="fa fa-lock"
                                            aria-hidden="true"
                                        ></i>
                                    )}
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
                                            a X% chance of producing the current
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
                                            value={unstakeAmount}
                                            disabled={!account || waiting}
                                            onChange={(e) =>
                                                setUnstakeAmount(
                                                    parseFloat(e.target.value)
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

export default Pool;
