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
import { DashboardIcon, StakeIcon } from '../Icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export const StakingTabNavigation: FC = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const color = useColorModeValue('gray.900', 'white');
    const router = useRouter();
    const address = router.query.pool as string;

    return (
        <>
            <HStack alignSelf={{ base: 'center', lg: 'flex-end' }}>
                <NextLink href={`/stake/${address}`}>
                    <Button
                        py={{ lg: 7 }}
                        leftIcon={<DashboardIcon w="24px" h="24px" />}
                        outline="none"
                        textTransform="none"
                        isActive={
                            router.pathname === `/stake/[pool]` ||
                            router.pathname === '/stake/[pool]/commissions'
                        }
                        variant={
                            router.pathname === `/stake/[pool]`
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
                <NextLink href={`/stake/${address}/stake`}>
                    <Button
                        py={{ lg: 7 }}
                        leftIcon={<StakeIcon w="24px" h="24px" />}
                        outline="none"
                        textTransform="none"
                        isActive={router.pathname === `/stake/[pool]/stake`}
                        variant={
                            router.pathname === `/stake/[pool]/stake`
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
            </HStack>
        </>
    );
};
