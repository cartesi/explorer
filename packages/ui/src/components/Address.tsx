// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Button,
    HStack,
    IconProps,
    Image,
    Link,
    Text,
    TextProps,
    useBreakpointValue,
    useClipboard,
    useColorModeValue,
    useMediaQuery,
} from '@chakra-ui/react';
import { useENS } from '@explorer/services';
import { etherscanLinks, Network, truncateString } from '@explorer/utils';
import React, { FC, useState } from 'react';
import { StakeCircledIcon } from './Icons';

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
        fontSize,
        ...restProps
    } = props;

    // resolve ENS entry from address
    const addressEnsInfo = useENS(address);
    const ensEntry = ens ? addressEnsInfo : null;

    const { hasCopied, onCopy } = useClipboard(address);
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
    const [isLargerThan555] = useMediaQuery('(min-width: 555px)');
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

            {showActions && !hasCopied && (
                <Button
                    variant="ghost"
                    display="flex"
                    p={0}
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
                    onClick={onCopy}
                    data-testid="copy-icon"
                >
                    <CopyIcon fontSize={fontSize} w={iconSize} h={iconSize} />
                </Button>
            )}
            {hasCopied && <Text fontSize="sm">Copied</Text>}
            {showActions && externalLink && (
                <Link
                    href={externalLink}
                    display="flex"
                    isExternal
                    title="External link"
                    _hover={{
                        color: hoverIconColor,
                    }}
                >
                    <ExternalLinkIcon
                        fontSize={fontSize}
                        data-testid="external-link-icon"
                        mr={linkMargin}
                        w={iconSize}
                        h={iconSize}
                    />
                </Link>
            )}
        </HStack>
    );
};

export default Address;
