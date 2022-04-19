// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Box, BoxProps, Button, HStack, Text } from '@chakra-ui/react';
import { UnsupportedNetworkError, UseWallet } from '../../contexts/wallet';

interface ConnectWallet extends BoxProps {
    wallet: UseWallet;
}

const ConnectWallet: FC<ConnectWallet> = (props) => {
    const { wallet, ...boxProps } = props;
    const { activate, error, active } = wallet;

    const isUnsupportNetworkError = error instanceof UnsupportedNetworkError;

    return (
        <Box {...boxProps}>
            {isUnsupportNetworkError && (
                <Button size="md" bg="red" _hover={{ bg: 'darkred' }}>
                    <HStack>
                        <Text>Unsupported Network</Text>
                    </HStack>
                </Button>
            )}
            {!active && !isUnsupportNetworkError && (
                <Button size="md" colorScheme="blue" onClick={() => activate()}>
                    <HStack>
                        <Text>Connect To Wallet</Text>
                    </HStack>
                </Button>
            )}
        </Box>
    );
};

export default ConnectWallet;
