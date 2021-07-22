// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';

import UserTable, { Sort } from './users/UserTable';
import useUsers, { USERS_PER_PAGE } from '../graphql/hooks/useUsers';
import { Summary } from '../graphql/models';

interface UsersProps {
    account?: string;
    search?: string;
    summary: Summary;
}

const Users = (props: UsersProps) => {
    const { account, search, summary } = props;
    const [sort, setSort] = useState<Sort>('stakedBalance');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data, loading } = useUsers(pageNumber, search, sort);
    const totalUsersPages = summary
        ? Math.ceil(summary.totalUsers / USERS_PER_PAGE)
        : 1;

    return (
        <UserTable
            account={account}
            loading={loading}
            data={data?.users}
            onSort={(order) => setSort(order)}
        />
    );
};

export default Users;
