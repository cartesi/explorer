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
    const bg = useColorModeValue('white', 'gray.700');
    const inlineBorderColour = 'gray.100';

    return (
        <Alert
            variant="left-accent"
            alignItems="flex-start"
            borderBlockStartColor={inlineBorderColour}
            borderBlockStartWidth={1}
            borderBlockEndColor={inlineBorderColour}
            borderBlockEndWidth={1}
            borderEndColor={inlineBorderColour}
            borderEndWidth={1}
            boxShadow="sm"
            bg={bg}
            status={status}
            {...alertProps}
        >
            <AlertIcon />
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
