// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbChevronRight, TbHelp } from 'react-icons/tb';
import { Box, HStack, Icon, StackProps, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import BigNumberTextV2 from '../../BigNumberTextV2';
import ConditionalWrapper from '../../ConditionalWrapper';
import { PoolProductionIntervalIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';

export interface ProductionIntervalStatProps extends StackProps {
    totalBlocks: number;
    productionInterval: number; // average number of milliseconds between blocks considering the last 10 produced blocks
    location?: string;
}

const ProductionIntervalStat: FC<ProductionIntervalStatProps> = (props) => {
    const { totalBlocks, productionInterval, location } = props;
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
                            as={PoolProductionIntervalIcon}
                            color={iconColor}
                            w={7}
                            h={7}
                        />
                    </Box>
                    <BigNumberTextV2
                        value={productionInterval}
                        unit="duration"
                        componentStyle="ctaChevron"
                    >
                        <HStack>
                            <Text>Production Interval</Text>
                            <Tooltip
                                showArrow
                                content={`Average interval between the last ${Math.min(
                                    10,
                                    totalBlocks
                                )} blocks produced by the pool`}
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
};

export default ProductionIntervalStat;
