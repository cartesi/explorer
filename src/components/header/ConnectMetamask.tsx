// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Box, BoxProps, Button, HStack, Image, Text } from '@chakra-ui/react';
import { UnsupportedChainIdError } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { connector, useWeb3Connection } from '../../contexts/Web3Connection';
import { UseWallet } from '../../contexts/wallet';

interface Props extends BoxProps {
    wallet: UseWallet;
}

const ConnectMetamask: FC<Props> = (props) => {
    const { wallet, ...boxProps } = props;
    const { activate, error, active } = wallet;

    const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;

    // onboarding process with metamask installation support
    const hasMetaMask = MetaMaskOnboarding.isMetaMaskInstalled();
    const onboarding = new MetaMaskOnboarding();

    // eager connection to metamaks (on page load)
    const web3Connection = useWeb3Connection();

    return (
        <Box {...boxProps}>
            {isUnsupportedChainIdError && (
                <Button size="md" bg="red" _hover={{ bg: 'darkred' }}>
                    <HStack>
                        <Image src="/images/metamask-fox.svg" boxSize="25px" />
                        <Text>Unsupported Network</Text>
                    </HStack>
                </Button>
            )}
            {!active && !isUnsupportedChainIdError && web3Connection.tried && (
                <Button
                    size="md"
                    onClick={
                        hasMetaMask
                            ? () => activate(connector)
                            : onboarding.startOnboarding
                    }
                    bg="#007bff"
                    _hover={{ bg: '#005fc4' }}
                >
                    <HStack>
                        <Image src="/images/metamask-fox.svg" boxSize="25px" />
                        <Text>
                            {hasMetaMask
                                ? 'Connect To Wallet'
                                : 'Install MetaMask'}
                        </Text>
                    </HStack>
                </Button>
            )}
        </Box>
    );
};

export default ConnectMetamask;
