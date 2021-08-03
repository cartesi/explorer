import React from 'react';
import { Flex, Box, BoxProps, Text, Image } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import theme from '../../styles/theme';
import CTSIText from '../CTSIText';

interface CardProps extends BoxProps {
    title: string;
    balance: BigNumber;
    children?: React.ReactNode;
    icon?: 'up' | 'down';
    isActive?: boolean;
}

export const Card: React.FunctionComponent<CardProps> = (props) => {
    const {
        title,
        balance,
        children,
        icon = 'up',
        isActive = false,
        ...restProps
    } = props;

    return (
        <Box
            padding="1.5rem 3rem"
            borderLeftWidth={10}
            borderLeftColor={theme.colors.primary}
            bg={isActive ? theme.colors.gray : 'white'}
            {...restProps}
        >
            <Flex justify="space-between" align="center">
                <Flex direction="column">
                    <Flex justify="space-between" align="center">
                        <Image
                            src={`/images/${
                                icon === 'up' ? 'balance' : 'releasing'
                            }.png`}
                            alt="type-icon"
                        />

                        <Text ml={3}>{title}</Text>
                    </Flex>

                    {children}
                </Flex>

                <CTSIText value={balance} />
            </Flex>
        </Box>
    );
};

export default Card;
