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
    Box,
    MenuItem,
    MenuButton,
    Menu,
    MenuList,
    Flex,
    useClipboard,
    Link,
    Text,
    MenuItemOption,
} from '@chakra-ui/react';
import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';
import React, { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { useENS } from '../../services/ens';
import { truncateString } from '../../utils/stringUtils';
import { useWallet } from '../../contexts/wallet';

const Account: FC = () => {
    const { account, library, isHardwareWallet, onboard, deactivate } =
        useWallet();
    const ens = useENS(account);
    const { hasCopied, onCopy } = useClipboard(account);

    if (!account) {
        return null;
    }

    return (
        <Tag
            size="md"
            borderRadius="0"
            colorScheme="gray"
            h={10}
            w={150}
            backgroundColor="white"
        >
            <HStack>
                <Jazzicon diameter={15} seed={jsNumberForAddress(account)} />
                <TagLabel>
                    {ens.name || truncateString(ens.address || account)}
                </TagLabel>
            </HStack>
            <Menu closeOnSelect={false}>
                <MenuButton h={5} w={5} px={2}>
                    <ChevronDownIcon />
                </MenuButton>

                <MenuList borderRadius="0" p={0}>
                    <MenuItemOption
                        justifyContent={'flex-end'}
                        borderBottom="1px"
                        borderColor={'gray.100'}
                    >
                        <Flex>
                            <Box>{ens.address}</Box>
                            <Box>
                                {!hasCopied && (
                                    <Link px={2}>
                                        <CopyIcon onClick={onCopy} />
                                    </Link>
                                )}
                                {hasCopied && <Text fontSize="sm">Copied</Text>}
                            </Box>
                        </Flex>
                    </MenuItemOption>

                    {account && library && (
                        <MenuItem
                            justifyContent={'flex-end'}
                            borderBottom="1px"
                            borderColor={'gray.100'}
                        >
                            <Flex>
                                <Box
                                    onClick={deactivate}
                                    aria-label="Disconnect wallet"
                                    title="Disconnect wallet"
                                    px={2}
                                >
                                    Disconnect account
                                </Box>
                                <AiOutlineDisconnect
                                    onClick={deactivate}
                                    aria-label="Disconnect wallet"
                                    title="Disconnect wallet"
                                    style={{
                                        marginRight: 7,
                                        height: 16,
                                        width: 16,
                                    }}
                                />
                            </Flex>
                        </MenuItem>
                    )}

                    {account && library && onboard && isHardwareWallet && (
                        <MenuItem
                            justifyContent={'flex-end'}
                            borderBottom="1px"
                            borderColor={'gray.100'}
                        >
                            <Flex>
                                <Box
                                    onClick={onboard.accountSelect}
                                    aria-label="Switch accounts"
                                    title="Switch accounts"
                                    px={2}
                                >
                                    Switch accounts
                                </Box>
                                <CgArrowsExchangeAlt
                                    onClick={onboard.accountSelect}
                                    aria-label="Switch accounts"
                                    title="Switch accounts"
                                    style={{
                                        marginRight: 7,
                                        height: 19,
                                        width: 19,
                                    }}
                                />
                            </Flex>
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </Tag>
    );
};

export default Account;
