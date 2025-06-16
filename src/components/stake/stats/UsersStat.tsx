// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbChevronRight } from 'react-icons/tb';
import { BsQuestionCircle } from 'react-icons/bs';
import { Box, HStack, Icon, StackProps, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import BigNumberTextV2 from '../../BigNumberTextV2';
import ConditionalWrapper from '../../ConditionalWrapper';
import { PoolUsersIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';

export interface UsersStatProps extends StackProps {
    totalUsers: number;
    location?: string;
}

const UsersStat: FC<UsersStatProps> = (props) => {
    const { totalUsers, location } = props;
    const iconColor = useColorModeValue('light.primary', 'dark.primary');
    const bg = useColorModeValue('dark.gray.senary', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'light.border.tertiary',
        'dark.gray.quaternary'
    );

    return (
        <ConditionalWrapper
            condition={location}
            wrapper={(children: ReactNode) => (
                <NextLink href={location}>{children}</NextLink>
            )}
        >
            <Box
                flexBasis={{ base: '100%', lg: '33.33%' }}
                flexShrink={0}
                bgColor={bg}
                borderRadius="1rem"
                borderColor={borderColor}
                borderWidth="1px"
                cursor={location ? 'pointer' : ''}
            >
                <HStack gap={4} align="center" p={4} w="full">
                    <Box
                        w={14}
                        h={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                        flexShrink={0}
                    >
                        <Icon
                            as={PoolUsersIcon}
                            color={iconColor}
                            w={7}
                            h={7}
                        />
                    </Box>
                    <BigNumberTextV2
                        value={totalUsers}
                        componentStyle="ctaChevron"
                    >
                        <HStack>
                            <Text>Users</Text>
                            <Tooltip
                                showArrow
                                content="Number of users who staked in this pool"
                                positioning={{
                                    placement: 'top',
                                }}
                                openDelay={0}
                                contentProps={{
                                    fontSize: 'small',
                                }}
                            >
                                <Icon
                                    as={BsQuestionCircle}
                                    data-testid="users-icon"
                                    w={3.5}
                                    h={3.5}
                                />
                            </Tooltip>
                        </HStack>
                    </BigNumberTextV2>
                    {location && (
                        <Icon
                            as={TbChevronRight}
                            w={5}
                            h={5}
                            data-testid="location-icon"
                        />
                    )}
                </HStack>
            </Box>
        </ConditionalWrapper>
    );
};

export default UsersStat;
