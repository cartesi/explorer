// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import NextLink from 'next/link';
import { PoolFilters } from './PoolFilters';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import { SearchIcon } from '@chakra-ui/icons';
import { ViewMoreIcon } from '../Icons';
import Pagination from '../Pagination';

interface IPoolActivityProps {
    activity: any;
}

export const PoolActivity: FC<IPoolActivityProps> = ({ activity }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0);

    const poolFilters = [
        {
            title: 'Types:',
            options: [
                { label: 'Stake', value: 'Stake' },
                { label: 'Unstake', value: 'Unstake' },
                { label: 'Deposit', value: 'Deposit' },
                { label: 'Withdraw', value: 'Withdraw' },
                { label: 'Blockes Produced', value: 'Block' },
                { label: 'Pool Activity', value: 'Pool' },
            ],
        },
        {
            title: 'Time Duration:',
            options: [
                { label: 'This Week', value: 'Week' },
                { label: 'This Month', value: 'Month' },
            ],
        },
        {
            title: 'User Types:',
            options: [
                { label: 'From', value: 'From' },
                { label: 'To', value: 'To' },
                { label: 'By', value: 'By' },
            ],
        },
    ];

    const onFilterChange = (value: string) => {
        const isSelected = selected.includes(value);
        if (isSelected) {
            setSelected(selected.filter((s) => s !== value));
        } else {
            setSelected([...selected, value]);
        }
        console.log(value);
    };

    return (
        <>
            <Stack
                mb={4}
                spacing={2}
                justify="space-between"
                align={{
                    base: 'flex-start',
                    lg: 'center',
                }}
                direction={{ base: 'column', lg: 'row' }}
            >
                <PoolFilters
                    onChange={onFilterChange}
                    filters={poolFilters}
                    selectedFilters={selected}
                />
                <InputGroup
                    w={{
                        base: '100%',
                        lg: 'auto',
                    }}
                    minW={{
                        base: 'unset',
                        lg: '20rem',
                    }}
                >
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon />}
                    />
                    <Input type="tel" placeholder="Search User Address..." />
                </InputGroup>
            </Stack>
            <TableResponsiveHolder>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>From</Th>
                            <Th>Since</Th>
                            <Th>Deposit</Th>
                            <Th>View More</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {activity.map((item, index) => (
                            <Tr key={index}>
                                <Td>
                                    <NextLink href="#">{item.from}</NextLink>
                                </Td>
                                <Td>{item.since}</Td>
                                <Td>{item.deposit}</Td>
                                <Td>
                                    <Button variant="unstyled" size="sm">
                                        <ViewMoreIcon w={5} h={5} />
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableResponsiveHolder>
            <Stack
                direction={{
                    base: 'column',
                    lg: 'row',
                }}
                spacing={{
                    base: 4,
                    lg: 8,
                }}
                justify={{
                    base: 'center',
                    lg: 'flex-end',
                }}
                align="center"
                mt={6}
            >
                <Box>
                    <FormControl
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <FormLabel htmlFor="pages" whiteSpace="nowrap">
                            Rows per page
                        </FormLabel>
                        <Select variant="outline" id="pages" w="auto">
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Pagination
                        currentPage={pageNumber}
                        pages={20}
                        showPageNumbers
                        maxPageNumbers={5}
                        onPageClick={setPageNumber}
                    />
                </Box>
            </Stack>
        </>
    );
};
