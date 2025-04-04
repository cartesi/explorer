// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    HStack,
    Menu,
    // MenuButton,
    Tag,
    TagLabel,
    // useColorModeValue,
} from '@chakra-ui/react';
import { FC } from 'react';
import JazzIcon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '../../services/ens';
import theme from '../../styles/theme';
import { truncateString } from '../../utils/stringUtils';
import { PaginationIcon } from '../Icons';
import { useWallet } from '../wallet';
import WalletMenu from './menu/WalletMenu';
import { useColorModeValue } from '../ui/color-mode';

export const Account: FC = () => {
    const { account = '' } = useWallet();
    const hasAccount = account !== '';
    const ens = useENS(account);
    const bgColor = useColorModeValue('white', 'white');
    const color = useColorModeValue('black', 'black');
    const expandedStyle = useColorModeValue({ bg: 'white' }, { bg: 'white' });
    const hoverStyle = useColorModeValue({ bg: 'white' }, { bg: 'white' });
    const colorScheme = useColorModeValue('gray', undefined);
    const address = ens.name || truncateString(ens.address || account);

    return (
        <>
            {hasAccount && (
                <Tag.Root p={0} borderRadius="0">
                    <Menu.Root closeOnSelect={false}>
                        {({ open }) => (
                            <>
                                <Menu.Trigger
                                    borderRadius={0}
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
                                                transform: open
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

                                        <TagLabel
                                            color={color}
                                            fontSize="sm"
                                            fontFamily={theme.fonts.body}
                                        >
                                            {address}
                                        </TagLabel>
                                    </HStack>
                                </Menu.Trigger>

                                <WalletMenu />
                            </>
                        )}
                    </Menu.Root>
                </Tag.Root>
            )}
        </>
    );
};
