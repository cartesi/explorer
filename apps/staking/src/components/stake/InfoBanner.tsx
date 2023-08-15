// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertProps,
    AlertTitle,
    Box,
    CloseButton,
    Collapse,
    IconButton,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { AlertStatus } from '@chakra-ui/alert';
import { isObject } from 'lodash';

export interface IInfoBannerProps extends Omit<AlertProps, 'content'> {
    isOpen?: boolean;
    isClosable?: boolean;
    isExpandable?: boolean;
    isExpanded?: boolean;
    icon?: JSX.Element;
    title?: string;
    status?: AlertStatus;
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
    const { isOpen: isOpenCollapse, onToggle: onToggleCollapse } =
        useDisclosure({
            defaultIsOpen: isExpanded,
        });

    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const variant = useColorModeValue('left-accent', undefined);
    const alertIconColor = useColorModeValue(
        `light.support.${status}`,
        `dark.support.${status}`
    );

    return (
        isOpen && (
            <Alert
                position="relative"
                variant={variant}
                alignItems="flex-start"
                boxShadow="sm"
                bg={bg}
                borderLeftWidth={0}
                status={status}
                borderRadius="1rem"
                py={4}
                pl={8}
                {...props}
            >
                {isObject(icon) ? icon : <AlertIcon color={alertIconColor} />}

                <Box w="full">
                    <AlertTitle mr={5}>{title}</AlertTitle>
                    {content && (
                        <AlertDescription display="block" mr={5}>
                            {isExpandable ? (
                                <Collapse in={isOpenCollapse} animateOpacity>
                                    {content}
                                </Collapse>
                            ) : (
                                content
                            )}
                        </AlertDescription>
                    )}
                </Box>
                {isExpandable && (
                    <IconButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        size="sm"
                        variant="ghost"
                        _hover={{ bg: 'transparent' }}
                        icon={
                            isOpenCollapse ? (
                                <ChevronDownIcon boxSize={6} />
                            ) : (
                                <ChevronUpIcon boxSize={6} />
                            )
                        }
                        aria-label={'Open Panel'}
                        role="icon-button"
                        onClick={onToggleCollapse}
                    />
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
            </Alert>
        )
    );
};
