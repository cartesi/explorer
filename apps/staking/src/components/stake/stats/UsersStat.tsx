// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, ReactChild, ReactFragment } from 'react';
import { PoolUsersIcon } from '@explorer/ui';
import {
    HStack,
    useColorModeValue,
    Box,
    StackProps,
    Icon,
    Tooltip,
    Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ChevronRightIcon } from '@chakra-ui/icons';
import BigNumberTextV2 from '../../BigNumberTextV2';
import ConditionalWrapper from '../../../components/ConditionalWrapper';

export interface UsersStatProps extends StackProps {
    totalUsers: number;
    location?: string;
}

const UsersStat: FC<UsersStatProps> = (props) => {
    const { totalUsers, location } = props;

    const bgBlocks = useColorModeValue('blue.50', 'gray.900');

    return (
        <ConditionalWrapper
            condition={location}
            wrapper={(children: ReactChild | ReactFragment) => (
                <NextLink href={location}>{children}</NextLink>
            )}
        >
            <Box
                flexBasis={{ base: '100%', lg: '33.33%' }}
                flexShrink={0}
                bgColor={bgBlocks}
                cursor={location ? 'pointer' : ''}
            >
                <HStack spacing={4} align="center" p={4} w="full">
                    <Box
                        w={14}
                        h={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                        flexShrink={0}
                    >
                        <PoolUsersIcon w={7} h={7} />
                    </Box>
                    <BigNumberTextV2
                        value={totalUsers}
                        componentStyle="ctaChevron"
                    >
                        <HStack>
                            <Text>Users</Text>
                            <Tooltip
                                label="Number of users who staked in this pool"
                                placement="top"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon role="users-icon" w={3.5} h={3.5} />
                            </Tooltip>
                        </HStack>
                    </BigNumberTextV2>
                    {location && (
                        <ChevronRightIcon w={5} h={5} role="location-icon" />
                    )}
                </HStack>
            </Box>
        </ConditionalWrapper>
    );
};

export default UsersStat;
