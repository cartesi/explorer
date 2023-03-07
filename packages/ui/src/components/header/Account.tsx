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
import { FC } from 'react';
import JazzIcon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '@explorer/services';
import { truncateString } from '@explorer/utils';
import { useWallet } from '@explorer/wallet';
import WalletMenu from './menu/WalletMenu';
import { PaginationIcon } from '../Icons';

export const Account: FC = () => {
    const { account = '' } = useWallet();
    const hasAccount = account !== '';
    const ens = useENS(account);
    const bgColor = useColorModeValue('white', 'gray.700');
    const color = useColorModeValue('black', 'white');
    const expandedStyle = useColorModeValue({ bg: 'white' }, undefined);
    const hoverStyle = useColorModeValue({ bg: 'white' }, undefined);
    const colorScheme = useColorModeValue('gray', undefined);
    const address = ens.name || truncateString(ens.address || account);

    return (
        <>
            {hasAccount && (
                <Tag p={0} borderRadius="0">
                    <Menu closeOnSelect={false}>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    bg={bgColor}
                                    h={10}
                                    pl={4}
                                    pr={1}
                                    as={Button}
                                    rightIcon={
                                        <PaginationIcon
                                            height="32px"
                                            width="32px"
                                            color={color}
                                            style={{
                                                transition: 'ease-in-out 0.1s',
                                                transform: isOpen
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)',
                                            }}
                                        />
                                    }
                                    _expanded={expandedStyle}
                                    _hover={hoverStyle}
                                    colorScheme={colorScheme}
                                >
                                    <HStack h={10}>
                                        <JazzIcon
                                            diameter={15}
                                            seed={jsNumberForAddress(account)}
                                        />

                                        <TagLabel color={color} fontSize="sm">
                                            {address}
                                        </TagLabel>
                                    </HStack>
                                </MenuButton>

                                <WalletMenu />
                            </>
                        )}
                    </Menu>
                </Tag>
            )}
        </>
    );
};
