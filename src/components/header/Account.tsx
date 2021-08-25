// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { HStack, Tag, TagLabel } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import React, { FC } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '../../services/ens';
import { truncateString } from '../../utils/stringUtils';

const Account: FC = () => {
    const { account } = useWeb3React<Web3Provider>();
    const ens = useENS(account);

    if (!account) {
        return null;
    }

    return (
        <Tag
            size="lg"
            borderRadius="full"
            colorScheme="whiteAlpha"
            color="gray.200"
        >
            <HStack>
                <Jazzicon diameter={20} seed={jsNumberForAddress(account)} />
                <TagLabel>{ens.name || truncateString(ens.address)}</TagLabel>
            </HStack>
        </Tag>
    );
};

export default Account;
