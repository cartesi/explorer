// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    MenuItem,
    MenuList,
    Flex,
    useClipboard,
    Link,
    Text,
    useColorModeValue,
    useColorMode,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { DisconnectIcon, CopyIcon, SwitchIcon } from '../../Icons';
import { useENS } from '../../../services/ens';
import { useWallet } from '../../../contexts/wallet';

const WalletMenu: FC = () => {
    const { account, library, isHardwareWallet, onboard, deactivate } =
        useWallet();
    const ens = useENS(account);
    const { hasCopied, onCopy } = useClipboard(account);
    const color = useColorModeValue('black', 'white');
    const { colorMode, toggleColorMode } = useColorMode();

    if (!account) {
        return null;
    }

    return (
        <MenuList borderRadius="0" p={0}>
            {!hasCopied ? (
                <MenuItem
                    justifyContent={'flex-end'}
                    borderBottom="1px"
                    borderColor={'gray.100'}
                    padding={3}
                    backgroundColor={
                        colorMode === 'light' ? 'blue.50' : 'gray.700'
                    }
                >
                    {colorMode === 'light' ? (
                        <Flex>
                            <Text
                                fontSize={14}
                                fontWeight={400}
                                px={4}
                                color={color}
                            >
                                {ens.address}
                            </Text>
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
                    ) : (
                        <Flex>
                            <Box
                                fontSize={14}
                                fontWeight={400}
                                px={4}
                                color={color}
                                _hover={{
                                    color: 'white',
                                }}
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
                                    _hover={{
                                        color: color,
                                    }}
                                />
                            </Link>
                        </Flex>
                    )}
                </MenuItem>
            ) : (
                <MenuItem
                    justifyContent={'flex-end'}
                    borderBottom="1px"
                    borderColor={'gray.100'}
                    padding={3}
                    backgroundColor={
                        colorMode === 'light' ? 'blue.50' : 'gray.700'
                    }
                >
                    <Flex>
                        <Box fontSize={14} fontWeight={400} color={color}>
                            {ens.address}
                        </Box>
                        <Text fontSize="sm" pl={1} height="5" color={color}>
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
    );
};

export default WalletMenu;
