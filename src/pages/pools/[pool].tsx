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
import { BigNumberInput } from 'big-number-input';
import ReactTooltip from 'react-tooltip';

import Layout from '../../components/Layout';
import ConfirmationIndicator from '../../components/ConfirmationIndicator';

import { useBlockNumber } from '../../services/eth';
import { useStakingPool, useStakingPoolCommission } from '../../services/pool';
import { useCartesiToken } from '../../services/token';

import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import labels from '../../utils/labels';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import { formatCTSI } from '../../utils/token';
import { useENS } from '../../services/ens';
import { tinyString } from '../../utils/stringUtils';
import { StakingPool } from '../../graphql/models';
import Link from 'next/link';
import { TokenAmount } from '../../components/TokenAmount';

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
    const { account } = useWeb3React<Web3Provider>();

    const blockNumber = useBlockNumber();
    const {
        pool,
        amount,
        stakedBalance,
        effectiveStake,
        paused,
        releasedBalance,
        withdrawBalance,
        unstakeTimestamp,
        error: stakingError,
        waiting: stakingWaiting,
        stake,
        unstake,
        withdraw,
    } = useStakingPool(router.query.pool as string);

    const {
        balance,
        allowance,
        error: tokenError,
        waiting: tokenWaiting,
        approve,
    } = useCartesiToken(account, pool?.address, blockNumber);

    const stakingPool = useStakingPoolQuery(router.query.pool as string);

    // resolve address to name (if possible)
    const ensEntry = useENS(router.query.pool as string);

    const [readDisclaimer, setReadDisclaimer] = useState<boolean>(true);

    const [stakeAmount, setStakeAmount] = useState<BigNumber>(constants.Zero);
    const [infiniteApproval, setInfiniteApproval] = useState<boolean>(false);
    const [unstakeAmount, setUnstakeAmount] = useState<BigNumber>(
        constants.Zero
    );

    const [stakeTab, setStakeTab] = useState<boolean>(true);
    const waiting = stakingWaiting || tokenWaiting;
    const error = tokenError || stakingError;

    useEffect(() => {
        const readDisclaimer = localStorage.getItem('readDisclaimer');
        if (!readDisclaimer || readDisclaimer == 'false')
            setReadDisclaimer(false);
    }, []);

    const doApprove = () => {
        if (infiniteApproval) {
            approve(pool.address, constants.MaxUint256);
        } else if (stakeAmount && stakeAmount.gt(0)) {
            approve(pool.address, stakeAmount);
        }
    };

    const doStake = () => {
        if (stakeAmount && stakeAmount.gt(0)) {
            stake(stakeAmount);
            setStakeAmount(constants.Zero);
        }
    };

    const doUnstake = () => {
        if (unstakeAmount && unstakeAmount.gt(0)) {
            unstake(unstakeAmount);
            setUnstakeAmount(constants.Zero);
        }
    };

    const acceptDisclaimer = () => {
        setReadDisclaimer(true);
        localStorage.setItem('readDisclaimer', 'true');
    };

    const now = new Date();
    const stakeLocked =
        stakedBalance.gt(0) &&
        unstakeTimestamp &&
        unstakeTimestamp.getTime() > now.getTime();

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
                            <Link href={`/pools/${router.query.pool}/edit`}>
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
                    <label className="body-text-1">Total Staked</label>
                    <img
                        data-tip={labels.totalStakedPool}
                        src="/images/question.png"
                    />
                    <TokenAmount amount={amount} />
                </div>

                <div className="staking-total-balances-item">
                    <label className="body-text-1">Effective Stake</label>
                    <img
                        data-tip={labels.effectiveStake}
                        src="/images/question.png"
                    />
                    <TokenAmount amount={effectiveStake} />
                </div>
            </div>

            <div className="d-flex staking-total-balances my-5">
                <div className="staking-total-balances-item">
                    <label className="body-text-1">Total Rewards</label>
                    <img
                        data-tip={labels.totalRewardsPool}
                        src="/images/question.png"
                    />
                    <TokenAmount
                        amount={BigNumber.from(
                            stakingPool ? stakingPool.user.totalReward : 0
                        )}
                    />
                </div>
                {stakingPool && <PoolCommission pool={stakingPool} />}
            </div>

            <div className="row">
                <div className="col col-12 col-md-7 pr-3 staking-balances my-3">
                    <div className="staking-balances-item">
                        <div className="px-5 py-4 d-flex flex-row align-items-center justify-content-between gray-background">
                            <div className="d-flex flex-column align-items-start">
                                <div className="mb-1">
                                    <img src="/images/balance.png" />
                                    <span className="body-text-1 ml-3">
                                        Staked
                                    </span>
                                </div>
                            </div>

                            <TokenAmount
                                amount={stakedBalance}
                                locked={stakeLocked}
                            />
                        </div>
                    </div>

                    <div className="staking-balances-item mt-4">
                        <div className="px-5 py-4 d-flex flex-row align-items-center justify-content-between">
                            <div className="d-flex flex-column align-items-start">
                                <div className="mb-1">
                                    <img src="/images/releasing.png" />
                                    <span className="body-text-1 ml-3">
                                        {releasedBalance.gt(0) &&
                                        withdrawBalance.gt(0)
                                            ? 'Released'
                                            : 'Releasing'}
                                    </span>
                                </div>
                            </div>

                            {releasedBalance.gt(0) && (
                                <button
                                    type="button"
                                    className="btn btn-dark py-2 button-text"
                                    disabled={
                                        !account ||
                                        waiting ||
                                        withdrawBalance.eq(0)
                                    }
                                    onClick={withdraw}
                                >
                                    Withdraw
                                </button>
                            )}
                            <TokenAmount amount={releasedBalance} />
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
                            Unstake{' '}
                            {stakeLocked && (
                                <i
                                    className="fa fa-lock"
                                    aria-hidden="true"
                                ></i>
                            )}
                        </div>
                    </div>

                    <div className="staking-ops-content">
                        {stakeTab && (
                            <>
                                <div className="body-text-1">Allowance</div>
                                <TokenAmount amount={allowance} />

                                <div className="form-group mt-3">
                                    <label className="body-text-2 text-secondary">
                                        Amount to stake
                                    </label>
                                    <div className="input-group">
                                        <BigNumberInput
                                            renderInput={(props) => (
                                                <input
                                                    id="stakeAmount"
                                                    className={`addon-inline form-control`}
                                                    {...props}
                                                />
                                            )}
                                            autofocus={true}
                                            decimals={18}
                                            placeholder={'0'}
                                            min={'0'}
                                            onChange={(newValue) =>
                                                newValue
                                                    ? setStakeAmount(
                                                          BigNumber.from(
                                                              newValue
                                                          )
                                                      )
                                                    : undefined
                                            }
                                            value={
                                                stakeAmount
                                                    ? stakeAmount.toString()
                                                    : ''
                                            }
                                        />
                                        <span
                                            className={`input-group-addon addon-inline input-source-observer small-text`}
                                        >
                                            CTSI
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        (stakeAmount.lte(allowance) ||
                                            !account ||
                                            waiting) &&
                                        !infiniteApproval
                                    }
                                    className="btn btn-dark py-2 button-text flex-fill"
                                    onClick={doApprove}
                                >
                                    Approve
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        paused.valueOf() ||
                                        stakeAmount.gt(allowance) ||
                                        !account ||
                                        waiting
                                    }
                                    className="btn btn-dark py-2 mt-2 button-text flex-fill"
                                    onClick={doStake}
                                >
                                    Stake{' '}
                                    {paused && (
                                        <i
                                            className="fa fa-lock"
                                            aria-hidden="true"
                                        ></i>
                                    )}
                                </button>

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
                            </>
                        )}

                        {!stakeTab && (
                            <>
                                <div className="form-group">
                                    <label className="body-text-2 text-secondary">
                                        Amount to unstake
                                    </label>
                                    <div className="input-group">
                                        <BigNumberInput
                                            renderInput={(props) => (
                                                <input
                                                    id="unstakeAmount"
                                                    className={`addon-inline form-control`}
                                                    {...props}
                                                />
                                            )}
                                            autofocus={true}
                                            decimals={18}
                                            placeholder={'0'}
                                            min={'0'}
                                            onChange={(newValue) =>
                                                newValue
                                                    ? setUnstakeAmount(
                                                          BigNumber.from(
                                                              newValue
                                                          )
                                                      )
                                                    : undefined
                                            }
                                            value={
                                                unstakeAmount
                                                    ? unstakeAmount.toString()
                                                    : ''
                                            }
                                        />
                                        <span
                                            className={`input-group-addon addon-inline input-source-observer small-text`}
                                        >
                                            CTSI
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2 mb-4 mx-2 px-2 border-left border-dark body-text-1">
                                    <div>Maximum unstaking limit exceeded!</div>
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
