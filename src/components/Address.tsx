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
        ...textProps
    } = props;

    // resolve ENS entry from address
    const ensEntry = ens && useENS(address);

    const { hasCopied, onCopy } = useClipboard(address);
    const [hover, setHover] = useState(false);

    // truncate if screen is 'small'
    const responsiveTruncate = useBreakpointValue({
        base: true,
        md: false,
        lg: false,
        xl: false,
    });

    const label =
        truncated || (responsive && responsiveTruncate)
            ? truncateString(address)
            : address;
    const showActions = !hideActions || hover;

    const externalLink = etherscanLinks[chainId]
        ? `${etherscanLinks[chainId]}/${type}/${address}`
        : undefined;

    return (
        <HStack
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {ensEntry?.avatar && <Image src={ensEntry.avatar} h={40} />}
            {name && <Text>{name}</Text>}
            <Text {...textProps}>{label}</Text>
            {showActions && !hasCopied && (
                <Link>
                    <CopyIcon onClick={onCopy} />
                </Link>
            )}
            {hasCopied && <Text fontSize="sm">Copied</Text>}
            {showActions && externalLink && (
                <Link href={externalLink}>
                    <ExternalLinkIcon />
                </Link>
            )}
        </HStack>
    );
};

export default Address;
