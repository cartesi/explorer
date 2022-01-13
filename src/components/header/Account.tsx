// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
    IconButton,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { HiSwitchVertical } from 'react-icons/hi';
import { useENS } from '../../services/ens';
import { truncateString } from '../../utils/stringUtils';
import { useWallet } from '../../contexts/wallet';

const Account: FC = () => {
    const { account, library, isHardwareWallet, onboard, deactivate } =
        useWallet();
    const ens = useENS(account);
    const iconColor = useColorModeValue('white', 'gray.300');

    if (!account) {
        return null;
    }

    return (
        <Tag
            size="md"
            borderRadius="full"
            colorScheme="whiteAlpha"
            color="gray.200"
        >
            <HStack>
                <Jazzicon diameter={15} seed={jsNumberForAddress(account)} />
                <TagLabel>
                    {ens.name || truncateString(ens.address || account)}
                </TagLabel>
                {account && library && onboard && isHardwareWallet && (
                    <IconButton
                        onClick={onboard.accountSelect}
                        aria-label="Switch accounts"
                        title="Switch accounts"
                        colorScheme="transparent"
                        size="sm"
                        variant="ghost"
                        color={iconColor}
                        icon={<Box as={HiSwitchVertical} />}
                    />
                )}

                {account && library && (
                    <TagCloseButton
                        aria-label="Disconnect wallet"
                        title="Disconnect wallet"
                        onClick={deactivate}
                    />
                )}
            </HStack>
        </Tag>
    );
};

export default Account;
