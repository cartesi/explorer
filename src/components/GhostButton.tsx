import React, { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export const GhostButton: FC<ButtonProps> = ({ children, ...restProps }) => (
    <Button
        variant="ghost"
        p={0}
        minW="auto"
        minH="auto"
        userSelect="none"
        _hover={{
            background: 'transparent',
        }}
        _focus={{
            background: 'transparent',
        }}
        _active={{
            background: 'transparent',
        }}
        {...restProps}
    >
        {children}
    </Button>
);
