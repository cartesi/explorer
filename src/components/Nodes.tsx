// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState } from 'react';
import useNodes, { NODES_PER_PAGE } from '../graphql/hooks/useNodes';
import { Summary } from '../graphql/models';
import { truncateString } from '../utils/stringUtils';
import Address from './Address';
import { formatCTSI } from '../utils/token';

interface NodesProps {
    summary: Summary;
}

type Sort = 'timestamp' | 'totalReward' | 'totalBlocks';

const Nodes = (props: NodesProps) => {
    const [id, setId] = useState<string>(undefined);
    const [sort, setSort] = useState<Sort>('timestamp');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { summary } = props;
    const { data, loading } = useNodes(pageNumber, id, sort);
    const totalNodePages = summary
        ? Math.ceil(summary.totalNodes / NODES_PER_PAGE)
        : 1;

    return (
        <div className="landing-noether">
            <div className="landing-noether-title">
                <h5 className="landing-sub-title">Noether Nodes</h5>

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
                            <th className="table-header-text">Node</th>
                            <th
                                className="table-header-text pointer"
                                onClick={() => setSort('totalBlocks')}
                            >
                                #Blocks Produced{' '}
                                {sort == 'totalBlocks' && (
                                    <i className="fas fa-arrow-down"></i>
                                )}
                            </th>
                            <th className="table-header-text">Total Staked</th>
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
                                onClick={() => setSort('timestamp')}
                            >
                                Total Uptime Days{' '}
                                {sort == 'timestamp' && (
                                    <i className="fas fa-arrow-down"></i>
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading || !data?.nodes ? (
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
                            data.nodes.map((node) => {
                                const now = new Date();
                                const uptimeDays = Math.ceil(
                                    (now.getTime() / 1000 - node.timestamp) /
                                        60 /
                                        60 /
                                        24
                                );
                                return (
                                    <tr key={node.id} className="body-text-2">
                                        <td>
                                            <Address
                                                type="address"
                                                id={node.id}
                                            />
                                        </td>
                                        <td>{node.totalBlocks}</td>
                                        <td>
                                            {formatCTSI(
                                                node.owner.stakedBalance,
                                                2
                                            )}{' '}
                                            CTSI
                                        </td>
                                        <td>
                                            {formatCTSI(node.totalReward, 2)}{' '}
                                            CTSI
                                        </td>
                                        <td>{uptimeDays}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {!id && (
                <div className="landing-noether-pagination body-text-2">
                    <button
                        className="btn"
                        type="button"
                        disabled={pageNumber <= 0}
                        onClick={() => setPageNumber(pageNumber - 1)}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    Page {pageNumber + 1} of {totalNodePages}
                    <button
                        className="btn"
                        type="button"
                        disabled={pageNumber + 1 >= totalNodePages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Nodes;
