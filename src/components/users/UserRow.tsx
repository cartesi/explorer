// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Tr, Td, useColorModeValue, HStack } from '@chakra-ui/react';
import { FaCoins } from 'react-icons/fa';

import { User } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import { EditIcon } from '@chakra-ui/icons';
import IconLink from '../IconLink';

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
                <Address ens address={user.id} chainId={chainId} responsive />
            </Td>
            {size != 'sm' && <Td isNumeric>{user.totalBlocks}</Td>}
            <Td isNumeric>{formatCTSI(user.balance, 0)} CTSI</Td>
            {size != 'sm' && (
                <Td isNumeric>{formatCTSI(user.totalReward, 0)} CTSI</Td>
            )}
            {size != 'sm' && (
                <Td>
                    {user.pool && (
                        <HStack>
                            <IconLink
                                href={`/pools/${user.id}`}
                                tooltip="Stake"
                                icon={<FaCoins />}
                            />
                            {edit && (
                                <IconLink
                                    href={`/pools/${user.id}/edit`}
                                    tooltip="Edit"
                                    icon={<EditIcon />}
                                />
                            )}
                        </HStack>
                    )}
                </Td>
            )}
        </Tr>
    );
};

export default UserRow;
