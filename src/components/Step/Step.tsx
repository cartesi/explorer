// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FaCheck } from 'react-icons/fa';

import {
    Box,
    Flex,
    FlexProps,
    Heading,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect, useReducer } from 'react';
import theme from '../../styles/theme';
import { StepStatus } from './enums';
import { StepProps } from './interfaces';
import { useColorModeValue } from '../ui/color-mode';

interface State {
    stepNumberBgColor: string;
    stepNumberColor?: string;
    stepBoxBg: string;
    stepBoxShadow: string;
    status: StepStatus;
    headerColor?: string;
    showBodyActions?: boolean;
    StepChecked?: ReactElement;
}

const reducer = (state, { type, payload }): State => {
    const status = type;
    switch (type) {
        case StepStatus.ACTIVE:
            return {
                ...payload.activeProps,
                status,
            };
        case StepStatus.COMPLETED:
            return {
                ...payload.activeProps,
                StepChecked: <FaCheck />,
                showBodyActions: false,
                status,
            };
        case StepStatus.NOT_ACTIVE:
        default:
            return { ...payload.inactiveProps };
    }
};

export const Step = ({
    stepNumber,
    children,
    title,
    subtitle,
    status,
    onActive,
    optionalText,
    ...stackProps
}: StepProps) => {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const stepBoxBg = useColorModeValue('white', 'dark.gray.primary');
    const stepNumberBgColor = useColorModeValue(
        'light.primary',
        'cyan.primary'
    );
    const stepNumberColor = useColorModeValue('white', 'black');
    const activeProps = {
        stepBoxShadow: 'sm',
        showBodyActions: true,
        stepBoxBg,
        stepNumberBgColor,
        stepNumberColor,
    };

    const inactiveProps = {
        stepNumberBgColor: 'gray',
        stepNumberColor: 'white',
        stepBoxBg: 'transparent',
        stepBoxShadow: 'none',
        headerColor: '#939393',
        showBodyActions: false,
    };

    const stepActionProps: FlexProps = isSmallScreen
        ? {
              position: 'sticky',
              bottom: 0,
              bgColor: stepBoxBg,
              boxShadow: '0px -4px 8px rgb(47 32 27 / 4%)',
              zIndex: theme.tokens.getVar('zIndex.sm'),
          }
        : {};

    const res = React.Children.toArray(children).reduce(
        (prev: any, cur: any) => {
            prev[cur.type.displayName] = cur;
            return prev;
        },
        {}
    );

    const [state, dispatch] = useReducer(reducer, {
        ...inactiveProps,
        status: StepStatus.NOT_ACTIVE,
    });

    useEffect(() => {
        if (status === StepStatus.ACTIVE) onActive?.({ title, subtitle });
    }, [status]);

    useEffect(() => {
        dispatch({
            type: status,
            payload: {
                activeProps,
                inactiveProps,
            },
        });
    }, [stepBoxBg, status]);

    return (
        <VStack
            boxShadow={state.stepBoxShadow}
            bg={state.stepBoxBg}
            rounded="md"
            className="step-box"
            align="stretch"
            mt={isSmallScreen ? '0px !important' : null}
            {...stackProps}
        >
            {!isSmallScreen && (
                <Flex
                    px={{ base: 3, md: 12 }}
                    py={6}
                    pb={4}
                    className="step-header"
                    alignItems="baseline"
                >
                    {stepNumber && (
                        <Box
                            h={8}
                            minWidth={8}
                            rounded="full"
                            bgColor={state.stepNumberBgColor}
                            display="grid"
                            placeContent="center"
                            color={state.stepNumberColor}
                        >
                            {state.StepChecked || stepNumber}
                        </Box>
                    )}
                    <Box ml={3} color={state.headerColor}>
                        <Heading as="h2" fontSize={['2xl']}>
                            {title}
                        </Heading>
                        <Text fontSize="md">{subtitle}</Text>
                    </Box>
                    {optionalText && (
                        <Text
                            ml="auto"
                            alignSelf="flex-start"
                            color="grey.support"
                        >
                            {optionalText}
                        </Text>
                    )}
                </Flex>
            )}
            {state.showBodyActions && (
                <Box>
                    {!isSmallScreen && <hr />}
                    {res.StepBody &&
                        React.cloneElement(res.StepBody, {
                            className: 'step-body',
                        })}
                    {res.StepActions &&
                        React.cloneElement(res.StepActions, {
                            className: 'step-actions',
                            ...stepActionProps,
                        })}
                </Box>
            )}
        </VStack>
    );
};
