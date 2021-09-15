// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect } from 'react';
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { InjectedConnector } from '@web3-react/injected-connector';
import { networks } from '../../utils/networks';

const ConnectMetamask: FC = () => {
    const { activate, deactivate, error, active } =
        useWeb3React<Web3Provider>();
    const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
    const hasMetaMask = MetaMaskOnboarding.isMetaMaskInstalled();

    useEffect(() => {
        if (window?.ethereum?.selectedAddress) {
            connectNetwork();
        }
    }, []);

    const connectNetwork = () => {
        const supportedChainIds = Object.keys(networks).map((key) =>
            parseInt(key)
        );
        const connector = new InjectedConnector({ supportedChainIds });
        activate(connector);
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (!accounts || accounts.length == 0) {
                    deactivate();
                }
            });
        }
    };

    return (
        <Box>
            {isUnsupportedChainIdError && (
                <Button size="md" bg="red" _hover={{ bg: 'darkred' }}>
                    <HStack>
                        <Image src="/images/metamask-fox.svg" boxSize="25px" />
                        <Text>Unsupported Network</Text>
                    </HStack>
                </Button>
            )}
            {!active && !isUnsupportedChainIdError && (
                <Button
                    size="md"
                    onClick={connectNetwork}
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
