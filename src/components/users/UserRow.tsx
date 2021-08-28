// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Link,
    Tr,
    Td,
    useColorModeValue,
    Tooltip,
    HStack,
} from '@chakra-ui/react';
import { FaCoins } from 'react-icons/fa';

import { User } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import NextLink from 'next/link';
import { EditIcon } from '@chakra-ui/icons';

export interface UserRowProps {
    chainId: number;
    user: User;
    account?: string;
    size?: 'lg' | 'md' | 'sm';
}

const UserRow: FC<UserRowProps> = ({ chainId, user, account, size = 'lg' }) => {
    const backgroundColor = useColorModeValue('WhiteSmoke', 'gray.700');

    // if logged user is manager, show edit button
    const edit =
        user.pool && account && account.toLowerCase() == user.pool.manager;

    return (
        <Tr key={user.id} _hover={{ backgroundColor }}>
            <Td>
                <Address address={user.id} chainId={chainId} responsive />
            </Td>
            {size != 'sm' && <Td isNumeric>{user.totalBlocks}</Td>}
            <Td isNumeric>{formatCTSI(user.stakedBalance, 0)} CTSI</Td>
            {size != 'sm' && (
                <Td isNumeric>{formatCTSI(user.totalReward, 0)} CTSI</Td>
            )}
            {size != 'sm' && (
                <Td>
                    {user.pool && (
                        <HStack>
                            <NextLink href={`/pools/${user.id}`} passHref>
                                <Link>
                                    <Tooltip
                                        label="Stake"
                                        placement="top"
                                        aria-label="Stake"
                                    >
                                        <span>
                                            <FaCoins />
                                        </span>
                                    </Tooltip>
                                </Link>
                            </NextLink>
                            {edit && (
                                <NextLink
                                    href={`/pools/${user.id}/edit`}
                                    passHref
                                >
                                    <Link>
                                        <Tooltip
                                            label="Edit"
                                            placement="top"
                                            aria-label="Edit"
                                        >
                                            <EditIcon />
                                        </Tooltip>
                                    </Link>
                                </NextLink>
                            )}
                        </HStack>
                    )}
                </Td>
            )}
        </Tr>
    );
};

export default UserRow;
