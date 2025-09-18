// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbChevronRight, TbHelp } from 'react-icons/tb';
import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import { pathOr } from 'lodash/fp';
import NextLink from 'next/link';
import { FC, memo, ReactNode } from 'react';
import useStakingPoolPerformance from '../../../graphql/hooks/useStakingPoolPerformance';
import BigNumberTextV2 from '../../BigNumberTextV2';
import ConditionalWrapper from '../../ConditionalWrapper';
import { PoolPerformanceIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';
import type { Route } from 'next';

export interface PoolPerformanceStatProps {
    address: string;
    location?: Route;
}

const PoolPerformanceStat: FC<PoolPerformanceStatProps> = memo(
    ({ address, location }: PoolPerformanceStatProps) => {
        const iconColor = useColorModeValue('light.primary', 'dark.primary');
        const bg = useColorModeValue('dark.gray.senary', 'dark.gray.tertiary');
        const borderColor = useColorModeValue(
            'light.border.tertiary',
            'dark.gray.quaternary'
        );
        const { loading, data } = useStakingPoolPerformance(address);

        if (loading) return null;

        const weekPerformance = pathOr(
            0,
            'performance.weekly[0].performance',
            data
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
                    borderWidth="1px"
                    borderColor={borderColor}
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
                                as={PoolPerformanceIcon}
                                color={iconColor}
                                w={7}
                                h={7}
                            />
                        </Box>
                        <BigNumberTextV2
                            value={weekPerformance}
                            unit="percent"
                            options={{ maximumFractionDigits: 2 }}
                            componentStyle="ctaChevron"
                            note="7 Days"
                        >
                            <HStack>
                                <Text>Pool Performance</Text>
                                <Tooltip
                                    showArrow
                                    content="7 days Performance."
                                    positioning={{
                                        placement: 'top',
                                    }}
                                    openDelay={0}
                                    contentProps={{
                                        fontSize: 'small',
                                    }}
                                >
                                    <Icon as={TbHelp} w={5} h={5} />
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
    }
);

export default PoolPerformanceStat;
