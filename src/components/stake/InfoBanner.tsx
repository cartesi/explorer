// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbChevronDown, TbChevronUp } from 'react-icons/tb';
import {
    Alert,
    AlertRootProps,
    Box,
    CloseButton,
    Collapsible,
    Icon,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';
import { isObject } from 'lodash';
import React, { FC, JSX } from 'react';
import { useColorModeValue } from '../ui/color-mode';

export interface IInfoBannerProps extends Omit<AlertRootProps, 'content'> {
    isOpen?: boolean;
    isClosable?: boolean;
    isExpandable?: boolean;
    isExpanded?: boolean;
    icon?: JSX.Element;
    title?: string;
    status?: AlertRootProps['status'];
    content?: React.ReactNode;
    onToggle?: () => void;
}

export const InfoBanner: FC<IInfoBannerProps> = ({
    isOpen: isOpen = false,
    onToggle: onToggle,
    isClosable: isClosable = false,
    isExpandable: isExpandable = false,
    isExpanded: isExpanded = false,
    title,
    content = '',
    icon,
    status = 'info',
    ...props
}) => {
    const { open: isOpenCollapse, onToggle: onToggleCollapse } = useDisclosure({
        defaultOpen: isExpanded,
    });

    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const alertIconColor = useColorModeValue(
        `light.support.${status}`,
        `dark.support.${status}`
    );
    const boxShadow = useColorModeValue('sm', 'none');
    const borderColor = useColorModeValue('gray.100', 'dark.border.quaternary');

    return (
        isOpen && (
            <Alert.Root
                position="relative"
                alignItems="flex-start"
                boxShadow={boxShadow}
                bg={bg}
                status={status}
                borderRadius="1rem"
                borderWidth="1px"
                borderColor={borderColor}
                py={4}
                pl={8}
                {...props}
            >
                {isObject(icon) ? (
                    icon
                ) : (
                    <Alert.Indicator color={alertIconColor} />
                )}

                <Alert.Content>
                    <Box w="full">
                        <Alert.Title mr={5}>{title}</Alert.Title>
                        {content && (
                            <Alert.Description display="block" mr={5}>
                                {isExpandable ? (
                                    <Collapsible.Root open={isOpenCollapse}>
                                        <Collapsible.Content>
                                            {content}
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                ) : (
                                    content
                                )}
                            </Alert.Description>
                        )}
                    </Box>
                </Alert.Content>
                {isExpandable && (
                    <IconButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        size="sm"
                        variant="ghost"
                        _hover={{ bg: 'transparent' }}
                        aria-label={'Open Panel'}
                        role="icon-button"
                        onClick={onToggleCollapse}
                    >
                        <Icon
                            as={isOpenCollapse ? TbChevronDown : TbChevronUp}
                            w={6}
                            h={6}
                        />
                    </IconButton>
                )}

                {isClosable && (
                    <CloseButton
                        position="absolute"
                        onClick={onToggle}
                        right="8px"
                        top="8px"
                        role="close-button"
                    />
                )}
            </Alert.Root>
        )
    );
};
