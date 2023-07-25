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
    Tr,
    Td,
    useColorModeValue,
    Box,
    Link,
    Text,
    IconProps,
    TableRowProps,
} from '@chakra-ui/react';
import { User } from '../../graphql/models';
import {
    Address,
    StakeCircledIcon,
    StakeCircledOutlinedIcon,
    StakeIcon,
} from '@explorer/ui';
import { formatCTSI } from '../../utils/token';
import NextLink from 'next/link';
import { isObject } from 'lodash';

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
        <Tr
            key={user.id}
            backgroundColor={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            data-testid="user-row"
            {...restProps}
        >
            <Td borderColor={borderColor} paddingTop={4} paddingBottom={4}>
                <Address
                    ens
                    address={user.id}
                    chainId={chainId}
                    responsive
                    truncated
                    size="md"
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
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                {user.totalBlocks}
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                {formatCTSI(user.balance, 0)} CTSI
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
            >
                {formatCTSI(user.totalReward, 0)} CTSI
            </Td>
            <Td
                isNumeric
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
                        <NextLink href={`/stake/${user.id}`} passHref>
                            <Link
                                data-testid="stake-info-link"
                                title="Stake/info"
                                color={linkColor}
                                _hover={{
                                    color: linkHoverColor,
                                }}
                            >
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
