// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import { useBreakpointValue, VStack } from '@chakra-ui/react';
import UserTable from './users/UserTable';
import useUsers from '../graphql/hooks/useUsers';
import Pagination from './Pagination';
import { UserSort } from '../graphql/models';

interface UsersProps {
    chainId: number;
    account?: string;
    search?: string;
    pages: number;
}

const Users: FC<UsersProps> = (props) => {
    const { chainId, account, search, pages } = props;
    const [sort, setSort] = useState<UserSort>('stakedBalance');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data, loading } = useUsers(pageNumber, search, sort);
    const size = useBreakpointValue(['sm', 'sm', 'md', 'lg']);

    return (
        <VStack w="100%">
            <UserTable
                chainId={chainId}
                account={account}
                loading={loading}
                data={data?.users}
                size={size as 'lg' | 'md' | 'sm'}
                sort={sort}
                onSort={(order) => setSort(order)}
            />
            {!search && (
                <Pagination
                    pages={pages}
                    currentPage={pageNumber}
                    onPageClick={setPageNumber}
                />
            )}
        </VStack>
    );
};

export default Users;
