// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbHelp } from 'react-icons/tb';

import {
    Box,
    Button,
    Heading,
    HeadingProps,
    Stack,
    StackProps,
    Text,
} from '@chakra-ui/react';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';
import { useColorModeValue } from './ui/color-mode';
import { Tooltip } from './Tooltip';

export interface CardProps extends Omit<StackProps, 'title'> {
    id?: string;
    buttonText?: string | ReactElement;
    icon?: ReactElement;
    iconBg?: string | (string & {});
    subtitle?: string;
    tooltip?: string | ReactNode;
    title: string | ReactNode;
    onButtonClick?: MouseEventHandler<HTMLButtonElement>;
    contentStackProps?: StackProps;
    titleProps?: HeadingProps;
}

export const Card = ({
    id,
    buttonText,
    onButtonClick,
    icon,
    iconBg,
    subtitle,
    title,
    titleProps,
    tooltip,
    contentStackProps,
    ...stackProps
}: CardProps) => {
    const bg = useColorModeValue('white', 'gray.800');
    const colorScheme = useColorModeValue('teal', 'cyan');
    return (
        <Stack
            id={id}
            bg={bg}
            gap={10}
            py={8}
            px={8}
            w={{ base: '100%' }}
            direction={{ base: 'column', lg: 'row' }}
            justifyContent={{ base: 'flex-start', lg: 'space-between' }}
            alignItems={{ base: 'center', lg: 'flex-start' }}
            {...stackProps}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                alignItems={['center']}
                px={4}
                {...contentStackProps}
            >
                <Box
                    w={14}
                    h={14}
                    bg={iconBg}
                    mr={2.5}
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                >
                    {icon}
                </Box>

                <Box textAlign={{ base: 'center', lg: 'left' }}>
                    <Heading
                        as="h3"
                        size="sm"
                        fontWeight="medium"
                        fontSize="lg"
                        mb={0}
                        display="flex"
                        justifyContent={{ base: 'center', lg: 'flex-start' }}
                        {...titleProps}
                    >
                        {title}{' '}
                        {tooltip && (
                            <Tooltip
                                showArrow
                                content={tooltip}
                                positioning={{ placement: 'top' }}
                                openDelay={0}
                                contentProps={{
                                    maxW: { base: '95vw', md: '37rem' },
                                }}
                                triggerProps={{
                                    ml: 2,
                                }}
                            >
                                <TbHelp
                                    data-testid={`${id}-tooltip-icon`}
                                    role="tooltip-icon"
                                />
                            </Tooltip>
                        )}
                    </Heading>
                    {subtitle && (
                        <Text data-testid="card-subtitle">{subtitle}</Text>
                    )}
                </Box>
            </Stack>
            <Box px={1}>
                {buttonText && (
                    <Button
                        data-testid="card-action-button"
                        ml={{ base: 0, lg: 2 }}
                        colorPalette={colorScheme}
                        onClick={onButtonClick}
                        fontWeight={500}
                        width="full"
                        h={{ base: 12, lg: 14 }}
                        w="16rem"
                    >
                        {buttonText}
                    </Button>
                )}
            </Box>
        </Stack>
    );
};
