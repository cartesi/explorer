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
import { NodeRetiredHistory } from '../../components/node/NodeRetiredHistory';
import { NODES } from '../../graphql/queries/nodes';
export default {
    title: 'Node/NodeRetiredHistory',
    component: NodeRetiredHistory,
    argTypes: {},
} as ComponentMeta<typeof NodeRetiredHistory>;

const queryVariables = {
    first: 3,
    skip: 0,
    where: {
        owner: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
        status: 'Retired',
    },
    orderBy: 'retirementTimestamp',
    orderDirection: 'desc',
};
const Template: ComponentStory<typeof NodeRetiredHistory> = (args) => (
    <NodeRetiredHistory {...args} />
);

export const Default = Template.bind({});
Default.args = {
    address: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
};
Default.parameters = {
    apolloClient: {
        mocks: [
            {
                request: {
                    query: NODES,
                    variables: queryVariables,
                },
                result: {
                    data: {
                        nodes: [
                            {
                                id: '0x43551627aafca2f871d4b23d438257b8fcf741d6',
                                owner: {
                                    balance: '6000000000000000000000',
                                    id: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
                                    maturingBalance: '4000000000000000000000',
                                    maturingTimestamp: '1670819220',
                                    releasingBalance: '0',
                                    releasingTimestamp: '0',
                                    stakedBalance: '2000000000000000000000',
                                },
                                retirementTimestamp: '1670485824',
                                status: 'Retired',
                                timestamp: '1670477832',
                                totalBlocks: 0,
                                totalReward: '0',
                            },
                            {
                                id: '0x8e1237ef9cd3f6fddd77948345b304086e9a8625',
                                owner: {
                                    balance: '6000000000000000000000',
                                    id: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
                                    maturingBalance: '4000000000000000000000',
                                    maturingTimestamp: '1670819220',
                                    releasingBalance: '0',
                                    releasingTimestamp: '0',
                                    stakedBalance: '2000000000000000000000',
                                },
                                retirementTimestamp: '1670926656',
                                status: 'Retired',
                                timestamp: '1670914440',
                                totalBlocks: 1,
                                totalReward: '10000000000000000000',
                            },
                            {
                                id: '0xa8e2fe2d49bb7cf71764c8d7aef0fef90ab171e5',
                                owner: {
                                    balance: '6000000000000000000000',
                                    id: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
                                    maturingBalance: '4000000000000000000000',
                                    maturingTimestamp: '1670819220',
                                    releasingBalance: '0',
                                    releasingTimestamp: '0',
                                    stakedBalance: '2000000000000000000000',
                                },
                                retirementTimestamp: '1670911056',
                                status: 'Retired',
                                timestamp: '1670817480',
                                totalBlocks: 0,
                                totalReward: '0',
                            },
                        ],
                    },
                },
            },
        ],
    },
};

export const Empty = Template.bind({});
Empty.args = {
    address: '0xabe5271e041df23c9f7c0461df5d340a0c1c36f4',
};
Empty.parameters = {
    apolloClient: {
        mocks: [
            {
                request: {
                    query: NODES,
                    variables: queryVariables,
                },
                result: {
                    data: {
                        nodes: [],
                    },
                },
            },
        ],
    },
};
