// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, ReactChild, ReactFragment } from 'react';
import { PoolProductionIntervalIcon } from '@explorer/ui';
import {
    HStack,
    useColorModeValue,
    Box,
    StackProps,
    Icon,
    Tooltip,
    Text,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import BigNumberTextV2 from '../../BigNumberTextV2';
import ConditionalWrapper from '../../../components/ConditionalWrapper';

export interface ProductionIntervalStatProps extends StackProps {
    totalBlocks: number;
    productionInterval: number; // average number of milliseconds between blocks considering the last 10 produced blocks
    location?: string;
}

const ProductionIntervalStat: FC<ProductionIntervalStatProps> = (props) => {
    const { totalBlocks, productionInterval, location } = props;

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
                        <PoolProductionIntervalIcon w={7} h={7} />
                    </Box>
                    <BigNumberTextV2
                        value={productionInterval}
                        unit="duration"
                        componentStyle="ctaChevron"
                    >
                        <HStack>
                            <Text>Production Interval</Text>
                            <Tooltip
                                label={`Average interval between the last ${Math.min(
                                    10,
                                    totalBlocks
                                )} blocks produced by the pool`}
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
                        <ChevronRightIcon w={5} h={5} role="location-icon" />
                    )}
                </HStack>
            </Box>
        </ConditionalWrapper>
    );
};

export default ProductionIntervalStat;
