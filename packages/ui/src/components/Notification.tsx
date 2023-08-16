// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertProps,
    AlertTitle,
    CloseButton,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { isFunction } from 'lodash/fp';
import { ReactNode } from 'react';

export interface NotificationProps extends Omit<AlertProps, 'title'> {
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
    const inlineBorderColour = 'gray.100';

    return (
        <Alert
            alignItems="flex-start"
            boxShadow="sm"
            bg={bg}
            borderRadius="2xl"
            border={'1px solid rgba(255, 255, 255, 0.10)'}
            py="2"
            status={status}
            {...alertProps}
        >
            <AlertIcon color={'dark.support.alert'} />
            <VStack alignItems={['flex-start']}>
                <AlertTitle fontSize="md">{title}</AlertTitle>
                {subtitle && (
                    <AlertDescription fontSize="sm">
                        {subtitle}
                    </AlertDescription>
                )}
                {children ? children : ''}
            </VStack>
            {isFunction(onClose) && (
                <CloseButton
                    position="absolute"
                    right="2"
                    top="2"
                    role="close-button"
                    onClick={onClose}
                />
            )}
        </Alert>
    );
};
