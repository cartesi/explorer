// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Flex, HStack, Text, TextProps } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import { StakingPool } from '../../graphql/models';
import Address from '../Address';

export interface PoolIdProps extends TextProps {
    chainId: number;
    pool: StakingPool;
}

const PoolId: FC<PoolIdProps> = (props) => {
    const { chainId, pool, ...textProps } = props;

    return (
        <Flex align="baseline" justify="space-between" direction="column">
            <HStack>
                <FaUsers />
                <Text {...textProps}>Staking Pool</Text>
            </HStack>
            <HStack align="baseline">
                {pool && (
                    <Address
                        address={pool.id}
                        chainId={chainId}
                        ens
                        truncated
                        fontSize="xx-large"
                    />
                )}
            </HStack>
        </Flex>
    );
};

export default PoolId;
