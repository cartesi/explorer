// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Alert,
    AlertIcon,
    HStack,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { AddressText, BigNumberText } from '@explorer/ui';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { FaCoins, FaNetworkWired } from 'react-icons/fa';

type RetiredNodeProps = {
    chainId: number;
    user: string; // node user
    balance: BigNumber; // node balance
};

const RetiredNode: FC<RetiredNodeProps> = ({ chainId, user, balance }) => {
    return (
        <VStack align="stretch">
            <Stack
                direction={['column', 'column', 'row', 'row']}
                spacing={[4, 4, 8, 8]}
                align={[undefined, undefined, 'center', 'center']}
            >
                <AddressText
                    address={user}
                    chainId={chainId}
                    icon={FaNetworkWired}
                >
                    <Text>Node Owner</Text>
                </AddressText>
                <BigNumberText value={balance} unit="eth" icon={FaCoins}>
                    <Text>Node Balance</Text>
                </BigNumberText>
            </Stack>
            <HStack>
                <Alert status="warning">
                    <AlertIcon />
                    <Text>This node is retired</Text>
                </Alert>
            </HStack>
        </VStack>
    );
};

export default RetiredNode;
