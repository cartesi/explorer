// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Container,
    Flex,
    Grid,
    GridItem,
    Link,
    SimpleGrid,
    Stack,
    Text,
    VisuallyHidden,
    chakra,
    useColorModeValue,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { FaDiscord, FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';
import theme from '../styles/theme';
import Address from './Address';
import { CartesiTranparent } from './Icons';
import { useWallet } from './wallet/useWallet';

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text
            fontFamily={theme.fonts.heading}
            fontWeight="600"
            fontSize="lg"
            mb={2}
        >
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
            rounded="full"
            w={8}
            h={8}
            cursor="pointer"
            as="a"
            href={href}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            transition="background 0.3s ease"
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

export type FooterLink = { label: string; href: string };
export type FooterContract = { name: string; address?: string };

export type FooterProps = {
    links: FooterLink[];
    support: FooterLink[];
    general: FooterLink[];
    contracts: FooterContract[];
};

const Footer: FC<FooterProps> = (props) => {
    const { links = [], support = [], general = [], contracts = [] } = props;
    const { chainId } = useWallet();
    const linkHoverColor = 'dark.primary';

    return (
        <Box bg="footerBg" color="white" w="100%" p="0 6vw" mt="auto">
            <Container as={Stack} maxW={'100%'} py={10}>
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(12, minmax(0, 1fr))',
                    }}
                    gap={6}
                >
                    <GridItem colSpan={2}>
                        <ListHeader>Resources & Security</ListHeader>
                        <Flex direction="column" marginTop={4} gap={2}>
                            {links.map(({ label, href }, index) => (
                                <Link
                                    href={href}
                                    key={index}
                                    isExternal
                                    _hover={{ color: linkHoverColor }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </Flex>
                    </GridItem>

                    <GridItem colSpan={4} pl={{ base: 0, lg: 4 }}>
                        <ListHeader>Support Center</ListHeader>
                        <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing={2}
                            marginTop={4}
                        >
                            {support.map(({ label, href }, index) => (
                                <Link
                                    href={href}
                                    key={index}
                                    isExternal
                                    _hover={{ color: linkHoverColor }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </SimpleGrid>
                    </GridItem>
                    <GridItem colSpan={{ base: 4, lg: 3 }}>
                        <ListHeader>Contracts</ListHeader>
                        {contracts
                            .filter(({ address }) => address)
                            .map(({ name, address }, index) => (
                                <Box mt={4} mb="-2" key={index}>
                                    <Address
                                        address={address ?? ''}
                                        name={name}
                                        key={index}
                                        chainId={chainId}
                                        truncated
                                    />
                                </Box>
                            ))}
                    </GridItem>
                    <Stack align="flex-start">
                        <ListHeader>General</ListHeader>
                        {general.map(({ label, href }, index) => (
                            <Link
                                href={href}
                                key={index}
                                isExternal
                                _hover={{ color: linkHoverColor }}
                            >
                                {label}
                            </Link>
                        ))}
                    </Stack>
                </Grid>
            </Container>

            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    lg: 'repeat(12, minmax(0, 1fr))',
                }}
                gap={4}
            >
                <GridItem colStart={10} colEnd={-1}>
                    <Stack direction={'row'} spacing={6}>
                        <SocialButton
                            label="Cartesi"
                            href="https://cartesi.io/"
                        >
                            <CartesiTranparent />
                        </SocialButton>
                        <SocialButton
                            label="Github"
                            href="https://github.com/cartesi"
                        >
                            <FaGithub size={24} />
                        </SocialButton>
                        <SocialButton
                            label="Discord"
                            href="https://discord.gg/pfXMwXDDfW"
                        >
                            <FaDiscord size={24} />
                        </SocialButton>
                        <SocialButton
                            label="Youtube"
                            href="https://www.youtube.com/@cartesiproject/featured"
                        >
                            <FaYoutube size={24} />
                        </SocialButton>
                        <SocialButton
                            label="Twitter"
                            href="https://twitter.com/cartesiproject"
                        >
                            <FaTwitter size={24} />
                        </SocialButton>
                    </Stack>
                </GridItem>
            </Grid>
            <Box py={4}>
                <Text opacity={0.6}>
                    (c) Cartesi and individual authors (see{' '}
                    <Link
                        href="https://github.com/cartesi/explorer/blob/main/AUTHORS"
                        isExternal
                        _hover={{
                            color: linkHoverColor,
                        }}
                    >
                        AUTHORS
                    </Link>
                    )
                    <br />
                    SPDX-License-Identifier: Apache-2.0 (see{' '}
                    <Link
                        href="https://github.com/cartesi/explorer/blob/main/LICENSE"
                        isExternal
                        _hover={{
                            color: linkHoverColor,
                        }}
                    >
                        LICENSE
                    </Link>
                    )
                </Text>
            </Box>
        </Box>
    );
};

export default Footer;
