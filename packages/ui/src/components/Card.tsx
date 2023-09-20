// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Heading,
    HeadingProps,
    Stack,
    StackProps,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { MouseEventHandler, ReactElement, ReactNode } from 'react';

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
    const tooltipBg = useColorModeValue('white', 'dark.gray.secondary');
    const tooltipColor = useColorModeValue('black', 'white');
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Stack
            id={id}
            bg={bg}
            spacing={10}
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
                <Avatar w={14} h={14} bg={iconBg} icon={icon} mr={2.5} />
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
                                borderRadius="md"
                                label={tooltip}
                                placement="auto"
                                fontSize="md"
                                bg={tooltipBg}
                                color={tooltipColor}
                                maxW={{ base: '95vw', md: '37rem' }}
                                isOpen={isOpen}
                            >
                                <QuestionOutlineIcon
                                    data-testid={`${id}-tooltip-icon`}
                                    ml={2}
                                    role="tooltip-icon"
                                    onClick={() => onToggle()}
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
                        colorScheme={colorScheme}
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
