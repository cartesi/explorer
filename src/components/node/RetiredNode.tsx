// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Alert, AlertIcon, HStack, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import BigNumberText from '../BigNumberText';
import AddressText from '../AddressText';
import { FaCoins, FaNetworkWired } from 'react-icons/fa';

type RetiredNodeProps = {
    chainId: number;
    user: string; // node user
    balance: BigNumber; // node balance
};

const RetiredNode: FC<RetiredNodeProps> = ({ chainId, user, balance }) => {
    return (
        <HStack p={10} spacing={10}>
            <AddressText address={user} chainId={chainId} icon={FaNetworkWired}>
                <Text>Node Owner</Text>
            </AddressText>
            <BigNumberText value={balance} unit="eth" icon={FaCoins}>
                <Text>Node Balance</Text>
            </BigNumberText>
            <Alert status="info" maxW={200}>
                <AlertIcon />
                <Text>This node is retired</Text>
            </Alert>
        </HStack>
    );
};

export default RetiredNode;
