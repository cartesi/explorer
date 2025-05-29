// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    HStack,
    Spinner,
    Table,
    TableColumnHeaderProps,
    Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { StakingPoolFeeHistory } from '../../../graphql/models';
import theme from '../../../styles/theme';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import PoolCommissionsTableRow from './PoolCommissionsTableRow';
import { useColorModeValue } from '../../ui/color-mode';

export interface PoolCommissionsTableProps {
    loading: boolean;
    data?: StakingPoolFeeHistory[];
}

const PoolCommissionsTable: FC<PoolCommissionsTableProps> = ({
    data,
    loading,
}) => {
    const hasItems = data?.length > 0;
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );

    const thProps: TableColumnHeaderProps = {
        borderColor: topBorderColor,
        bg: 'dark.gray.primary',
        color: 'white',
        textTransform: 'none',
        fontSize: 'md',
        fontWeight: 400,
        fontFamily: theme.tokens.getVar('fonts.body'),
        paddingTop: 4,
        paddingBottom: 4,
    };

    return (
        <TableResponsiveHolder
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="6px"
        >
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell borderTopLeftRadius="6px" {...thProps}>
                            Date
                        </Table.Cell>
                        <Table.Cell {...thProps} textAlign="right">
                            Commission
                        </Table.Cell>
                        <Table.Cell
                            borderTopRightRadius="6px"
                            {...thProps}
                            textAlign="right"
                        >
                            Change
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {loading ? (
                        <Table.Row>
                            <Table.Cell colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ) : hasItems ? (
                        data.map((item) => (
                            <PoolCommissionsTableRow
                                key={item.id}
                                data={item}
                            />
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={9} textAlign="center">
                                <Text>No items</Text>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </TableResponsiveHolder>
    );
};

export default PoolCommissionsTable;
