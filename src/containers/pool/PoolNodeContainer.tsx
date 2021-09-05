// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { VStack } from '@chakra-ui/layout';

import { useStakingPool } from '../../services/pool';
import NodeContainer from '../NodeContainer';
import TransactionFeedback from '../../components/TransactionFeedback';

export interface PoolNodeContainerProps {
    address: string;
}

const PoolNodeContainer: FC<PoolNodeContainerProps> = (props) => {
    const { account } = useWeb3React<Web3Provider>();
    const { address } = props;

    const pool = useStakingPool(address, account);

    return (
        <VStack>
            <TransactionFeedback transaction={pool?.transaction} />
            <NodeContainer
                user={address}
                onHire={pool.hire}
                onCancelHire={pool.cancelHire}
                onRetire={pool.retire}
            />
        </VStack>
    );
};

export default PoolNodeContainer;
