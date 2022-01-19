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
import { DashboardIcon, DelegateIcon } from '../../components/Icons';

export const StakingTabNavigation: FC = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const color = useColorModeValue('gray.900', 'white');

    return (
        <>
            <HStack alignSelf={{ base: 'center', lg: 'flex-end' }}>
                <Button
                    borderTopRadius="6px"
                    py={{ lg: 7 }}
                    leftIcon={<DashboardIcon />}
                    outline="none"
                    variant="ghost"
                    _hover={{ bg: 'transparent' }}
                    _active={{
                        bg: bg,
                        color: color,
                    }}
                >
                    Pool Info
                </Button>
                <Button
                    isActive
                    borderTopRadius="6px"
                    py={{ lg: 7 }}
                    leftIcon={<DelegateIcon />}
                    _active={{
                        bg: bg,
                        color: color,
                    }}
                >
                    Stake
                </Button>
            </HStack>
        </>
    );
};
