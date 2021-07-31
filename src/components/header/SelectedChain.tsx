// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Tag, TagLabel } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { chains } from 'eth-chains';
import { useWeb3React } from '@web3-react/core';

const SelectedChain: FC = () => {
    const { chainId } = useWeb3React<Web3Provider>();
    const chain = chains.get(chainId);

    const defaultColorScheme = 'gray';
    const colorSchemes = {
        1: 'teal', // mainnet
        3: 'pink', // ropsten
        42: 'purple', // kovan
        4: 'yellow', // rinkeby
        5: 'blue', // goerli
    };

    // do now show anything for mainnet or disconnected from metamask
    if (!chainId || !chain || chainId == 1) {
        return null;
    }

    return (
        <Tag
            borderRadius="full"
            colorScheme={colorSchemes[chainId] || defaultColorScheme}
        >
            <TagLabel>{chain.network}</TagLabel>
        </Tag>
    );
};

export default SelectedChain;
