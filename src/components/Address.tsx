// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent, useState } from 'react';
import {
    HStack,
    Image,
    Link,
    Text,
    TextProps,
    useBreakpointValue,
    useClipboard,
    useMediaQuery,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import { etherscanLinks } from '../utils/networks';
import { truncateString } from '../utils/stringUtils';
import { useENS } from '../services/ens';

export type AddressType = 'tx' | 'address' | 'contract' | 'token';

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
}

const Address: FunctionComponent<AddressProps> = (props) => {
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
        ...textProps
    } = props;

    // resolve ENS entry from address
    const ensEntry = ens && useENS(address);

    const { hasCopied, onCopy } = useClipboard(address);
    const [hover, setHover] = useState(false);

    // truncate if screen is 'small'
    const responsiveTruncate = useBreakpointValue({
        base: true,
        md: true,
        lg: true,
        xl: false,
    });

    const [isLargerThan555] = useMediaQuery('(min-width: 555px)');

    const label =
        (isLargerThan555 ? ensEntry?.name : truncateString(ensEntry?.name)) ||
        (truncated || (responsive && responsiveTruncate)
            ? truncateString(address)
            : address);

    // hide or show action buttons
    const showActions = (!hideActions || hover) && !noActions;

    // build etherscan link
    const externalLink = etherscanLinks[chainId]
        ? `${etherscanLinks[chainId]}/${type}/${address}`
        : undefined;

    return (
        <HStack
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {ensEntry?.avatar && (
                <Image
                    src={ensEntry.avatar}
                    boxSize="42px"
                    objectFit="contain"
                />
            )}
            {name && <Text>{name}</Text>}
            <Text {...textProps}>{label}</Text>
            {showActions && !hasCopied && (
                <Link color={textProps?.color}>
                    <CopyIcon onClick={onCopy} fontSize={textProps.fontSize} />
                </Link>
            )}
            {hasCopied && (
                <Text fontSize="sm" color={textProps?.color}>
                    Copied
                </Text>
            )}
            {showActions && externalLink && (
                <Link href={externalLink} color={textProps?.color} isExternal>
                    <ExternalLinkIcon fontSize={textProps.fontSize} />
                </Link>
            )}
        </HStack>
    );
};

export default Address;
