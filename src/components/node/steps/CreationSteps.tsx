import React, { useState } from 'react';
import { VStack, Divider, Box, BoxProps } from '@chakra-ui/react';

import CustomizeEthereumNode from './CustomizeEthereumNode';
import SetUpNode from './SetUpNode';
import HireNode from './HireNode';
import SetAllowance from './SetAllowance';
import { StepInfo } from './interfaces';

type SeparatorProps = {
    active: boolean;
    boxProps?: BoxProps;
    orientation?: 'horizontal' | 'vertical';
};

const Separator = (props: SeparatorProps) => {
    const orientation = props.orientation || 'vertical';
    const dividerProps = props.active
        ? { borderColor: 'black', h: 8 }
        : { marginTop: '-2rem' };

    return (
        <Box
            px={{ base: 7, md: 16 }}
            m="0px !important"
            h={props.active ? 6 : '0.5rem'}
            {...props.boxProps}
        >
            <Divider orientation={orientation} h="3.5rem" {...dividerProps} />
        </Box>
    );
};

const steps = [CustomizeEthereumNode, SetUpNode, HireNode, SetAllowance];

const CreationSteps = () => {
    const [stepMeta, setStepMeta] = useState<StepInfo>();
    const [currentStep, setCurrentStep] = useState(1);
    const onComplete = () => setCurrentStep(currentStep + 1);
    const onPrevious = () => setCurrentStep(currentStep - 1);
    const onStepActive = (stepInfo: StepInfo) => setStepMeta(stepInfo);

    console.log(stepMeta);

    return (
        <VStack alignItems="stretch">
            {steps.map((Step, i) => {
                const stepNumber = i + 1;
                const inFocus = currentStep === stepNumber;
                const isLast = steps.length === stepNumber;
                return (
                    <>
                        <Step
                            inFocus={inFocus}
                            stepNumber={stepNumber}
                            key={i}
                            onComplete={onComplete}
                            onPrevious={onPrevious}
                            onStepActive={onStepActive}
                        />
                        {!isLast && (
                            <Separator active={currentStep >= stepNumber} />
                        )}
                    </>
                );
            })}
        </VStack>
    );
};

export default CreationSteps;
