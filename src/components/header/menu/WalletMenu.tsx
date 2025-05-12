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
    Menu,
    MenuItemProps,
    Text,
    useClipboard,
} from '@chakra-ui/react';
import React, { FC, useMemo } from 'react';
import { useENS } from '../../../services/ens';
import { CopyIcon, DisconnectIcon, SwitchIcon } from '../../Icons';
import { useWallet } from '../../wallet/useWallet';
import { useColorModeValue } from '../../ui/color-mode';
import theme from '../../../styles/theme';

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
        <Menu.Item
            justifyContent="flex-end"
            borderBottom="1px"
            borderColor={borderColor}
            borderStyle="solid"
            padding={3}
            bg={bgColor}
            cursor="pointer"
            _hover={hoverStyle}
            {...restProps}
        >
            {children}
        </Menu.Item>
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
    const clipboard = useClipboard({ value: account ?? '' });
    const color = useColorModeValue('light.gray.primary', 'white');
    const addressHoverColor = useColorModeValue(undefined, {
        color: 'white',
    });
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
                <Menu.Content
                    borderRadius="0"
                    p={0}
                    border={0}
                    zIndex={theme.tokens.getVar('zIndex.xxl')}
                >
                    <WalletMenuItem value="address">
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

                            {clipboard.copied ? (
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
                                    onClick={(event) => {
                                        clipboard.copy();
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                />
                            )}
                        </Flex>
                    </WalletMenuItem>

                    {menuItems.map((item) => (
                        <WalletMenuItem key={item.title} value={item.title}>
                            <WalletMenuActionItem
                                color={color}
                                title={item.title}
                                Icon={item.Icon as FC<IconProps>}
                                onClick={item.onClick}
                            />
                        </WalletMenuItem>
                    ))}
                </Menu.Content>
            )}
        </>
    );
};

export default WalletMenu;
