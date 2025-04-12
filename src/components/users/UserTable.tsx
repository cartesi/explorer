// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FaArrowDown } from 'react-icons/fa';

import {
    HStack,
    Spinner,
    Table,
    TableCellProps,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FC } from 'react';
import { User, UserSort } from '../../graphql/models';
import theme from '../../styles/theme';
import { GhostButton } from '../GhostButton';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import UserRow from './UserRow';
import { useColorModeValue } from '../ui/color-mode';

export interface UserTableProps {
    chainId: number;
    loading: boolean;
    data?: User[];
    sort?: UserSort;
    onSort: (order: UserSort) => void;
}

const UserTable: FC<UserTableProps> = ({
    chainId,
    data,
    loading,
    sort,
    onSort,
}) => {
    const stakeText = useBreakpointValue(['Info', 'Info', 'Stake/Info']);
    const hasItems = data?.length > 0;
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );
    const buttonHoverColor = useColorModeValue('gray.90', 'dark.gray.quinary');
    const thProps: TableCellProps = {
        bg: 'dark.gray.primary',
        paddingTop: 4,
        paddingBottom: 4,
        borderColor: topBorderColor,
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
                        <Table.Cell
                            {...thProps}
                            textTransform="none"
                            fontSize="md"
                            fontWeight={400}
                            borderTopLeftRadius="6px"
                            fontFamily={theme.tokens.getVar('fonts.body')}
                        >
                            User
                        </Table.Cell>

                        <Table.Cell {...thProps}>
                            <GhostButton
                                height="auto"
                                fontSize="md"
                                fontWeight={400}
                                textTransform="none"
                                _hover={{ color: buttonHoverColor }}
                                fontFamily={theme.tokens.getVar('fonts.body')}
                                onClick={() => onSort('totalBlocks')}
                            >
                                Block Produced
                            </GhostButton>
                            {sort == 'totalBlocks' && (
                                <FaArrowDown
                                    width={5}
                                    height={5}
                                    style={{ marginLeft: '1rem' }}
                                />
                            )}
                        </Table.Cell>

                        <Table.Cell {...thProps}>
                            <GhostButton
                                height="auto"
                                fontSize="md"
                                fontWeight={400}
                                textTransform="none"
                                fontFamily={theme.tokens.getVar('fonts.body')}
                                _hover={{ color: buttonHoverColor }}
                                onClick={() => onSort('balance')}
                            >
                                Total Staked
                            </GhostButton>
                            {sort == 'balance' && (
                                <FaArrowDown
                                    width={5}
                                    height={5}
                                    style={{ marginLeft: '1rem' }}
                                />
                            )}
                        </Table.Cell>

                        <Table.Cell {...thProps}>
                            <GhostButton
                                height="auto"
                                fontSize="md"
                                fontWeight={400}
                                textTransform="none"
                                fontFamily={theme.tokens.getVar('fonts.body')}
                                _hover={{ color: buttonHoverColor }}
                                onClick={() => onSort('totalReward')}
                            >
                                Total Rewards
                            </GhostButton>
                            {sort == 'totalReward' && (
                                <FaArrowDown
                                    width={5}
                                    height={5}
                                    style={{ marginLeft: '1rem' }}
                                />
                            )}
                        </Table.Cell>

                        <Table.Cell
                            {...thProps}
                            position={{ base: 'sticky', md: 'initial' }}
                            top={0}
                            right={0}
                            style={{ textAlign: 'center' }}
                            textTransform="none"
                            fontSize="md"
                            fontWeight={400}
                            fontFamily={theme.tokens.getVar('fonts.body')}
                            borderTopRightRadius="6px"
                        >
                            {stakeText}
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {loading ? (
                        <Table.Row>
                            <Table.Cell colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading...</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ) : hasItems ? (
                        data.map((user) => (
                            <UserRow
                                key={user.id}
                                chainId={chainId}
                                user={user}
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

export default UserTable;
