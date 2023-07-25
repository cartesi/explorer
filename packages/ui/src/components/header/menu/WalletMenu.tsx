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
    Flex,
    IconProps,
    MenuItem,
    MenuItemProps,
    MenuList,
    Text,
    useClipboard,
    useColorModeValue,
} from '@chakra-ui/react';
import { useENS } from '@explorer/services';
import { useWallet } from '@explorer/wallet';
import React, { FC, useMemo } from 'react';
import { CopyIcon, DisconnectIcon, SwitchIcon } from '../../Icons';

interface WalletMenuItemProps extends MenuItemProps {
    children: React.ReactNode;
}

const WalletMenuItem: FC<WalletMenuItemProps> = ({
    children,
    ...restProps
}) => {
    const bgColor = useColorModeValue('white', 'dark.gray.quaternary');
    const borderColor = useColorModeValue('grey.tertiary', undefined);
    const hoverStyle = useColorModeValue(
        { bg: 'light.support.teal' },
        undefined
    );
    return (
        <MenuItem
            justifyContent="flex-end"
            borderBottom="1px"
            borderColor={borderColor}
            padding={3}
            bg={bgColor}
            _hover={hoverStyle}
            {...restProps}
        >
            {children}
        </MenuItem>
    );
};

interface WalletMenuActionItemProps {
    title: string;
    color: string;
    Icon: FC<IconProps>;
    onClick: () => void;
}

const WalletMenuActionItem: FC<WalletMenuActionItemProps> = ({
    title,
    color,
    Icon,
    onClick,
}) => (
    <Flex>
        <Box
            title={title}
            aria-label={title}
            px={4}
            fontSize={16}
            fontWeight={400}
            color={color}
            onClick={onClick}
        >
            {title}
        </Box>

        <Icon
            aria-label={title}
            width="18px"
            height="18px"
            color={color}
            onClick={onClick}
        />
    </Flex>
);

const WalletMenu: FC = () => {
    const { account, library, isHardwareWallet, selectAccount, deactivate } =
        useWallet();
    const ens = useENS(account ?? '');
    const { hasCopied, onCopy } = useClipboard(account ?? '');
    const color = useColorModeValue('light.gray.primary', 'white');
    const addressHoverColor = useColorModeValue(undefined, {
        color: 'white',
    });
    const copyIconColor = useColorModeValue(undefined, { color });
    const menuItems = useMemo(() => {
        const items = [];

        if (account && library) {
            items.push({
                title: 'Disconnect account',
                Icon: DisconnectIcon,
                onClick: deactivate,
            });
        }

        if (account && library && selectAccount && isHardwareWallet) {
            items.push({
                title: 'Switch account',
                Icon: SwitchIcon,
                onClick: selectAccount,
            });
        }

        return items;
    }, [account, library, isHardwareWallet, deactivate, selectAccount]);

    return (
        <>
            {typeof account === 'string' && (
                <MenuList borderRadius="0" p={0} border={0}>
                    <WalletMenuItem>
                        <Flex>
                            <Text
                                fontSize={14}
                                fontWeight={400}
                                pl={2}
                                pr={4}
                                color={color}
                                _hover={addressHoverColor}
                            >
                                {ens.address}
                            </Text>

                            {hasCopied ? (
                                <Text
                                    fontSize="sm"
                                    lineHeight="20px"
                                    color={color}
                                >
                                    Copied
                                </Text>
                            ) : (
                                <CopyIcon
                                    width="20px"
                                    height="20px"
                                    color={color}
                                    _hover={copyIconColor}
                                    onClick={onCopy}
                                />
                            )}
                        </Flex>
                    </WalletMenuItem>

                    {menuItems.map((item) => (
                        <WalletMenuItem key={item.title}>
                            <WalletMenuActionItem
                                color={color}
                                title={item.title}
                                Icon={item.Icon as FC<IconProps>}
                                onClick={item.onClick}
                            />
                        </WalletMenuItem>
                    ))}
                </MenuList>
            )}
        </>
    );
};

export default WalletMenu;
