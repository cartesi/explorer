// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Stack } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { PoolFilters } from './PoolFilters';
import SearchInput from '../SearchInput';
import { PoolActivityList } from './PoolActivityList';

interface IPoolActivityProps {
    poolAddress: string;
}

export const PoolActivity: FC<IPoolActivityProps> = ({ poolAddress }) => {
    const poolFilters = [
        {
            key: 'type',
            title: 'Types:',
            type: 'checkbox',
            options: [
                { label: 'Deposit', value: 'Deposit' },
                { label: 'Withdraw', value: 'Withdraw' },
                { label: 'Stake', value: 'Stake' },
                { label: 'Unstake', value: 'Unstake' },
            ],
        },
        {
            key: 'time',
            title: 'Time period:',
            type: 'radio',
            options: [
                { label: 'All-time', value: 'AllTime', default: true },
                { label: 'This Week', value: 'ThisWeek' },
                { label: 'Last Week', value: 'LastWeek' },
                { label: 'This Month', value: 'ThisMonth' },
                { label: 'Last Month', value: 'LastMonth' },
            ],
        },
    ];

    const defaultTimePeriod = poolFilters
        .find((el) => el.key === 'time')
        .options.find((el) => el.default === true).value;

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] =
        useState<string>(defaultTimePeriod);
    const [userSearch, setUserSearch] = useState<string>();

    const onSelectedPeriodChange = (value: string) => {
        setSelectedPeriod(value);
    };

    const onSelectedTypesChange = (value: string) => {
        const isSelected = selectedTypes.includes(value);
        if (isSelected) {
            setSelectedTypes(selectedTypes.filter((s) => s !== value));
        } else {
            setSelectedTypes([...selectedTypes, value]);
        }
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
                    filters={poolFilters}
                    selectedPeriod={selectedPeriod}
                    onSelectedPeriodChange={onSelectedPeriodChange}
                    selectedTypes={selectedTypes}
                    onSelectedTypesChange={onSelectedTypesChange}
                />
                <SearchInput
                    w={['100%', 200, 400]}
                    placeholder="Search User Address"
                    onSearchChange={(e) => {
                        setUserSearch(e.target.value.toLowerCase());
                    }}
                />
            </Stack>

            <PoolActivityList
                poolAddress={poolAddress}
                userSearch={userSearch}
                selectedTypes={selectedTypes}
                selectedPeriod={selectedPeriod}
            />
        </>
    );
};
