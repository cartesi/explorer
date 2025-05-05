// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    HStack,
    Icon,
    IconProps,
    Image,
    Link,
    Text,
    TextProps,
    useBreakpointValue,
    useClipboard,
    useMediaQuery,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { MdOutlineContentCopy } from 'react-icons/md';
import React, { FC, useState } from 'react';
import { useENS } from '../services/ens';
import { etherscanLinks, Network } from '../utils/networks';
import { truncateString } from '../utils/stringUtils';
import { StakeCircledIcon } from './Icons';
import { useColorModeValue } from './ui/color-mode';

export type AddressType = 'tx' | 'address' | 'contract' | 'token';

type ObjectValues<T> = T[keyof T];
type ChainId = ObjectValues<typeof Network>;

export interface AddressProps extends TextProps {
    address: string;
    name?: string;
    chainId?: number;
    type?: AddressType;
    ens?: boolean;
    truncated?: boolean;
    responsive?: boolean;
    hideActions?: boolean;
    noActions?: boolean;
    shouldDisplayFallbackAvatar?: boolean;
    fallbackAvatar?: FC<IconProps>;
    iconColor?: string;
    renderLabel?: (label: React.ReactNode) => React.ReactNode;
}

const Address: FC<AddressProps> = (props) => {
    const {
        address,
        name,
        chainId = 1,
        type = 'address',
        ens,
        truncated = false,
        responsive = false,
        hideActions = false,
        noActions = false,
        shouldDisplayFallbackAvatar = false,
        fallbackAvatar,
        renderLabel = (children) => <>{children}</>,
        color,
        iconColor,
        fontSize = '1rem',
        ...restProps
    } = props;

    // resolve ENS entry from address
    const withEns = ens === true;
    const addressEnsInfo = useENS(address, { enabled: withEns });
    const ensEntry = ens ? addressEnsInfo : null;

    const { copied, copy } = useClipboard({ value: address });
    const [hover, setHover] = useState(false);
    const [hasAvatarError, setAvatarError] = useState<boolean>(false);
    const FallbackAvatar = fallbackAvatar || StakeCircledIcon;

    // truncate if screen is 'small'
    const responsiveTruncate = useBreakpointValue({
        base: true,
        md: true,
        lg: true,
        xl: false,
    });
    const linkMargin = useBreakpointValue({ base: 7, sm: 0 });
    const iconSize = useBreakpointValue({ base: '1.688rem', sm: 5 });
    const [isLargerThan555] = useMediaQuery(['(min-width: 555px)']);
    const hoverIconColor = useColorModeValue('light.primary', 'dark.primary');

    const label =
        (isLargerThan555
            ? ensEntry?.name
            : truncateString(ensEntry?.name ?? '')) ||
        (truncated || (responsive && responsiveTruncate)
            ? truncateString(address)
            : address);

    // hide or show action buttons
    const showActions = (!hideActions || hover) && !noActions;

    // build etherscan link
    const externalLink = etherscanLinks[chainId as ChainId]
        ? `${etherscanLinks[chainId as ChainId]}/${type}/${address}`
        : undefined;

    return (
        <HStack
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            data-testid="address"
        >
            {ensEntry?.avatar && !hasAvatarError ? (
                <Image
                    src={ensEntry.avatar}
                    boxSize="42px"
                    objectFit="contain"
                    alt={`${ensEntry.name} avatar`}
                    onError={() => setAvatarError(true)}
                />
            ) : (
                shouldDisplayFallbackAvatar && (
                    <FallbackAvatar
                        width="42px"
                        height="42px"
                        data-testid="fallback-avatar"
                    />
                )
            )}
            {name && <Text>{name}</Text>}

            {renderLabel(
                <Text
                    color={color}
                    fontSize={fontSize}
                    lineHeight={1}
                    {...restProps}
                >
                    {label}
                </Text>
            )}

            {showActions && !copied && (
                <Button
                    variant="ghost"
                    display="flex"
                    p={0}
                    color={iconColor ? iconColor : undefined}
                    _hover={{
                        background: 'transparent',
                        color: hoverIconColor,
                    }}
                    _focus={{
                        background: 'transparent',
                        color: 'blue.400',
                    }}
                    _active={{
                        background: 'transparent',
                        color: 'blue.400',
                    }}
                    minW="auto"
                    h="auto"
                    title="Copy"
                    onClick={copy}
                    data-testid="copy-icon"
                >
                    <Icon as={MdOutlineContentCopy} w={iconSize} h={iconSize} />
                </Button>
            )}
            {copied && <Text fontSize="sm">Copied</Text>}
            {showActions && externalLink && (
                <Link
                    href={externalLink}
                    display="flex"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="External link"
                    color={iconColor ? iconColor : undefined}
                    _hover={{
                        color: hoverIconColor,
                    }}
                    mr={linkMargin}
                >
                    <Icon
                        as={FaExternalLinkAlt}
                        data-testid="external-link-icon"
                        w={iconSize}
                        h={iconSize}
                    />
                </Link>
            )}
        </HStack>
    );
};

export default Address;
