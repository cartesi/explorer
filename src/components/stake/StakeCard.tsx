import React, { FC } from 'react';
import {
    Box,
    BoxProps,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { isObject } from 'lodash';

export interface StakeCardProps extends BoxProps {
    children: React.ReactNode;
    Icon: React.ReactNode;
    Title: React.ReactNode;
}

const StakeCard: FC<StakeCardProps> = (props) => {
    const { children, Icon, Title, ...restProps } = props;
    const hasIcon = isObject(Icon);
    const bg = useColorModeValue('blue.50', 'primary');

    return (
        <Box
            display="flex"
            alignItems="center"
            w="100%"
            p={5}
            bg={bg}
            borderRadius="3px"
            {...restProps}
        >
            {hasIcon && (
                <Box mr={5} ml={4}>
                    {Icon}
                </Box>
            )}

            <Stack direction="column">
                <Text fontSize="md">{Title}</Text>
                <Text fontSize="36px" lineHeight={1}>
                    {children}
                </Text>
            </Stack>
        </Box>
    );
};

export default StakeCard;
