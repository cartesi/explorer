// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState } from 'react';
import useStakingPools, {
    POOLS_PER_PAGE,
} from '../graphql/hooks/useStakingPools';
import { Summary } from '../graphql/models';
import { tinyString } from '../utils/stringUtils';
import Address from '../components/Address';
import { formatCTSI } from '../utils/token';

interface PoolsProps {
    summary: Summary;
}

type Sort =
    | 'stakedBalance'
    | 'totalReward'
    | 'totalBlocks'
    | 'totalUsers'
    | 'uptime';

const Pools = (props: PoolsProps) => {
    const [id, setId] = useState<string>(undefined);
    const [sort, setSort] = useState<Sort>('stakedBalance');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { summary } = props;
    const { data, loading } = useStakingPools(pageNumber, id, sort);
    const totalPoolsPages = summary
        ? Math.ceil(summary.totalPools / POOLS_PER_PAGE)
        : 1;

    return (
        <div className="pools">
            <div className="pools-title">
                <h5 className="pools-sub-title">Staking Pools</h5>

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
                            <th className="table-header-text">User</th>
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
                        </tr>
                    </thead>

                    <tbody>
                        {loading || !data?.pools ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <span
                                        className="spinner-border spinner-border-sm my-1"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                </td>
                            </tr>
                        ) : (
                            data.pools.map((pool) => {
                                return (
                                    <tr key={pool.id} className="body-text-2">
                                        <td>
                                            <Address
                                                type="address"
                                                id={pool.id}
                                            />
                                        </td>
                                        <td>{pool.totalUsers}</td>
                                        <td>
                                            {formatCTSI(
                                                pool.user.stakedBalance,
                                                2
                                            )}{' '}
                                            CTSI
                                        </td>
                                        <td>
                                            {formatCTSI(
                                                pool.user.totalReward,
                                                2
                                            )}{' '}
                                            CTSI
                                        </td>
                                    </tr>
                                );
                            })
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
