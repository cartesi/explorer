// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, BoxProps, Button, HStack, Text } from '@chakra-ui/react';
import { UnsupportedNetworkError, UseWallet } from '@explorer/wallet';
import { FC } from 'react';

export interface ConnectWalletProps extends BoxProps {
    wallet: UseWallet;
}

export const ConnectWallet: FC<ConnectWalletProps> = (props) => {
    const { wallet, ...boxProps } = props;
    const { activate, error, active } = wallet;
    const isUnsupportedNetworkError = error instanceof UnsupportedNetworkError;

    return (
        <Box {...boxProps}>
            {isUnsupportedNetworkError ? (
                <Button size="md" bg="red" _hover={{ bg: 'darkred' }}>
                    <HStack>
                        <Text>Unsupported Network</Text>
                    </HStack>
                </Button>
            ) : (
                !active && (
                    <Button
                        size="md"
                        colorScheme="cyan"
                        onClick={activate}
                        _hover={{
                            bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.40) 100%), #00F6FF',
                        }}
                    >
                        <HStack>
                            <Text
                                fontSize="sm"
                                color={'dark.gray.primary'}
                                textTransform={'uppercase'}
                                fontWeight={'600'}
                            >
                                Connect To Wallet
                            </Text>
                        </HStack>
                    </Button>
                )
            )}
        </Box>
    );
};
