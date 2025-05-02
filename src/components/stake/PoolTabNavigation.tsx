// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Button, HStack, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { FC } from 'react';
import { DashboardIcon, SettingsIcon, StakeIcon } from '../Icons';

export const PoolTabNavigation: FC = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const color = useColorModeValue('gray.900', 'white');
    const params = useParams();
    const pathname = usePathname();
    const address = params.pool as string;

    return (
        <>
            <HStack alignSelf={{ base: 'center', lg: 'flex-end' }}>
                <Button
                    asChild
                    py={{ lg: 7 }}
                    leftIcon={<DashboardIcon />}
                    outline="none"
                    textTransform="none"
                    isActive={pathname === `/node/[node]/pool`}
                    variant={
                        pathname === `/node/[node]/pool` ? 'solid' : 'ghost'
                    }
                    _hover={{ bg: 'transparent' }}
                    _active={{
                        bg: bg,
                        color: color,
                    }}
                >
                    <NextLink href={`/stake/${address}`}>Pool Info</NextLink>
                </Button>
                <Button
                    asChild
                    py={{ lg: 7 }}
                    leftIcon={<StakeIcon />}
                    outline="none"
                    textTransform="none"
                    isActive={pathname === `/node/[node]/stake`}
                    variant={
                        pathname === `/node/[node]/stake` ? 'solid' : 'ghost'
                    }
                    _hover={{ bg: 'transparent' }}
                    _active={{
                        bg: bg,
                        color: color,
                    }}
                >
                    <NextLink href={`/stake/${address}/stake`}>Stake</NextLink>
                </Button>
                <Button
                    asChild
                    borderTopRadius="6px"
                    py={{ lg: 7 }}
                    leftIcon={<SettingsIcon />}
                    outline="none"
                    textTransform="none"
                    isActive={pathname === `/node/[node]/manage`}
                    variant={
                        pathname === `/node/[node]/stake` ? 'solid' : 'ghost'
                    }
                    _hover={{ bg: 'transparent' }}
                    _active={{
                        bg: bg,
                        color: color,
                    }}
                >
                    <NextLink href={`/stake/${address}/manage`}>
                        Manage
                    </NextLink>
                </Button>
            </HStack>
        </>
    );
};

export default PoolTabNavigation;
