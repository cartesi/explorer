// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    Heading,
    Box,
    VStack,
    useColorModeValue,
    Text,
    BoxProps,
    RadioGroup,
    Radio,
    Stack,
    Button,
} from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { ChangeEvent, ReactNode, useState } from 'react';
import { BaseInput } from '../../BaseInput';
import { useMessages } from '../../../utils/messages';

interface SimpleInput {
    label: string;
    id: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    inputRightElement?: ReactNode;
    onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
}

const SimpleInput = ({
    onChange,
    label,
    isDisabled,
    isInvalid,
    id,
    inputRightElement,
}: SimpleInput) => {
    return (
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
        >
            <FormLabel htmlFor={id} fontWeight="medium">
                {label}
            </FormLabel>
            <InputGroup>
                <Input id={id} size="lg" onChange={onChange} />
                {inputRightElement && (
                    <InputRightElement
                        children={inputRightElement}
                        m={1}
                        mr={2}
                        color="gray"
                        fontSize={12}
                    />
                )}
            </InputGroup>
            <FormErrorMessage>{}</FormErrorMessage>
        </FormControl>
    );
};

type FlatRateModel = 'flatRateCommission';
type GasBasedModel = 'gasBasedCommission';
type FlatRateCommisionProps = BaseInput<FlatRateModel>;
type GasBasedCommissionProps = BaseInput<GasBasedModel>;
type CommissionModels = FlatRateModel | GasBasedModel;

const useStyle = () => {
    const tipsBgColor = useColorModeValue('gray.80', 'gray.800');
    return {
        tipsBgColor,
    };
};

type MessageProps = { content: string; boxProps?: BoxProps };
const Message = ({ content, boxProps }: MessageProps) => {
    const { tipsBgColor } = useStyle();

    return (
        <Box px={6} py={4} bgColor={tipsBgColor} {...boxProps}>
            <Text>{content}</Text>
        </Box>
    );
};

const FlatRateCommission = ({
    onChange,
    onValidationChange,
}: FlatRateCommisionProps) => {
    const howItWorks = useMessages('commission.model.flatRate.howItWorks');

    return (
        <VStack spacing={3}>
            <SimpleInput
                onChange={(e) => onChange(e.currentTarget?.value)}
                label="Flat-rate commission (%)"
                id="flatRateCommission"
                inputRightElement="%"
            />
            <Message content={howItWorks} />
        </VStack>
    );
};

const GasBasedCommission = ({
    onChange,
    onValidationChange,
}: GasBasedCommissionProps) => {
    const howItWorks = useMessages('commission.model.gasBased.howItWorks');
    return (
        <VStack spacing={3}>
            <SimpleInput
                onChange={(e) => onChange(e.currentTarget?.value)}
                label="Gas-based commission (Gas)"
                id="gasBasedCommission"
                inputRightElement="ETH"
            />
            <Message content={howItWorks} />
        </VStack>
    );
};

const { COMPLETED } = StepStatus;

const CommissionModel = ({
    stepNumber,
    inFocus,
    onComplete,
    onPrevious,
    onStepActive,
}: IStep) => {
    const [stepState, setStepState] = useStepState({ inFocus });
    const [modelType, setModelType] = useState<CommissionModels>();
    const [commissionValue, setCommissionValue] = useState<string | null>();
    const radioHandler = (v: CommissionModels) => setModelType(v);

    return (
        <Step
            title="Commission Model"
            subtitle="Choose the commission model and fee for your pool"
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                <Heading as="h3" size="sm" my={4}>
                    Choose commission model
                </Heading>

                <Stack direction="row" spacing={{ base: 3, md: 7 }} mt={2}>
                    <RadioGroup
                        onChange={radioHandler}
                        value={modelType}
                        pt={1}
                    >
                        <Radio
                            value="flatRateCommission"
                            isChecked={modelType === 'flatRateCommission'}
                        />
                    </RadioGroup>
                    <FlatRateCommission onChange={setCommissionValue} />
                </Stack>

                <Stack direction="row" spacing={{ base: 3, md: 7 }} mt={8}>
                    <RadioGroup
                        onChange={radioHandler}
                        value={modelType}
                        pt={1}
                    >
                        <Radio
                            value="gasBasedCommission"
                            isChecked={modelType === 'gasBasedCommission'}
                        />
                    </RadioGroup>
                    <GasBasedCommission onChange={setCommissionValue} />
                </Stack>
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'space-between', md: 'flex-start' }}
                >
                    <Button
                        variant="ghost"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(evt) => onPrevious && onPrevious(evt)}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        colorScheme="blue"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(evt) => {
                            onComplete();
                            setStepState(COMPLETED);
                        }}
                    >
                        CREATE POOL
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default CommissionModel;
