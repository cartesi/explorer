import React, { FC } from 'react';
import {
    CloseButton as ChakraCloseButton,
    CloseButtonProps,
} from '@chakra-ui/react';

const CloseButton: FC<CloseButtonProps> = (props) => {
    return (
        <ChakraCloseButton
            width={10}
            height={10}
            {...props}
            minWidth="auto"
            minHeight="auto"
            borderRadius="0.5rem"
            role="close-button"
        />
    );
};

export default CloseButton;
