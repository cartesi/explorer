// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import BigNumberText from '../BigNumberText';
import AddressText from '../AddressText';
import { FaCoins, FaNetworkWired } from 'react-icons/fa';

type PendingNodeProps = {
    account: string; // metamask account (or pool)
    chainId: number;
    user: string; // node user
    balance: BigNumber; // node balance
    onCancelHire: () => void;
};

const PendingNode: FC<PendingNodeProps> = ({
    account,
    chainId,
    user,
    balance,
    onCancelHire,
}) => {
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
                {account.toLowerCase() === user.toLowerCase() && (
                    <Button
                        onClick={onCancelHire}
                        colorScheme="blue"
                        isFullWidth
                    >
                        Cancel Hire
                    </Button>
                )}
            </HStack>
        </VStack>
    );
};

export default PendingNode;
