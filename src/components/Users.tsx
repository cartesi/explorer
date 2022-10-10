// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import { VStack, HStack, Flex, Select, Text } from '@chakra-ui/react';
import UserTable from './users/UserTable';
import useUsers from '../graphql/hooks/useUsers';
import Pagination from './Pagination';
import { UserSort } from '../graphql/models';

interface UsersProps {
    chainId: number;
    totalItems: number;
    search?: string;
}

const Users: FC<UsersProps> = (props) => {
    const { chainId, totalItems = 0, search } = props;
    const [sort, setSort] = useState<UserSort>('balance');
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data, loading } = useUsers(pageNumber, search, sort, rowsPerPage);
    const options = Array.from({ length: 3 }).map(
        (item, index) => (index + 1) * 10
    );
    const pages = Math.ceil(totalItems / rowsPerPage);

    return (
        <VStack w="100%">
            <UserTable
                chainId={chainId}
                loading={loading}
                data={data?.users}
                sort={sort}
                onSort={(order) => {
                    setSort(order);
                    setPageNumber(0);
                }}
            />

            {!search && (
                <Flex
                    flexDirection={{ base: 'column', md: 'row' }}
                    justifyContent="flex-end"
                    alignItems={{ base: 'flex-end', md: 'flex-start' }}
                    width="100%"
                    mt="var(--chakra-space-12) !important"
                    overflowX="auto"
                    py={1}
                >
                    <HStack mr={{ base: 0, md: 12 }} mb={{ base: 4, md: 0 }}>
                        <Text fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>
                            Rows per page
                        </Text>
                        <Select
                            value={rowsPerPage}
                            width="4.625rem"
                            borderLeft="none"
                            borderTop="none"
                            borderRight="none"
                            borderRadius={0}
                            fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                            onChange={(event) => {
                                setRowsPerPage(
                                    Number(event.currentTarget.value)
                                );
                                setPageNumber(0);
                            }}
                        >
                            {options.map((option) => (
                                <option
                                    key={`rows-per-page-${option}`}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </HStack>
                    <Pagination
                        pages={pages}
                        currentPage={pageNumber}
                        showPageNumbers
                        onPageClick={setPageNumber}
                    />
                </Flex>
            )}
        </VStack>
    );
};

export default Users;
