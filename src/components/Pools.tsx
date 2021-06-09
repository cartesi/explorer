// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Link from 'next/link';
import useStakingPools, {
    POOLS_PER_PAGE,
} from '../graphql/hooks/useStakingPools';
import { StakingPool, Summary } from '../graphql/models';
import Address from '../components/Address';
import { formatCTSI } from '../utils/token';
import { ethers, FixedNumber } from 'ethers';
import { useStakingPoolCommission } from '../services/pool';
import labels from '../utils/labels';

interface PoolsProps {
    summary: Summary;
}

type Sort =
    | 'stakedBalance'
    | 'totalReward'
    | 'totalBlocks'
    | 'totalUsers'
    | 'commission';

const PoolRow = (props: { pool: StakingPool }) => {
    const { pool } = props;

    // calculate historical commission
    const totalReward = FixedNumber.from(pool.user.totalReward);
    const totalCommission = FixedNumber.from(pool.totalCommission);
    const commissionLabel = totalReward.isZero()
        ? ''
        : `${totalCommission
              .divUnsafe(totalReward)
              .mulUnsafe(FixedNumber.from(100))
              .toUnsafeFloat()
              .toFixed(2)} %`;

    // calculate commission for next block, by calling the fee contract
    const reward = ethers.utils.parseUnits('2900', 18); // XXX this value should come from the RewardManager
    const nextCommission = useStakingPoolCommission(pool.id, reward);
    const nextCommissionLabel = nextCommission.value
        ? `${(nextCommission.value * 100).toFixed(2)} %`
        : '';

    // commission help tooptip
    let commissionTooltip: string = undefined;
    if (pool.commission) {
        commissionTooltip = labels.flatRateCommission;
    } else if (pool.gas) {
        commissionTooltip = labels.gasTaxCommission;
    }

    return (
        <tr className="body-text-2" key={pool.id}>
            <td>
                <Address type="address" ens id={pool.id} />
            </td>
            <td>{pool.totalUsers}</td>
            <td>{formatCTSI(pool.user.stakedBalance, 2)} CTSI</td>
            <td>{formatCTSI(pool.user.totalReward, 2)} CTSI</td>
            <td>
                {commissionLabel} ({nextCommissionLabel}){' '}
                {commissionTooltip && (
                    <img
                        data-tip={commissionTooltip}
                        src="/images/question.png"
                    />
                )}
            </td>
            <td>
                <Link href={'/pools/' + pool.id}>Stake</Link>
            </td>
        </tr>
    );
};

const Pools = (props: PoolsProps) => {
    const [id, setId] = useState<string>(undefined);
    const [sort, setSort] = useState<Sort>('stakedBalance');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { summary } = props;
    const { data, loading } = useStakingPools(pageNumber, id);
    const totalPoolsPages = summary
        ? Math.ceil(summary.totalPools / POOLS_PER_PAGE)
        : 1;

    return (
        <div className="pools">
            <div className="pools-title mt-5 mb-2">
                <div className="pools-title-create body-text-1">
                    <Link href="/pools/manage/create">Create New Pool</Link>
                </div>
                <div className="input-with-icon input-group">
                    <span>
                        <i className="fas fa-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={id}
                        onChange={(e) => {
                            setId(e.target.value);
                            setPageNumber(0);
                        }}
                    />
                </div>
            </div>

            <div className="table-responsive mb-2">
                <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th className="table-header-text">Address</th>
                            <th
                                className="table-header-text pointer"
                                onClick={() => setSort('totalUsers')}
                            >
                                Total Users
                                {sort == 'totalBlocks' && (
                                    <i className="fas fa-arrow-down"></i>
                                )}
                            </th>
                            <th
                                className="table-header-text pointer"
                                onClick={() => setSort('stakedBalance')}
                            >
                                Total Staked{' '}
                                {sort == 'stakedBalance' && (
                                    <i className="fas fa-arrow-down"></i>
                                )}
                            </th>
                            <th
                                className="table-header-text pointer"
                                onClick={() => setSort('totalReward')}
                            >
                                Total Rewards{' '}
                                {sort == 'totalReward' && (
                                    <i className="fas fa-arrow-down"></i>
                                )}
                            </th>
                            <th
                                className="table-header-text pointer"
                                onClick={() => setSort('commission')}
                            >
                                Commission{' '}
                                {sort == 'commission' && (
                                    <i className="fas fa-arrow-down"></i>
                                )}
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading || !data?.stakingPools ? (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    <span
                                        className="spinner-border spinner-border-sm my-1"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                </td>
                            </tr>
                        ) : (
                            data.stakingPools.map((pool) => (
                                <PoolRow pool={pool} key={pool.id} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {!id && (
                <div className="pools-pagination body-text-2">
                    <button
                        className="btn"
                        type="button"
                        disabled={pageNumber <= 0}
                        onClick={() => setPageNumber(pageNumber - 1)}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    Page {pageNumber + 1} of {totalPoolsPages}
                    <button
                        className="btn"
                        type="button"
                        disabled={pageNumber + 1 >= totalPoolsPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pools;
