// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber } from 'ethers';
import { StakedBalanceIcon } from '@explorer/ui';
import {
    HStack,
    VStack,
    Box,
    StackProps,
    Icon,
    Tooltip,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import BigNumberTextV2 from '../../BigNumberTextV2';

export interface StakedBalanceStatProps extends StackProps {
    stakedBalance: BigNumber;
}

const StakedBalanceStat: FC<StakedBalanceStatProps> = (props) => {
    const { stakedBalance } = props;
    const iconBackgroundColor = useColorModeValue('orange.50', 'transparent');
    const iconColor = useColorModeValue(
        'light.support.attention',
        'dark.primary'
    );

    return (
        <VStack
            align="flex-start"
            flexBasis={{ base: '100%', lg: '33.33%' }}
            flexShrink={0}
        >
            <HStack spacing={4} align="center" p={4}>
                <Box
                    bg={iconBackgroundColor}
                    w={14}
                    h={14}
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                    flexShrink={0}
                >
                    <StakedBalanceIcon color={iconColor} w={7} h={7} />
                </Box>
                <BigNumberTextV2
                    unit="ctsi"
                    value={stakedBalance}
                    options={{
                        notation: 'compact',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }}
                >
                    <HStack>
                        <Text>Staked Balance</Text>
                        <Tooltip
                            label="Total amount of tokens staked in this pool"
                            placement="top"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon
                                color="gray.500"
                                role="balance-icon"
                                w={3.5}
                                h={3.5}
                            />
                        </Tooltip>
                    </HStack>
                </BigNumberTextV2>
            </HStack>
        </VStack>
    );
};

export default StakedBalanceStat;
