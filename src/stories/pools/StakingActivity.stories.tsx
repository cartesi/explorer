// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { StakingActivity } from '../../components/poolRedesign/StakingActivity';
import { GET_POOL_ACTIVITIES } from '../../graphql/queries/poolActivities';

export default {
    title: 'Pool Redesign/Staking Activity',
    component: StakingActivity,
    argTypes: {},
} as ComponentMeta<typeof StakingActivity>;

const Template: ComponentStory<typeof StakingActivity> = (args) => (
    <StakingActivity {...args} />
);

const componentParams = {
    userAccount: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
    poolAddress: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
};
const queryVariables = {
    first: 20,
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where: {
        user: '0xa074683b5be015f053b5dceb064c41fc9d11b6e5',
        pool: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
    },
};

export const Loading10Seconds = Template.bind({});
Loading10Seconds.args = {
    ...componentParams,
};
Loading10Seconds.parameters = {
    apolloClient: {
        mocks: [
            {
                delay: 10000,
                request: {
                    query: GET_POOL_ACTIVITIES,
                    variables: queryVariables,
                },
                result: {
                    data: {
                        poolActivities: [
                            {
                                amount: '150000000000000000000',
                                id: '0xf008c00ae062476fd02772fa08469033dbeedbdd4937727eb725d5aa3d921982',
                                shares: '150000000000000000000000000000',
                                timestamp: '1643612997',
                                type: 'STAKE',
                            },
                            {
                                amount: '150000000000000000000',
                                id: '0x5316176a7262ab6cd401a212c6cd892662ea43b67537c4af22bcbc4e8cd996de',
                                shares: null,
                                timestamp: '1643576268',
                                type: 'DEPOSIT',
                            },
                        ],
                    },
                },
            },
        ],
    },
};

export const ListOfActivities = Template.bind({});

ListOfActivities.args = {
    userAccount: '0x0bf9b7f1305839ce936c59bf099550e8e708c09c',
    poolAddress: '0xaede3f736596a2367a5e2ebde47d69b469ef0edb',
};
ListOfActivities.parameters = {
    apolloClient: {
        mocks: [
            {
                request: {
                    query: GET_POOL_ACTIVITIES,
                    variables: {
                        ...queryVariables,
                        where: {
                            user: '0x0bf9b7f1305839ce936c59bf099550e8e708c09c',
                            pool: '0xaede3f736596a2367a5e2ebde47d69b469ef0edb',
                        },
                    },
                },
                result: {
                    data: {
                        poolActivities: [
                            {
                                amount: '60000000000000000000',
                                id: '0x6dc64962409c4e446fb950e25f27d89d82497680a2a21edbf65cc8bef4a1d396',
                                timestamp: '1644943087',
                                type: 'WITHDRAW',
                            },
                            {
                                amount: '5000000000000000000',
                                id: '0x5a7ae017358fc09d8ab18ed9c0f55387915ba5e59d5d5fab59b64a3323aff14e',
                                timestamp: '1644943087',
                                type: 'WITHDRAW',
                            },
                            {
                                amount: '10000000000000000000',
                                id: '0x62814c57466ad25bdf98133e5f978add5c0c8fa49a53108ee579d56943833ce2',
                                timestamp: '1644926180',
                                type: 'WITHDRAW',
                            },
                            {
                                amount: '9750000000000000000000',
                                id: '0xaaafab23e9042e4b4b528291d88a71923e58f6e003da6753b12b1bc7706cba99',
                                timestamp: '1644926069',
                                type: 'DEPOSIT',
                            },
                            {
                                amount: '23000000000000000000',
                                id: '0xf5d699f00bf1fa55124d980f3acc45aa50b70b23d240bfcd3d079ff485e0ce0c',
                                timestamp: '1644521856',
                                type: 'DEPOSIT',
                            },
                            {
                                amount: '5000000000000000000',
                                id: '0x9e756c5e31d8df2582fe4ed80c1cefe61903e1c699a92b6b0aa337f90ecb5c5e',
                                timestamp: '1644514018',
                                type: 'DEPOSIT',
                            },
                        ],
                    },
                },
            },
        ],
    },
};

export const NoActivitiesYet = Template.bind({});

NoActivitiesYet.args = componentParams;

NoActivitiesYet.parameters = {
    apolloClient: {
        mocks: [
            {
                request: {
                    query: GET_POOL_ACTIVITIES,
                    variables: queryVariables,
                },
                result: {
                    data: {
                        poolActivities: [],
                    },
                },
            },
        ],
    },
};
