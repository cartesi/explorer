// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    InputGroup,
    Input,
    InputRightElement,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { isEmpty, omit } from 'lodash/fp';
import { useState } from 'react';
import {
    BaseInput,
    ValidationResult,
    OptionalMappedErrors,
} from '../../BaseInput';
import { Step, StepActions, StepBody } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';

const useStyle = () => {
    const helperTxtColor = useColorModeValue('gray', 'gray.100');
    return { helperTxtColor };
};

type Validation = ValidationResult<'allowance'>;
type AllowanceInput = BaseInput<'allowance'>;
type Errors = OptionalMappedErrors<Validation>;

const SetAllowanceInput = ({
    onChange,
    onValidationChange,
}: AllowanceInput) => {
    const { helperTxtColor } = useStyle();
    return (
        <FormControl pr={{ base: 0, md: '20vw' }} my={4}>
            <FormLabel htmlFor="allowance_amount" fontWeight="medium">
                Enter the allowance
            </FormLabel>
            <InputGroup>
                <Input
                    id="allowance_amount"
                    type="number"
                    size="lg"
                    onChange={(evt) => onChange(evt?.target?.value)}
                />
                <InputRightElement
                    children="CTSI"
                    m={1}
                    mr={2}
                    color="gray"
                    fontSize={12}
                />
            </InputGroup>
            <FormHelperText color={helperTxtColor} fontSize={14}>
                This is going to be the maximum amount of CTSI that Cartesi’s
                staking contract will be able to receive from your personal
                account.
            </FormHelperText>
            <FormErrorMessage></FormErrorMessage>
        </FormControl>
    );
};

const SetAllowance = ({ stepNumber, inFocus, onStepActive }: IStep) => {
    const [stepState] = useStepState({ inFocus });
    const [allowanceAmount, setAllowance] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});

    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };

    return (
        <Step
            title="Set Allowance"
            subtitle="Final steps to run your node."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                <SetAllowanceInput
                    onChange={setAllowance}
                    onValidationChange={handleValidation}
                />
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'flex-end', md: 'flex-start' }}
                >
                    <Button
                        disabled={isEmpty(allowanceAmount)}
                        minWidth={{ base: '10rem' }}
                        colorScheme="blue"
                        onClick={() => console.log('go somewhere')}
                    >
                        RUN YOUR NODE
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default SetAllowance;
