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
import { ActivityType } from '../../graphql/models';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export interface IPoolActivityProps {
    poolAddress: string;
}

export const PoolActivity: FC<IPoolActivityProps> = ({ poolAddress }) => {
    const today = new Date();
    const previousWeekDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
    );
    const previousMonthDay = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
    );

    const poolFilters = [
        {
            key: 'type',
            title: 'Types:',
            type: 'checkbox',
            options: [
                {
                    label: 'Deposit',
                    value: ActivityType.DEPOSIT,
                },
                {
                    label: 'Withdraw',
                    value: ActivityType.WITHDRAW,
                },
                {
                    label: 'Stake',
                    value: ActivityType.STAKE,
                },
                {
                    label: 'Unstake',
                    value: ActivityType.UNSTAKE,
                },
            ],
        },
        {
            key: 'time',
            title: 'Time period:',
            type: 'radio',
            options: [
                {
                    label: 'All-time',
                    value: 'allTime',
                    default: true,
                },
                {
                    label: 'This Week',
                    value: 'thisWeek',
                },
                {
                    label: 'Last Week',
                    value: 'lastWeek',
                },
                {
                    label: 'This Month',
                    value: 'thisMonth',
                },
                {
                    label: 'Last Month',
                    value: 'lastMonth',
                },
            ],
        },
    ];

    const timePeriods = {
        thisWeek: {
            from: startOfWeek(today, { weekStartsOn: 1 }),
            to: endOfWeek(today, { weekStartsOn: 1 }),
        },
        lastWeek: {
            from: startOfWeek(previousWeekDay, { weekStartsOn: 1 }),
            to: endOfWeek(previousWeekDay, { weekStartsOn: 1 }),
        },
        thisMonth: {
            from: startOfMonth(today),
            to: endOfMonth(today),
        },
        lastMonth: {
            from: startOfMonth(previousMonthDay),
            to: endOfMonth(previousMonthDay),
        },
    };

    const defaultTimePeriod = poolFilters
        .find((el) => el.key === 'time')
        .options.find((el) => el.default === true).value;

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [selectedPeriod, setSelectedPeriod] =
        useState<string>(defaultTimePeriod);

    const [selectedTimePeriod, setSelectedTimePeriod] = useState<{
        from: Date;
        to: Date;
    }>({
        from: null,
        to: null,
    });

    const [userSearch, setUserSearch] = useState<string>();

    const onSelectedPeriodChange = (value: string) => {
        setSelectedPeriod(value);
        setSelectedTimePeriod(timePeriods[value]);
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
                gap={2}
                justify="space-between"
                align={{
                    base: 'flex-start',
                    lg: 'center',
                }}
                direction={{ base: 'column', lg: 'row' }}
                role="pool-filters-wrapper"
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
                selectedTimePeriod={selectedTimePeriod}
            />
        </>
    );
};
