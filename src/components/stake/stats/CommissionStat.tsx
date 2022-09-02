// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, ReactChild, ReactFragment } from 'react';
import { PoolCommisionIcon } from '../../Icons';
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
import CommissionTextV2 from '../../CommissionTextV2';
import { StakingPoolFee } from '../../../graphql/models';
import ConditionalWrapper from '../../../components/ConditionalWrapper';

export interface CommissionStatProps extends StackProps {
    commissionPercentage: number;
    fee: StakingPoolFee;
    location?: string;
}

const CommissionStat: FC<CommissionStatProps> = (props) => {
    const { commissionPercentage, fee, location } = props;

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
                        <PoolCommisionIcon w={7} h={7} />
                    </Box>

                    {commissionPercentage ? (
                        <BigNumberTextV2
                            value={commissionPercentage}
                            unit="percent"
                            componentStyle="ctaChevron"
                        >
                            <HStack>
                                <Text role="big-number-text">Commission</Text>
                                <Tooltip
                                    label="Effective commission taken by pool manager"
                                    placement="top"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon w="14px" h="14px" />
                                </Tooltip>
                            </HStack>
                        </BigNumberTextV2>
                    ) : (
                        <CommissionTextV2
                            value={fee}
                            componentStyle="ctaChevron"
                        >
                            <HStack>
                                <Text role="commission-text">Commission</Text>
                                <Tooltip
                                    label="Configured commission taken by pool manager"
                                    placement="top"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon w="14px" h="14px" />
                                </Tooltip>
                            </HStack>
                        </CommissionTextV2>
                    )}

                    {location && (
                        <ChevronRightIcon w={5} h={5} role="location-icon" />
                    )}
                </HStack>
            </Box>
        </ConditionalWrapper>
    );
};

export default CommissionStat;
