// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState, Fragment, FunctionComponent } from 'react';
import {
    VStack,
    Box,
    BoxProps,
    Heading,
    Text,
    Flex,
    useBreakpointValue,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { VSeparator, HSeparator } from './Separator';
import { IStepMeta, IStep } from './interfaces';
import { range } from 'lodash/fp';
import { CheckIcon } from '@chakra-ui/icons';
import theme from '../../styles/theme';

type HeaderType = {
    currentStep: number;
    totalSteps: number;
    title: string;
    subtitle: string;
} & BoxProps;

export interface StepGroupProps {
    mobileHeaderProps?: BoxProps;
    steps: FunctionComponent<IStep>[];
}

const Header = ({
    currentStep,
    totalSteps,
    title,
    subtitle,
    ...boxProps
}: HeaderType) => {
    const bgColor = useColorModeValue('white', 'gray.700');
    const linkColor = useColorModeValue('gray', 'gray.100');
    const stepNumberBg = useColorModeValue('blue.500', 'blue.200');
    const stepNumberColor = useColorModeValue('white', 'black');
    return (
        <Box
            boxShadow="base"
            rounded="sm"
            bgColor={bgColor}
            position="sticky"
            zIndex={theme.zIndices.lg}
            top={0}
            px={{ base: 3, md: 12 }}
            py={4}
            pb={3}
            className="step-group-mob-header"
            {...boxProps}
        >
            <Flex pl={1} direction="column">
                <Link
                    // TODO: Replace with new upcoming tutorial
                    href="https://medium.com/cartesi/running-a-node-and-staking-42523863970e"
                    target="_blank"
                    color={linkColor}
                    fontWeight="medium"
                    textDecorationLine="underline"
                    fontSize="sm"
                    alignSelf="flex-end"
                    pr={1}
                    pb={2}
                >
                    Learn from tutorial
                </Link>
                <Heading as="h3" size="md">
                    {title}
                </Heading>
                <Text fontSize="1rem">{subtitle}</Text>
            </Flex>

            <Flex justifyContent="space-between" mt={3}>
                {range(0, totalSteps).map((val) => {
                    const number = val + 1;
                    const isLast = number === totalSteps;
                    const isPast = number < currentStep;
                    const isAhead = number > currentStep;
                    const bgColor = isAhead ? 'gray' : stepNumberBg;
                    const color = isAhead ? 'white' : stepNumberColor;
                    const StepChecked = isPast ? <CheckIcon /> : null;

                    return (
                        <Fragment key={number}>
                            <Box
                                h={8}
                                minW={8}
                                rounded="full"
                                bgColor={bgColor}
                                display="grid"
                                placeContent="center"
                                color={color}
                                fontSize={14}
                            >
                                {StepChecked || number}
                            </Box>
                            {!isLast && (
                                <HSeparator active={currentStep >= number} />
                            )}
                        </Fragment>
                    );
                })}
            </Flex>
        </Box>
    );
};

export const StepGroup = ({ mobileHeaderProps, steps }: StepGroupProps) => {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [stepMeta, setStepMeta] = useState<IStepMeta>();
    const [currentStep, setCurrentStep] = useState(1);
    const onComplete = () => setCurrentStep(currentStep + 1);
    const onPrevious = () =>
        setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep);
    const onStepActive = (data: IStepMeta) => setStepMeta(data);

    return (
        <VStack alignItems="stretch">
            {isSmallScreen && (
                <Header
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    title={stepMeta?.title}
                    subtitle={stepMeta?.subtitle}
                    display={{ md: 'none' }}
                    {...mobileHeaderProps}
                />
            )}
            {steps?.map((Step, i) => {
                const stepNumber = i + 1;
                const inFocus = currentStep === stepNumber;
                const isLast = steps.length === stepNumber;
                return (
                    <Fragment key={i}>
                        <Step
                            inFocus={inFocus}
                            stepNumber={stepNumber}
                            key={i}
                            onComplete={onComplete}
                            onPrevious={onPrevious}
                            onStepActive={onStepActive}
                        />
                        {!isSmallScreen && !isLast && (
                            <VSeparator active={currentStep >= stepNumber} />
                        )}
                    </Fragment>
                );
            })}
        </VStack>
    );
};
