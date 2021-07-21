// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Tr, Td } from '@chakra-ui/react';
import Link from 'next/link';

import { User } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';

export interface UserRowProps {
    user: User;
    account?: string;
}

const UserRow: FunctionComponent<UserRowProps> = ({ user, account }) => {
    // if logged user is manager, show edit button
    const edit =
        user.pool && account && account.toLowerCase() == user.pool.manager;

    return (
        <Tr
            key={user.id}
            _hover={{ backgroundColor: 'WhiteSmoke' }}
            border="1px"
            borderColor="gray.500"
        >
            <Td>
                <Address id={user.id} />
            </Td>
            <Td isNumeric>{user.totalBlocks}</Td>
            <Td isNumeric>{formatCTSI(user.stakedBalance, 2)} CTSI</Td>
            <Td isNumeric>{formatCTSI(user.totalReward, 2)} CTSI</Td>
            <Td>
                {user.pool && (
                    <>
                        <Link href={`/pools/${user.id}`}>Stake</Link>
                        {edit && (
                            <Link href={`/pools/${user.id}/edit`}>Edit</Link>
                        )}
                    </>
                )}
            </Td>
        </Tr>
    );
};

export default UserRow;
