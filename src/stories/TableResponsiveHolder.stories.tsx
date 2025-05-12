// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { TableResponsiveHolder } from '../components/TableResponsiveHolder';
import { Table } from '@chakra-ui/react';
import _ from 'lodash';

export default {
    title: 'TableResponsiveHolder',
    component: TableResponsiveHolder,
    argTypes: {},
} as Meta<typeof TableResponsiveHolder>;

const ExampleTable = () => {
    return (
        <Table.Root variant="unstyled">
            <Table.Header>
                <Table.Row>
                    {_.times(40, (i) => (
                        <Table.Cell key={i}>{i}</Table.Cell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {_.times(10, (i) => (
                    <Table.Row key={i}>
                        {_.times(40, (j) => (
                            <Table.Cell key={j}>{j + i}</Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
};

type Story = StoryObj<typeof TableResponsiveHolder>;

export const Default: Story = {
    render: ({ children }) => (
        <TableResponsiveHolder>{children}</TableResponsiveHolder>
    ),
};

export const WithData: Story = {
    render: () => (
        <TableResponsiveHolder>
            <ExampleTable />
        </TableResponsiveHolder>
    ),
};
