// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    HStack,
    Stack,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import { isString } from 'lodash';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import AddressText from '../AddressText';
import { SettingsIcon } from '../Icons';
import { useWallet } from '../wallet';
import { StakingTabNavigation } from './StakingTabNavigation';

export interface PoolHeaderProps {
    from?: string;
    isManager?: boolean;
}

export const PoolHeader = ({ from, isManager = false }: PoolHeaderProps) => {
    const params = useParams();
    const address = params.pool as string;
    const { chainId } = useWallet();
    const iconSize = useBreakpointValue({ base: '1.688rem', sm: 5 });

    return (
        <Box
            bg="dark.gray.tertiary"
            color="white"
            px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
            pt={5}
        >
            <Stack
                justify="space-between"
                alignItems={{ base: 'flex-start', lg: 'flex-end' }}
                direction={{ base: 'column', lg: 'row' }}
            >
                <VStack alignItems="flex-start" pb="5">
                    <HStack alignItems="flex-start">
                        <Button
                            as={NextLink}
                            href="/stake"
                            leftIcon={<ArrowBackIcon />}
                            variant="text"
                            size="sm"
                            px="0"
                        >
                            Staking pool
                        </Button>
                    </HStack>

                    <HStack>
                        <AddressText
                            address={address}
                            chainId={chainId}
                            fontSize={['xl', '2xl']}
                        />

                        {isManager && (
                            <Button
                                as={NextLink}
                                href={`/pools/${address}/manage${
                                    isString(from) ? `?from=${from}` : ''
                                }`}
                                variant="text"
                                size="sm"
                                pl={0}
                                data-testid="pool-management-link"
                                title="Manage pool"
                            >
                                <SettingsIcon w={iconSize} h={iconSize} />
                            </Button>
                        )}
                    </HStack>
                </VStack>

                <StakingTabNavigation />
            </Stack>
        </Box>
    );
};
