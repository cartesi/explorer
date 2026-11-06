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
    Icon,
    Link,
    Stack,
    Text,
    VisuallyHidden,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { IconType } from 'react-icons';
import {
    TbBrandDiscordFilled,
    TbBrandGithubFilled,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandReddit,
    TbBrandTelegram,
    TbBrandTiktok,
    TbBrandX,
    TbBrandYoutubeFilled,
} from 'react-icons/tb';
import theme from '../styles/theme';
import Address from './Address';
import { CartesiBlack } from './Icons';
import { useWallet } from './wallet/useWallet';
import { useColorModeValue } from './ui/color-mode';

const linkHoverColor = 'dark.primary';

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text
            fontFamily={theme.tokens.getVar('fonts.heading')}
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
        <Link
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded="full"
            w={8}
            h={8}
            cursor="pointer"
            as="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
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
        </Link>
    );
};

export type FooterLink = { label: string; href: string };
export type FooterContract = { name: string; address?: string };

const LinkColumn = ({
    title,
    links,
}: {
    title: string;
    links: FooterLink[];
}) => (
    <GridItem>
        <ListHeader>{title}</ListHeader>
        <Flex direction="column" marginTop={4} gap={2}>
            {links.map(({ label, href }) => (
                <Link
                    href={href}
                    key={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="white"
                    _hover={{ color: linkHoverColor }}
                >
                    {label}
                </Link>
            ))}
        </Flex>
    </GridItem>
);

/** Community channels, in the order cartesi.io lists them. */
export const socialLinks: (FooterLink & { icon: IconType })[] = [
    {
        label: 'Discord',
        href: 'https://discord.gg/pfXMwXDDfW',
        icon: TbBrandDiscordFilled,
    },
    {
        label: 'GitHub',
        href: 'https://github.com/cartesi',
        icon: TbBrandGithubFilled,
    },
    {
        label: 'Telegram',
        href: 'https://t.me/CartesiProject',
        icon: TbBrandTelegram,
    },
    {
        label: 'X',
        href: 'https://www.twitter.com/cartesiproject',
        icon: TbBrandX,
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/@Cartesiproject/featured',
        icon: TbBrandYoutubeFilled,
    },
    {
        label: 'Reddit',
        href: 'https://www.reddit.com/r/cartesi/',
        icon: TbBrandReddit,
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/cartesi/',
        icon: TbBrandLinkedin,
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/cartesiproject/',
        icon: TbBrandInstagram,
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@cartesiproject',
        icon: TbBrandTiktok,
    },
];

export type FooterProps = {
    links: FooterLink[];
    support: FooterLink[];
    general: FooterLink[];
    contracts: FooterContract[];
};

const Footer: FC<FooterProps> = (props) => {
    const { links = [], support = [], general = [], contracts = [] } = props;
    const { chainId } = useWallet();

    return (
        <Box bg="footerBg" color="white" w="100%" p="0 6vw" mt="auto">
            <Container as={Stack} maxW={'100%'} py={10} px={4}>
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(4, auto)',
                    }}
                    justifyContent="space-between"
                    gap={6}
                >
                    <LinkColumn title="Resources & Security" links={links} />
                    <LinkColumn title="Support Center" links={support} />
                    <LinkColumn title="General" links={general} />
                    <GridItem>
                        <ListHeader>Contracts</ListHeader>
                        {contracts
                            .filter(({ address }) => address)
                            .map(({ name, address }) => (
                                <Box mt={4} mb="-2" key={name}>
                                    <Address
                                        address={address ?? ''}
                                        name={name}
                                        chainId={chainId}
                                        truncated
                                        iconColor="white"
                                    />
                                </Box>
                            ))}
                    </GridItem>
                </Grid>
            </Container>

            <Flex wrap="wrap" gap={4} px={4}>
                <SocialButton label="Cartesi" href="https://cartesi.io/">
                    <Icon as={CartesiBlack} color="white" w={5} h={5} />
                </SocialButton>
                {socialLinks.map(({ label, href, icon }) => (
                    <SocialButton key={label} label={label} href={href}>
                        <Icon as={icon} color="white" w={6} h={6} />
                    </SocialButton>
                ))}
            </Flex>
            <Box py={4} px={4}>
                <Text opacity={0.6}>
                    © {new Date().getFullYear()} The Cartesi Foundation.
                </Text>
            </Box>
        </Box>
    );
};

export default Footer;
