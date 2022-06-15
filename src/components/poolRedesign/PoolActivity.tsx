// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Stack } from '@chakra-ui/react';
import { FC, memo, useState } from 'react';
import { PoolFilters } from './PoolFilters';
import SearchInput from '../SearchInput';
import { PoolActivityList } from './PoolActivityList';

interface IPoolActivityProps {
    poolAddress: string;
}

export const PoolActivity: FC<IPoolActivityProps> = ({ poolAddress }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState<string>();

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
        //console.log(value);
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
                <SearchInput
                    w={[100, 200, 400, 500]}
                    placeholder="Search User Address"
                    onSearchChange={(e) => {
                        setUserSearch(e.target.value.toLowerCase());
                    }}
                />
            </Stack>

            <PoolActivityList
                poolAddress={poolAddress}
                userSearch={userSearch}
            />
        </>
    );
};
