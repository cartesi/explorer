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
    IconProps,
    Link,
    Table,
    TableRowProps,
    Text,
} from '@chakra-ui/react';
import { isObject } from 'lodash';
import NextLink from 'next/link';
import { FC } from 'react';
import { User } from '../../graphql/models';
import { formatCTSI } from '../../utils/token';
import Address from '../Address';
import { useColorModeValue } from '../ui/color-mode';
import {
    StakeCircledIcon,
    StakeCircledOutlinedIcon,
    StakeIcon,
} from '../Icons';

export interface UserRowProps extends TableRowProps {
    chainId: number;
    user: User;
}

const UserRow: FC<UserRowProps> = ({ chainId, user, ...restProps }) => {
    const backgroundColor = useColorModeValue('white', 'dark.gray.primary');
    const backgroundHoverColor = useColorModeValue(
        'WhiteSmoke',
        'dark.gray.quaternary'
    );
    const borderColor = useColorModeValue('gray.80', 'dark.gray.quinary');
    const linkHoverColor = useColorModeValue('light.primary', 'dark.primary');
    const linkColor = useColorModeValue('gray.900', 'dark.primary');
    const addressColor = useColorModeValue('gray.900', 'white');
    const isPool = isObject(user.pool);

    return (
        <Table.Row
            key={user.id}
            backgroundColor={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            data-testid="user-row"
            {...restProps}
        >
            <Table.Cell
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                <Address
                    ens
                    address={user.id}
                    chainId={chainId}
                    responsive
                    truncated
                    textDecoration="underline"
                    px="0.5rem"
                    py="0.25rem"
                    color={addressColor}
                    minWidth="120px"
                    shouldDisplayFallbackAvatar
                    fallbackAvatar={
                        (isPool
                            ? StakeCircledIcon
                            : StakeCircledOutlinedIcon) as FC<IconProps>
                    }
                />
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                {user.totalBlocks}
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                {formatCTSI(user.balance, 0)} CTSI
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                {formatCTSI(user.totalReward, 0)} CTSI
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                position={{ base: 'sticky', md: 'initial' }}
                top={0}
                right={0}
                backgroundColor="inherit"
                padding={0}
                data-testid="stake-info-col"
                paddingTop={4}
                paddingBottom={4}
            >
                <Box
                    shadow={{ base: 'md', md: 'none' }}
                    paddingLeft={{ base: 0, md: 8 }}
                    paddingRight={{ base: 0, md: 8 }}
                    minHeight={{ base: '5rem', md: 'auto' }}
                    width={{ base: '5rem', md: 'auto' }}
                    display={{ base: 'flex', md: 'block' }}
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                >
                    {isObject(user.pool) ? (
                        <Link
                            as={NextLink}
                            href={`/stake/${user.id}`}
                            data-testid="stake-info-link"
                            title="Stake/info"
                            color={linkColor}
                            _hover={{
                                color: linkHoverColor,
                            }}
                        >
                            <StakeIcon
                                style={{ width: '2rem', height: '2rem' }}
                            />
                        </Link>
                    ) : (
                        <Text>Private node</Text>
                    )}
                </Box>
            </Table.Cell>
        </Table.Row>
    );
};

export default UserRow;
