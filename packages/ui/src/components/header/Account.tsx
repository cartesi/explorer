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
    useColorMode,
} from '@chakra-ui/react';
import { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '@explorer/services';
import { truncateString } from '@explorer/utils';
import { useWallet } from '@explorer/wallet';
import WalletMenu from './menu/WalletMenu';
import { PaginationIcon } from '../Icons';

export const Account: FC = () => {
    const { account } = useWallet();
    const ens = useENS(account ?? '');
    const bgColor = useColorModeValue('white', 'gray.700');
    const color = useColorModeValue('black', 'white');
    const { colorMode } = useColorMode();

    if (!account) {
        return null;
    }

    return (
        <Tag p={0} borderRadius="0">
            <Menu closeOnSelect={false}>
                {colorMode === 'light' ? (
                    <MenuButton
                        bg={bgColor}
                        h={10}
                        px={4}
                        as={Button}
                        rightIcon={
                            <PaginationIcon
                                style={{ height: 32, width: 32 }}
                                color={color}
                            />
                        }
                        _expanded={{ bg: 'white' }}
                        _hover={{ bg: 'white' }}
                        colorScheme="gray"
                    >
                        <HStack h={10}>
                            <Jazzicon
                                diameter={15}
                                seed={jsNumberForAddress(account)}
                            />
                            <TagLabel color={color} fontSize={'sm'}>
                                {ens.name ||
                                    truncateString(ens.address || account)}
                            </TagLabel>
                        </HStack>
                    </MenuButton>
                ) : (
                    <MenuButton
                        bg={bgColor}
                        h={10}
                        px={4}
                        as={Button}
                        rightIcon={
                            <PaginationIcon
                                style={{ height: 32, width: 32 }}
                                color={color}
                            />
                        }
                    >
                        <HStack h={10}>
                            <Jazzicon
                                diameter={15}
                                seed={jsNumberForAddress(account)}
                            />
                            <TagLabel color={color} fontSize={'sm'}>
                                {ens.name ||
                                    truncateString(ens.address || account)}
                            </TagLabel>
                        </HStack>
                    </MenuButton>
                )}
                <WalletMenu />
            </Menu>
        </Tag>
    );
};
