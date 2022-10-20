// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useWallet } from '../contexts/wallet';
import React, { ReactNode } from 'react';
import {
    Box,
    Container,
    Stack,
    SimpleGrid,
    Text,
    Link,
    VisuallyHidden,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    useCartesiTokenContract,
    useSimpleFaucetContract,
    usePoSContract,
    useStakingContract,
    useStakingPoolFactoryContract,
    useWorkerManagerContract,
} from '../services/contracts';
import Address from './Address';

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight="500" fontSize="lg" mb={2}>
            {children}
        </Text>
    );
};

const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const Footer = () => {
    const { chainId } = useWallet();

    const pos = usePoSContract();
    const token = useCartesiTokenContract();
    const faucet = useSimpleFaucetContract();
    const staking = useStakingContract();
    const workerManager = useWorkerManagerContract();
    const poolFactory = useStakingPoolFactoryContract();

    const links = [
        {
            label: 'Audit Report',
            href: 'https://github.com/cartesi/pos-dlib/raw/develop/Smart%20Contract%20Security%20Audit%20Report%20-%20Staking.pdf',
        },
        {
            label: 'CTSI Reserve Mining',
            href: 'https://cartesi.io/en/mine/',
        },
        {
            label: 'How to Run a Node',
            href: 'https://medium.com/cartesi/running-a-node-and-staking-42523863970e',
        },
        {
            label: 'FAQ',
            href: 'https://github.com/cartesi/noether/wiki/FAQ',
        },
    ];

    const contracts = [
        {
            name: 'Token',
            address: token?.address,
        },
        {
            name: 'Faucet',
            address: faucet?.address,
        },
        {
            name: 'PoS',
            address: pos?.address,
        },
        {
            name: 'Staking',
            address: staking?.address,
        },
        {
            name: 'Worker Manager',
            address: workerManager?.address,
        },
        {
            name: 'Pool Factory',
            address: poolFactory?.address,
        },
    ];

    return (
        <Box bg="gray.900" color="white" w="100%" p="0 6vw" mt="auto">
            <Container as={Stack} maxW={'100%'} py={10}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                    <Stack align="flex-start">
                        <ListHeader>Resources</ListHeader>
                        {links.map(({ label, href }, index) => (
                            <Link href={href} key={index} isExternal>
                                {label}
                                <ExternalLinkIcon mx="4px" />
                            </Link>
                        ))}
                    </Stack>

                    <Stack align="flex-start">
                        <ListHeader>Contracts</ListHeader>
                        {contracts
                            .filter(({ address }) => address)
                            .map(({ name, address }, index) => (
                                <Address
                                    address={address}
                                    name={name}
                                    key={index}
                                    chainId={chainId}
                                    truncated
                                />
                            ))}
                    </Stack>
                </SimpleGrid>
            </Container>

            <Box
                borderTopWidth={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
                <Container
                    as={Stack}
                    maxW={'100%'}
                    py={4}
                    direction={{ base: 'column', md: 'row' }}
                    spacing={4}
                    justify={{ md: 'space-between' }}
                    align={{ md: 'center' }}
                >
                    <Text>© 2021 Cartesi Pte. Ltd. All rights reserved</Text>
                    <Stack direction={'row'} spacing={6}>
                        <SocialButton
                            label={'Twitter'}
                            href="http://twitter.com/cartesiproject"
                        >
                            <FaTwitter />
                        </SocialButton>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default Footer;
