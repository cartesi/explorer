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
import { PoolBalanceIcon } from '../../Icons';
import {
    HStack,
    VStack,
    Box,
    StackProps,
    Icon,
    Tooltip,
    Text,
} from '@chakra-ui/react';
import BigNumberTextV2 from '../../BigNumberTextV2';

export interface PoolBalanceStatProps extends StackProps {
    pool: BigNumber;
}

const PoolBalanceStat: FC<PoolBalanceStatProps> = (props) => {
    const { pool } = props;

    return (
        <VStack align="flex-start" flexBasis={{ base: '100%', lg: '33.33%' }}>
            <HStack spacing={4} align="center" p={4}>
                <Box
                    bg="yellow.100"
                    w={14}
                    h={14}
                    borderRadius="full"
                    display="grid"
                    placeContent="center"
                    flexShrink={0}
                >
                    <PoolBalanceIcon color="yellow.500" w={7} h={7} />
                </Box>
                <BigNumberTextV2
                    unit="ctsi"
                    value={pool}
                    options={{
                        notation: 'compact',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }}
                >
                    <HStack>
                        <Text>Pool Balance</Text>
                        <Tooltip
                            label="Amount of tokens available at the pool contract either for stake or withdraw"
                            placement="top"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon role="balance-icon" w={3.5} h={3.5} />
                        </Tooltip>
                    </HStack>
                </BigNumberTextV2>
            </HStack>
        </VStack>
    );
};

export default PoolBalanceStat;
