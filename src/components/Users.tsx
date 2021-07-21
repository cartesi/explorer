// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import UserTable, { Sort } from './users/UserTable';
import useUsers, { USERS_PER_PAGE } from '../graphql/hooks/useUsers';
import { Summary } from '../graphql/models';

interface UsersProps {
    summary: Summary;
}

const Users = (props: UsersProps) => {
    const { account } = useWeb3React<Web3Provider>();

    const [id, setId] = useState<string>(undefined);
    const [sort, setSort] = useState<Sort>('stakedBalance');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { summary } = props;
    const { data, loading } = useUsers(pageNumber, id, sort);
    const totalUsersPages = summary
        ? Math.ceil(summary.totalUsers / USERS_PER_PAGE)
        : 1;

    return (
        <div className="landing-producers">
            <div className="landing-producers-title">
                <h5 className="landing-sub-title">Block Producers</h5>

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

            <UserTable
                account={account}
                loading={loading}
                data={data?.users}
                onSort={(order) => setSort(order)}
            />
            {!id && (
                <div className="landing-producers-pagination body-text-2">
                    <button
                        className="btn"
                        type="button"
                        disabled={pageNumber <= 0}
                        onClick={() => setPageNumber(pageNumber - 1)}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    Page {pageNumber + 1} of {totalUsersPages}
                    <button
                        className="btn"
                        type="button"
                        disabled={pageNumber + 1 >= totalUsersPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Users;
