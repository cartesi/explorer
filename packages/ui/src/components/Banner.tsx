import React, { FC } from 'react';
import {
    Box,
    BoxProps,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { isObject } from 'lodash';

export interface BannerProps extends BoxProps {
    children: React.ReactNode;
    Title: React.ReactNode;
    Icon?: React.ReactNode;
}

const Banner: FC<BannerProps> = (props) => {
    const { children, Title, Icon, ...restProps } = props;
    const hasIcon = isObject(Icon);
    const bg = useColorModeValue('dark.gray.senary', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'light.border.tertiary',
        'dark.gray.quaternary'
    );

    return (
        <Box
            display="flex"
            alignItems="center"
            w="100%"
            p={5}
            bg={bg}
            borderRadius="1rem"
            borderColor={borderColor}
            borderWidth="1px"
            {...restProps}
        >
            {hasIcon && (
                <Box mr={5} ml={4}>
                    {Icon}
                </Box>
            )}

            <Stack direction="column">
                <Text as="div" fontSize="md">
                    {Title}
                </Text>
                <Text as="div" fontSize="36px" lineHeight={1}>
                    {children}
                </Text>
            </Stack>
        </Box>
    );
};

export default Banner;
