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
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { DisconnectIcon, CopyIcon, SwitchIcon, PaginationIcon } from '../Icons';
import { useENS } from '../../services/ens';
import { truncateString } from '../../utils/stringUtils';
import { useWallet } from '../../contexts/wallet';

const Account: FC = () => {
    const { account, library, isHardwareWallet, onboard, deactivate } =
        useWallet();
    const ens = useENS(account);
    const { hasCopied, onCopy } = useClipboard(account);
    const bgColor = useColorModeValue('white', 'gray.700');
    const color = useColorModeValue('black', 'white');

    if (!account) {
        return null;
    }

    return (
        <Tag
            size="md"
            borderRadius="0"
            colorScheme="gray"
            h={10}
            w={170}
            padding={5}
            bg={bgColor}
        >
            <HStack>
                <Jazzicon diameter={15} seed={jsNumberForAddress(account)} />
                <TagLabel color={color}>
                    {ens.name || truncateString(ens.address || account)}
                </TagLabel>
            </HStack>
            <Menu closeOnSelect={false}>
                <MenuButton>
                    <PaginationIcon
                        style={{
                            height: 32,
                            width: 32,
                        }}
                        color={color}
                    />
                </MenuButton>

                <MenuList
                    borderRadius="0"
                    p={0}
                    left={-383}
                    position={'absolute'}
                >
                    {!hasCopied ? (
                        <MenuItem
                            justifyContent={'flex-end'}
                            borderBottom="1px"
                            borderColor={'gray.100'}
                            padding={3}
                            backgroundColor={'blue.50'}
                        >
                            <Flex>
                                <Box
                                    fontSize={14}
                                    fontWeight={400}
                                    px={4}
                                    color={color}
                                >
                                    {ens.address}
                                </Box>
                                <Link>
                                    <CopyIcon
                                        onClick={onCopy}
                                        style={{
                                            height: 19,
                                            width: 19,
                                        }}
                                        color={color}
                                    />
                                </Link>
                            </Flex>
                        </MenuItem>
                    ) : (
                        <MenuItem
                            justifyContent={'flex-end'}
                            borderBottom="1px"
                            borderColor={'gray.100'}
                            padding={3}
                            backgroundColor={'blue.50'}
                        >
                            <Flex>
                                <Box
                                    fontSize={14}
                                    fontWeight={400}
                                    color={color}
                                >
                                    {ens.address}
                                </Box>
                                <Text
                                    fontSize="sm"
                                    pl={1}
                                    height="5"
                                    color={color}
                                >
                                    Copied
                                </Text>
                            </Flex>
                        </MenuItem>
                    )}

                    {account && library && (
                        <MenuItem
                            justifyContent={'flex-end'}
                            borderBottom="1px"
                            borderColor={'gray.100'}
                            padding={3}
                        >
                            <Flex>
                                <Box
                                    onClick={deactivate}
                                    aria-label="Disconnect wallet"
                                    title="Disconnect wallet"
                                    px={4}
                                    fontSize={16}
                                    fontWeight={400}
                                    color={color}
                                >
                                    Disconnect account
                                </Box>
                                <DisconnectIcon
                                    onClick={deactivate}
                                    aria-label="Disconnect wallet"
                                    title="Disconnect wallet"
                                    style={{
                                        height: 18,
                                        width: 18,
                                    }}
                                    color={color}
                                />
                            </Flex>
                        </MenuItem>
                    )}

                    {account && library && onboard && isHardwareWallet && (
                        <MenuItem
                            justifyContent={'flex-end'}
                            borderBottom="1px"
                            borderColor={'gray.100'}
                            padding={3}
                        >
                            <Flex>
                                <Box
                                    onClick={onboard.accountSelect}
                                    aria-label="Switch accounts"
                                    title="Switch accounts"
                                    px={4}
                                    fontSize={16}
                                    fontWeight={400}
                                    color={color}
                                >
                                    Switch account
                                </Box>
                                <SwitchIcon
                                    onClick={onboard.accountSelect}
                                    aria-label="Switch accounts"
                                    title="Switch accounts"
                                    style={{
                                        height: 18,
                                        width: 18,
                                    }}
                                    color={color}
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
