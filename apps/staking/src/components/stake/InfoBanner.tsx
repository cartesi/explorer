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
    icon: icon = <AlertIcon />,
    status = 'info',
    ...props
}) => {
    const { isOpen: isOpenCollapse, onToggle: onToggleCollapse } =
        useDisclosure({
            defaultIsOpen: isExpanded,
        });

    const bg = useColorModeValue('white', 'gray.700');
    const borderColor =
        status === 'info'
            ? 'var(--chakra-colors-blue-500)'
            : status === 'warning'
            ? 'var(--chakra-colors-orange-500)'
            : status === 'error'
            ? 'var(--chakra-colors-red-500)'
            : 'var(--chakra-colors-green-500)';

    return (
        isOpen && (
            <Alert
                position="relative"
                variant="left-accent"
                alignItems="flex-start"
                boxShadow="sm"
                bg={bg}
                borderLeftWidth={0}
                status={status}
                {...props}
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="0.25rem"
                    height="100%"
                    bg={borderColor}
                />

                {icon}

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
