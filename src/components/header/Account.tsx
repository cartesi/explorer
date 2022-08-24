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
    useColorModeValue,
    MenuButton,
    Menu,
    Button,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '../../services/ens';
import { truncateString } from '../../utils/stringUtils';
import { useWallet } from '../../contexts/wallet';
import WalletMenu from './menu/WalletMenu';
import { PaginationIcon } from '../Icons';

const Account: FC = () => {
    const { account } = useWallet();
    const ens = useENS(account);
    const bgColor = useColorModeValue('white', 'gray.700');
    const color = useColorModeValue('black', 'white');

    if (!account) {
        return null;
    }

    return (
        <Tag bg={bgColor} p={0} borderRadius="0">
            <Menu closeOnSelect={false}>
                <MenuButton
                    px={4}
                    as={Button}
                    rightIcon={
                        <PaginationIcon
                            style={{ height: 32, width: 32 }}
                            color={color}
                        />
                    }
                >
                    <HStack>
                        <Jazzicon
                            diameter={15}
                            seed={jsNumberForAddress(account)}
                        />
                        <TagLabel color={color} fontSize={'sm'}>
                            {ens.name || truncateString(ens.address || account)}
                        </TagLabel>
                    </HStack>
                </MenuButton>
                <WalletMenu />
            </Menu>
        </Tag>
    );
};

export default Account;
