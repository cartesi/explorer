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
import { ChangeEvent, ReactNode, useState, useEffect } from 'react';
import {
    BaseInput,
    OptionalMappedErrors,
    ValidationResult,
} from '../../BaseInput';
import { useMessages } from '../../../utils/messages';
import { Path, RegisterOptions, useForm } from 'react-hook-form';
import { isEmpty, isFunction, isNil, omit } from 'lodash/fp';

interface SimpleInputProps {
    label: string;
    id: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    inputRightElement?: ReactNode;
    onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (evt: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (evt: ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    type?: string;
    reference?: any;
    name?: string;
}

const SimpleInput = ({
    onChange,
    onBlur,
    onFocus,
    label,
    id,
    inputRightElement,
    isDisabled,
    isInvalid,
    errorMessage,
    type,
    reference,
    name,
}: SimpleInputProps) => {
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
                <Input
                    name={name}
                    type={type || 'text'}
                    ref={reference}
                    id={id}
                    size="lg"
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
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
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
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

type UseFieldValidatorProps<T, V> = {
    fieldName: Path<T>;
    options?: RegisterOptions<T>;
    onValidationChange?: (vr: ValidationResult<V>) => void;
};

const useFieldValidator = <FormValidatorType, ValidationResultType>({
    fieldName,
    options,
    onValidationChange,
}: UseFieldValidatorProps<FormValidatorType, ValidationResultType>) => {
    const {
        register,
        formState: { errors, isDirty },
        getValues,
        trigger,
        reset,
        clearErrors,
    } = useForm<FormValidatorType>();

    const registerReturn = register(fieldName, {
        shouldUnregister: true,
        valueAsNumber: true,
        required: {
            value: true,
            message: useMessages('field.isRequired'),
        },
        ...options,
    });

    const inputErrors = errors[fieldName as string];

    useEffect(() => {
        if (!isFunction(onValidationChange)) return;

        const validation: ValidationResult = {
            name: fieldName as string,
            isValid: isEmpty(inputErrors),
        };
        if (!isEmpty(inputErrors)) {
            const { type, message } = inputErrors;
            validation.error = { message, type };
        }

        onValidationChange(validation);
    }, [inputErrors]);

    return {
        registerReturn,
        trigger,
        errors,
        reset,
        clearErrors,
        isDirty,
        getValue: () => getValues(fieldName),
    };
};

const options = {
    max: {
        value: 100,
        message: useMessages('field.value.max.allowed', 100),
    },
    min: {
        value: 0,
        message: useMessages('field.value.min.allowed', 0),
    },
};
const FlatRateCommission = ({
    onChange,
    onValidationChange,
    isDisabled,
}: FlatRateCommisionProps) => {
    type FormField = { [k in FlatRateModel]: number };
    const howItWorks = useMessages('commission.model.flatRate.howItWorks');
    const validator = useFieldValidator<FormField, FlatRateModel>({
        fieldName: 'flatRateCommission',
        options,
        onValidationChange,
    });
    const { trigger, registerReturn, errors, clearErrors, isDirty } = validator;
    const { name, onChange: onChangeValidate, ref } = registerReturn;

    useEffect(() => {
        if (isDisabled) {
            clearErrors();
            return;
        }

        if (isDirty) trigger('flatRateCommission');
    }, [isDisabled]);

    return (
        <VStack spacing={3}>
            <SimpleInput
                name={name}
                type="number"
                reference={ref}
                onChange={(e) => {
                    onChange(e.currentTarget?.value);
                    onChangeValidate(e);
                    trigger('flatRateCommission');
                }}
                onBlur={(e) => trigger('flatRateCommission')}
                onFocus={(e) => onChange(e.currentTarget?.value)}
                label="Flat-rate commission (%)"
                id="flatRateCommission"
                inputRightElement="%"
                isDisabled={isDisabled}
                isInvalid={!isNil(errors.flatRateCommission)}
                errorMessage={errors.flatRateCommission?.message}
            />
            <Message content={howItWorks} />
        </VStack>
    );
};

const GasBasedCommission = ({
    onChange,
    onValidationChange,
    isDisabled,
}: GasBasedCommissionProps) => {
    type FormField = { [k in GasBasedModel]: number };
    const howItWorks = useMessages('commission.model.gasBased.howItWorks');
    const validator = useFieldValidator<FormField, GasBasedModel>({
        fieldName: 'gasBasedCommission',
        onValidationChange,
    });

    const { trigger, registerReturn, errors, clearErrors, isDirty } = validator;
    const { name, onChange: onChangeValidate, ref } = registerReturn;
    const { gasBasedCommission: inputErrors } = errors;

    useEffect(() => {
        if (isDisabled) {
            clearErrors();
            return;
        }

        if (isDirty) trigger('gasBasedCommission');
    }, [isDisabled]);

    return (
        <VStack spacing={3}>
            <SimpleInput
                name={name}
                type="number"
                reference={ref}
                onChange={(e) => {
                    onChange(e.currentTarget?.value);
                    onChangeValidate(e);
                    trigger('gasBasedCommission');
                }}
                onBlur={(e) => trigger('gasBasedCommission')}
                onFocus={(e) => onChange(e.currentTarget?.value)}
                label="Gas-based commission (Gas)"
                id="gasBasedCommission"
                inputRightElement="ETH"
                isDisabled={isDisabled}
                isInvalid={!isNil(inputErrors)}
                errorMessage={inputErrors?.message}
            />
            <Message content={howItWorks} />
        </VStack>
    );
};

const { COMPLETED } = StepStatus;
type Validation = ValidationResult<FlatRateModel | GasBasedModel>;
type Errors = OptionalMappedErrors<Validation>;

const CommissionModel = ({
    stepNumber,
    inFocus,
    onComplete,
    onPrevious,
    onStepActive,
}: IStep) => {
    const [stepState, setStepState] = useStepState({ inFocus });
    const [modelType, setModelType] =
        useState<CommissionModels>('flatRateCommission');
    const [commissionValue, setCommissionValue] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const radioHandler = (v: CommissionModels) => setModelType(v);

    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };

    console.log(errors);
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
                    <FlatRateCommission
                        onChange={setCommissionValue}
                        isDisabled={modelType !== 'flatRateCommission'}
                        onValidationChange={handleValidation}
                    />
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
                    <GasBasedCommission
                        onChange={setCommissionValue}
                        isDisabled={modelType !== 'gasBasedCommission'}
                        onValidationChange={handleValidation}
                    />
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
