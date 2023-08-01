// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ChevronRightIcon } from '@chakra-ui/icons';
import {
    Box,
    HStack,
    Icon,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { PoolPerformanceIcon } from '@explorer/ui';
import { pathOr } from 'lodash/fp';
import NextLink from 'next/link';
import { FC, ReactChild, ReactFragment, memo } from 'react';
import ConditionalWrapper from '../../../components/ConditionalWrapper';
import useStakingPoolPerformance from '../../../graphql/hooks/useStakingPoolPerformance';
import BigNumberTextV2 from '../../BigNumberTextV2';

export interface PoolPerformanceStatProps {
    address: string;
    location?: string;
}

const PoolPerformanceStat: FC<PoolPerformanceStatProps> = memo(
    ({ address, location }: PoolPerformanceStatProps) => {
        const bg = useColorModeValue('blue.50', 'dark.gray.tertiary');
        const borderColor = useColorModeValue(
            'transparent',
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
                wrapper={(children: ReactChild | ReactFragment) => (
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
                    <HStack spacing={4} align="center" p={4} w="full">
                        <Box
                            w={14}
                            h={14}
                            borderRadius="full"
                            display="grid"
                            placeContent="center"
                            flexShrink={0}
                        >
                            <PoolPerformanceIcon w={7} h={7} />
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
                                    label="7 days Performance."
                                    placement="top"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon w={3.5} h={3.5} />
                                </Tooltip>
                            </HStack>
                        </BigNumberTextV2>

                        {location && (
                            <ChevronRightIcon
                                w={5}
                                h={5}
                                role="location-icon"
                            />
                        )}
                    </HStack>
                </Box>
            </ConditionalWrapper>
        );
    }
);

export default PoolPerformanceStat;
