// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FaChevronRight, FaRegQuestionCircle } from 'react-icons/fa';
import { Box, HStack, Icon, StackProps, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import { StakingPoolFee } from '../../../graphql/models';
import BigNumberTextV2 from '../../BigNumberTextV2';
import CommissionTextV2 from '../../CommissionTextV2';
import ConditionalWrapper from '../../ConditionalWrapper';
import { PoolCommisionIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';

export interface CommissionStatProps extends StackProps {
    commissionPercentage: number;
    fee: StakingPoolFee;
    location?: string;
}

const CommissionStat: FC<CommissionStatProps> = (props) => {
    const { commissionPercentage, fee, location } = props;
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
                            as={PoolCommisionIcon}
                            color={iconColor}
                            w={7}
                            h={7}
                        />
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
                                    showArrow
                                    content="Effective commission taken by pool manager"
                                    positioning={{
                                        placement: 'top',
                                    }}
                                    openDelay={0}
                                    contentProps={{
                                        fontSize: 'small',
                                    }}
                                >
                                    <Icon
                                        as={FaRegQuestionCircle}
                                        w={3.5}
                                        h={3.5}
                                    />
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
                                    showArrow
                                    content="Configured commission taken by pool manager"
                                    positioning={{
                                        placement: 'top',
                                    }}
                                    openDelay={0}
                                    contentProps={{
                                        fontSize: 'small',
                                    }}
                                >
                                    <Icon
                                        as={FaRegQuestionCircle}
                                        w={3.5}
                                        h={3.5}
                                    />
                                </Tooltip>
                            </HStack>
                        </CommissionTextV2>
                    )}

                    {location && (
                        <Icon
                            as={FaChevronRight}
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

export default CommissionStat;
