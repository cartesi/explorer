// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Alert, AlertRootProps, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { isFunction } from 'lodash/fp';
import { useColorModeValue } from './ui/color-mode';
import CloseButton from './CloseButton';

export interface NotificationProps extends Omit<AlertRootProps, 'title'> {
    title: ReactNode;
    subtitle?: ReactNode;
    children?: ReactNode;
    onClose?: () => void;
}

export const Notification = ({
    title,
    subtitle,
    children,
    onClose,
    status = 'info',
    ...alertProps
}: NotificationProps) => {
    const bg = useColorModeValue('white', 'dark.gray.quaternary');
    const borderColor = useColorModeValue(
        'light.gray.tertiary',
        'dark.border.quaternary'
    );

    return (
        <Alert.Root
            alignItems="flex-start"
            boxShadow="sm"
            bg={bg}
            borderRadius="2xl"
            borderWidth={'1px'}
            borderStyle={'solid'}
            borderColor={borderColor}
            py="2"
            status={status}
            role="alert"
            {...alertProps}
        >
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title fontSize="md">{title}</Alert.Title>
                <VStack alignItems={['flex-start']}>
                    {subtitle && (
                        <Alert.Description fontSize="sm">
                            {subtitle}
                        </Alert.Description>
                    )}
                    {children ? children : ''}
                </VStack>
            </Alert.Content>
            {isFunction(onClose) && (
                <CloseButton
                    pos="relative"
                    top="-2"
                    insetEnd="-2"
                    role="close-button"
                    onClick={onClose}
                />
            )}
        </Alert.Root>
    );
};
