// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useReducer, useEffect, ReactElement } from 'react';
import {
    VStack,
    StackProps,
    Box,
    Text,
    Flex,
    Heading,
    Divider,
    FlexProps,
    Collapse,
    useBreakpointValue,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { StepInfo } from './node/steps/interfaces';
import theme from '../styles/theme';

interface State {
    stepNumberBgColor: string;
    stepBoxBg: string;
    stepBoxShadow: string;
    status: StepStatus;
    headerColor?: string;
    showBodyActions?: boolean;
    StepChecked?: ReactElement;
}

export enum StepStatus {
    NOT_ACTIVE = 'NOT_ACTIVE',
    ACTIVE = 'ACTIVE',
    SKIPPED = 'SKIPPED',
    COMPLETED = 'COMPLETED',
}

export interface StepProps extends StackProps {
    stepNumber?: number;
    title: string;
    subtitle: string;
    status: StepStatus;
    onActive?: (meta: StepInfo) => void;
}

export const StepBody = (props: FlexProps) => {
    const { children, ...boxProps } = props;
    return (
        <Flex direction="column" px={{ base: 3, md: 12 }} py={3} {...boxProps}>
            {children}
        </Flex>
    );
};

export const StepActions = (props: FlexProps) => {
    const { children, ...boxProps } = props;
    return (
        <Flex px={{ base: 3, md: 12 }} py={6} direction="column" {...boxProps}>
            {children}
        </Flex>
    );
};

const activeProps = {
    stepNumberBgColor: 'blue.500',
    stepBoxBg: 'white',
    stepBoxShadow: 'base',
    showBodyActions: true,
};

const inactiveProps = {
    stepNumberBgColor: 'gray',
    stepBoxBg: 'trasparent',
    stepBoxShadow: 'none',
    headerColor: '#939393',
    showBodyActions: false,
};

const defaultState: State = {
    status: StepStatus.NOT_ACTIVE,
    ...inactiveProps,
};

const reducer = (state = defaultState, { type }): State => {
    const status = type;
    switch (type) {
        case StepStatus.ACTIVE:
            return {
                ...activeProps,
                status,
            };
        case StepStatus.COMPLETED:
            return {
                ...activeProps,
                StepChecked: <CheckIcon />,
                showBodyActions: false,
                status,
            };
        case StepStatus.SKIPPED:
            return {
                ...activeProps,
                status,
            };
        default:
            return { ...defaultState };
    }
};

export const Step = ({
    stepNumber,
    children,
    title,
    subtitle,
    status,
    onActive,
    ...stackProps
}: StepProps) => {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const stepActionProps: FlexProps = isSmallScreen
        ? {
              position: 'sticky',
              bottom: 0,
              bgColor: 'white',
              boxShadow: '0px -4px 8px rgb(47 32 27 / 4%)',
              zIndex: theme.zIndices.xxl,
          }
        : {};
    const res = React.Children.toArray(children).reduce(
        (prev: any, cur: any) => {
            prev[cur.type.name] = cur;
            return prev;
        },
        {}
    );

    const [state, dispatch] = useReducer(reducer, defaultState);

    useEffect(() => {
        dispatch({ type: status });

        if (status === StepStatus.ACTIVE)
            onActive && onActive({ title, subtitle });
    }, [status]);

    return (
        <VStack
            boxShadow={state.stepBoxShadow}
            bg={state.stepBoxBg}
            rounded="sm"
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
                            color="white"
                        >
                            {state.StepChecked || stepNumber}
                        </Box>
                    )}
                    <Box ml={3} color={state.headerColor}>
                        <Heading as="h2" fontSize={['2xl']}>
                            {title}
                        </Heading>
                        <Text size="sm">{subtitle}</Text>
                    </Box>
                </Flex>
            )}
            <Collapse in={state.showBodyActions} animateOpacity>
                {!isSmallScreen && <Divider w="full" />}
                {res.StepBody &&
                    React.cloneElement(res.StepBody, {
                        className: 'step-body',
                    })}
                {res.StepActions &&
                    React.cloneElement(res.StepActions, {
                        className: 'step-actions',
                        ...stepActionProps,
                    })}
            </Collapse>
        </VStack>
    );
};
