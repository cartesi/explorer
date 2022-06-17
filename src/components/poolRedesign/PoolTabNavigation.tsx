// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Button, HStack, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { SettingsIcon } from '@chakra-ui/icons';
import { DashboardIcon, StakeIcon } from '../Icons';

export const PoolTabNavigation: FC = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const color = useColorModeValue('gray.900', 'white');
    const router = useRouter();
    const address = router.query.pool as string;

    return (
        <>
            <HStack alignSelf={{ base: 'center', lg: 'flex-end' }}>
                <NextLink href={`/pool-redesign/${address}`}>
                    <Button
                        borderTopRadius="6px"
                        py={{ lg: 7 }}
                        leftIcon={<DashboardIcon />}
                        outline="none"
                        textTransform="none"
                        isActive={router.pathname === `/node/[node]/pool`}
                        variant={
                            router.pathname === `/node/[node]/pool`
                                ? 'solid'
                                : 'ghost'
                        }
                        _hover={{ bg: 'transparent' }}
                        _active={{
                            bg: bg,
                            color: color,
                        }}
                    >
                        Pool Info
                    </Button>
                </NextLink>
                <NextLink href={`/pool-redesign/${address}/stake`}>
                    <Button
                        borderTopRadius="6px"
                        py={{ lg: 7 }}
                        leftIcon={<StakeIcon />}
                        outline="none"
                        textTransform="none"
                        isActive={router.pathname === `/node/[node]/stake`}
                        variant={
                            router.pathname === `/node/[node]/stake`
                                ? 'solid'
                                : 'ghost'
                        }
                        _hover={{ bg: 'transparent' }}
                        _active={{
                            bg: bg,
                            color: color,
                        }}
                    >
                        Stake
                    </Button>
                </NextLink>
                <NextLink href={`/pool-redesign/${address}/manage`}>
                    <Button
                        borderTopRadius="6px"
                        py={{ lg: 7 }}
                        leftIcon={<SettingsIcon />}
                        outline="none"
                        textTransform="none"
                        isActive={router.pathname === `/node/[node]/manage`}
                        variant={
                            router.pathname === `/node/[node]/stake`
                                ? 'solid'
                                : 'ghost'
                        }
                        _hover={{ bg: 'transparent' }}
                        _active={{
                            bg: bg,
                            color: color,
                        }}
                    >
                        Manage
                    </Button>
                </NextLink>
            </HStack>
        </>
    );
};

export default PoolTabNavigation;
