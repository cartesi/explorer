// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Tag, TagRootProps } from '@chakra-ui/react';
import { FC } from 'react';
import { chainNames } from '../wallet/chains';

const colorSchemes: { [k: number]: string } = {
    1: 'teal', // mainnet
    11155111: 'pink', // sepolia
    31337: 'gray', //localhost
};

const getChainInfo = (chainId: number) => ({
    name: chainNames[chainId] ?? `Chain ${chainId}`,
});

export interface ChainProps extends TagRootProps {
    chainId?: number;
    showMainnet?: boolean;
}

const Chain: FC<ChainProps> = (props) => {
    const { chainId, showMainnet = false, ...tagProps } = props;

    // do not show anything when disconnected from metamask
    if (!chainId) {
        return null;
    }

    // get chain additional information
    const chain = getChainInfo(chainId);

    // colors matching metamask colors
    const defaultColorScheme = 'gray';

    // do not show anything for unrecognized chain
    if (!chain) {
        return null;
    }

    // do not show mainnet, unless explicitly asked for
    if (chainId == 1 && !showMainnet) {
        return null;
    }

    return (
        <Tag.Root
            borderRadius="full"
            colorPalette={colorSchemes[chainId] || defaultColorScheme}
            {...tagProps}
        >
            <Tag.Label>{chain.name}</Tag.Label>
        </Tag.Root>
    );
};

export default Chain;
