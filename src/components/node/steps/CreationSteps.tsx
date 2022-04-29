import React, { useState } from 'react';
import { VStack, Divider, Box } from '@chakra-ui/react';

import CustomizeEthereumNode from './CustomizeEthereumNode';
import SetUpNode from './SetUpNode';
import HireNode from './HireNode';
import SetAllowance from './SetAllowance';

type SeparatorProps = { active: boolean };

const Separator = (props: SeparatorProps) => {
    const dividerProps = props.active
        ? { borderColor: 'black', h: 8 }
        : { marginTop: '-2rem' };

    return (
        <Box
            px={{ base: 7, md: 16 }}
            m="0px !important"
            h={props.active ? 6 : '0.5rem'}
        >
            <Divider orientation="vertical" h="3.5rem" {...dividerProps} />
        </Box>
    );
};

const CreationSteps = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const onComplete = () => setCurrentStep(currentStep + 1);
    const onPrevious = () => setCurrentStep(currentStep - 1);

    return (
        <VStack alignItems="stretch">
            <CustomizeEthereumNode
                stepNumber={1}
                inFocus={currentStep === 1}
                onComplete={onComplete}
            />
            <Separator active={currentStep >= 1} />

            <SetUpNode
                stepNumber={2}
                inFocus={currentStep === 2}
                onComplete={onComplete}
                onPrevious={onPrevious}
            />
            <Separator active={currentStep >= 2} />
            <HireNode
                stepNumber={3}
                inFocus={currentStep === 3}
                onComplete={onComplete}
                onPrevious={onPrevious}
            />
            <Separator active={currentStep >= 3} />
            <SetAllowance
                stepNumber={4}
                inFocus={currentStep === 4}
                onComplete={onComplete}
            />
        </VStack>
    );
};

export default CreationSteps;
