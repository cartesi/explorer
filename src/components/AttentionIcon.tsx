import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';

export interface AttentionIconProps {
    children: React.ReactNode;
}

const AttentionIcon: FC<AttentionIconProps> = (props) => {
    const { children, ...restProps } = props;

    return (
        <Box
            bg="orange.40"
            w={14}
            h={14}
            borderRadius="full"
            display="grid"
            placeContent="center"
            flexShrink={0}
            {...restProps}
        >
            {children}
        </Box>
    );
};

export default AttentionIcon;
