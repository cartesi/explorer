// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Tr, Td, useColorModeValue, Box, Link, Text } from '@chakra-ui/react';
import { User } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import NextLink from 'next/link';
import {
    StakeCircledIcon,
    StakeCircledOutlinedIcon,
    StakeIcon,
} from '../Icons';
import { isObject } from 'lodash';

export interface UserRowProps {
    chainId: number;
    user: User;
}

const UserRow: FC<UserRowProps> = ({ chainId, user }) => {
    const backgroundColor = useColorModeValue('WhiteSmoke', 'gray.700');
    const borderColor = useColorModeValue('gray.100', 'header');
    const stakeInfoBg = useColorModeValue('white', 'gray.700');
    const isPool = isObject(user.pool);

    return (
        <Tr key={user.id} _hover={{ backgroundColor }}>
            <Td borderColor={borderColor}>
                <Address
                    ens
                    address={user.id}
                    chainId={chainId}
                    responsive
                    truncated
                    borderRadius="full"
                    size="md"
                    bg="blue.50"
                    px="0.5rem"
                    py="0.25rem"
                    color="gray.900"
                    minWidth="120px"
                    shouldDisplayFallbackAvatar
                    fallbackAvatar={
                        isPool ? StakeCircledIcon : StakeCircledOutlinedIcon
                    }
                />
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {user.totalBlocks}
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(user.balance, 0)} CTSI
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(user.totalReward, 0)} CTSI
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                position={{ base: 'sticky', md: 'initial' }}
                top={0}
                right={0}
                backgroundColor={{ base: stakeInfoBg, md: 'transparent' }}
                padding={0}
                data-testid="stake-info-col"
            >
                <Box
                    shadow={{ base: 'md', md: 'none' }}
                    padding={{ base: 0, md: 8 }}
                    minHeight={{ base: '5rem', md: 'auto' }}
                    width={{ base: '5rem', md: 'auto' }}
                    display={{ base: 'flex', md: 'block' }}
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                >
                    {isObject(user.pool) ? (
                        <NextLink href={`/stake/${user.id}`} passHref>
                            <Link data-testid="stake-info-link">
                                <StakeIcon w={8} h={8} />
                            </Link>
                        </NextLink>
                    ) : (
                        <Text>Private node</Text>
                    )}
                </Box>
            </Td>
        </Tr>
    );
};

export default UserRow;
