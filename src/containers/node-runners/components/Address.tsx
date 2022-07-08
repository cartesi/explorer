// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import {
    HStack,
    Image,
    Text,
    TextProps,
    useBreakpointValue,
    VStack,
    Tag,
    TagProps,
} from '@chakra-ui/react';
import { truncateString } from '../../../utils/stringUtils';
import { useENS } from '../../../services/ens';

interface AddressProps {
    address: string;
    truncated?: boolean;
}

interface TaggableTextProps {
    text: string;
    tagged: boolean;
    tagProps?: TagProps;
}

const TaggableText = ({ text, tagged, tagProps }: TaggableTextProps) => {
    const textProps: TextProps = { whiteSpace: 'nowrap', fontSize: 'md' };
    const bg = tagged ? 'blue.50' : 'transparent';
    return (
        <Tag borderRadius="full" size="md" bg={bg} {...tagProps}>
            <Text {...textProps}>{text}</Text>
        </Tag>
    );
};

const Address = ({ address, truncated }: AddressProps) => {
    const ensEntry = useENS(address);
    const responsiveTruncate = useBreakpointValue({
        base: true,
        xl: false,
    });

    const ensName = ensEntry?.name;
    const avatar = ensEntry?.avatar;

    const label =
        truncated || responsiveTruncate ? truncateString(address) : address;

    return (
        <HStack spacing={5} alignContent="center">
            {avatar && (
                <Image
                    src={avatar}
                    boxSize="42px"
                    objectFit="contain"
                    alt="ENS avatar"
                />
            )}
            <VStack alignItems="flex-start">
                {ensName && <TaggableText text={ensName} tagged />}
                <TaggableText
                    text={label}
                    tagged={!ensName}
                    tagProps={{ mt: '3px !important' }}
                />
            </VStack>
        </HStack>
    );
};

export default Address;
