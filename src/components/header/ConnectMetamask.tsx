// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import MetaMaskOnboarding from '@metamask/onboarding';
import { InjectedConnector } from '@web3-react/injected-connector';
import { networks } from '../../utils/networks';

const connector = new InjectedConnector({
    supportedChainIds: Object.keys(networks).map((key) => parseInt(key)),
});

const useEagerConnect = () => {
    const { activate, active } = useWeb3React();
    const [tried, setTried] = useState(false);

    useEffect(() => {
        console.log('connecting to metamask...');
        connector.isAuthorized().then((isAuthorized: boolean) => {
            if (isAuthorized) {
                activate(connector, undefined, true).catch((e) => {
                    console.error('failed connecting to metamask', e);
                    setTried(true);
                });
            } else {
                setTried(true);
                console.error('metamask not authorized');
            }
        });
    }, []); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
};

const useInactiveListener = (suppress = false) => {
    const { active, error, activate } = useWeb3React();

    useEffect((): any => {
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                console.log("Handling 'connect' event");
                activate(connector);
            };
            const handleChainChanged = (chainId: string | number) => {
                console.log(
                    "Handling 'chainChanged' event with payload",
                    chainId
                );
                activate(connector);
            };
            const handleAccountsChanged = (accounts: string[]) => {
                console.log(
                    "Handling 'accountsChanged' event with payload",
                    accounts
                );
                if (accounts.length > 0) {
                    activate(connector);
                }
            };
            const handleNetworkChanged = (networkId: string | number) => {
                console.log(
                    "Handling 'networkChanged' event with payload",
                    networkId
                );
                activate(connector);
            };

            ethereum.on('connect', handleConnect);
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('networkChanged', handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener(
                        'accountsChanged',
                        handleAccountsChanged
                    );
                    ethereum.removeListener(
                        'networkChanged',
                        handleNetworkChanged
                    );
                }
            };
        }
    }, [active, error, suppress, activate]);
};

const ConnectMetamask: FC = () => {
    const { activate, error, active } = useWeb3React<Web3Provider>();

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager);

    const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
    const hasMetaMask = MetaMaskOnboarding.isMetaMaskInstalled();
    const onboarding = new MetaMaskOnboarding();

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
            {!active && !isUnsupportedChainIdError && triedEager && (
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
