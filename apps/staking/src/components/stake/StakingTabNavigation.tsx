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
import { SimpleChartIcon, StakeIcon } from '@explorer/ui';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export const StakingTabNavigation: FC = () => {
    const bg = useColorModeValue('white', 'dark.gray.quaternary');
    const color = useColorModeValue('gray.900', 'white');
    const router = useRouter();
    const address = router.query.pool as string;
    const isStakeTabActive = router.pathname === '/stake/[pool]/stake';
    const isPoolInfoTabActive = !isStakeTabActive;
    const tabs = [
        {
            href: `/stake/${address}`,
            Icon: SimpleChartIcon,
            text: 'Pool Info',
            isActive: isPoolInfoTabActive,
            variant: isPoolInfoTabActive ? 'solid' : 'ghost',
        },
        {
            href: `/stake/${address}/stake`,
            Icon: StakeIcon,
            text: 'Stake',
            isActive: isStakeTabActive,
            variant: isStakeTabActive ? 'solid' : 'ghost',
        },
    ];

    return (
        <HStack alignSelf={{ base: 'center', lg: 'flex-end' }}>
            {tabs.map((tab) => (
                <NextLink key={tab.href} href={tab.href} passHref>
                    <Button
                        py={{ lg: 7 }}
                        outline="none"
                        textTransform="none"
                        _hover={{
                            bg: 'transparent',
                        }}
                        _active={{
                            bg,
                            color,
                        }}
                        borderRadius="0.6rem 0.6rem 0 0"
                        leftIcon={<tab.Icon w="24px" h="24px" />}
                        isActive={tab.isActive}
                        variant={tab.variant}
                    >
                        {tab.text}
                    </Button>
                </NextLink>
            ))}
        </HStack>
    );
};
