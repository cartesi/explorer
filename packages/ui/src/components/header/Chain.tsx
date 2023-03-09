// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Tag, TagLabel, TagProps } from '@chakra-ui/react';
import { chains } from 'eth-chains';
import { FC } from 'react';

const colorSchemes: { [k: number]: string } = {
    1: 'teal', // mainnet
    5: 'blue', // goerli
    421613: 'yellow', // arbitrum-goerli
    31337: 'gray', //localhost
};

type CustomChains = {
    [k: number]: { name: string };
};

// eth-chains don't have the info on this chain-ids yet, so we curate the output.
const customChains: CustomChains = {
    31337: { name: 'Local' },
    421613: { name: 'Arb görli' },
};

const getChainInfo = (chainId: number) => {
    const chain = customChains[chainId] || chains.get(chainId);
    return {
        name: chain?.name,
    };
};

export interface ChainProps extends TagProps {
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

    // do not show mainnet, unless explicity asked for
    if (chainId == 1 && !showMainnet) {
        return null;
    }

    return (
        <Tag
            borderRadius="full"
            colorScheme={colorSchemes[chainId] || defaultColorScheme}
            {...tagProps}
        >
            <TagLabel>{chain.name}</TagLabel>
        </Tag>
    );
};

export default Chain;
