// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Button, Field, Input, InputGroup, Stack } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { isEmpty, isFunction, isNil, omit } from 'lodash/fp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStaking } from '../../../services/staking';
import { useCartesiToken } from '../../../services/token';
import { useMessages } from '../../../utils/messages';
import { toBigNumber } from '../../../utils/numberParser';
import { useWallet } from '../../wallet';
import { hiredNodeAddressAtom } from './HireNode.atoms';
import { useColorModeValue } from '../../ui/color-mode';

import {
    BaseInput,
    OptionalMappedErrors,
    ValidationResult,
} from '../../BaseInput';
import { ConnectWallet } from '../../header';
import { Notification } from '../../Notification';
import { Step, StepActions, StepBody } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import TransactionBanner from '../../TransactionBanner';

const useStyle = () => {
    const helperTxtColor = useColorModeValue('gray', 'gray.100');
    return { helperTxtColor };
};

type Validation = ValidationResult<'allowance'>;
type AllowanceInput = BaseInput<'allowance'>;
type Errors = OptionalMappedErrors<Validation>;
type AllowanceField = { allowance?: number };

const validate = (allowance: number) => {
    if (allowance <= 0)
        return useMessages('field.value.should.beGreaterThan', 0, 'Allowance');
    return true;
};

const SetAllowanceInput = ({
    onChange,
    onValidationChange,
}: AllowanceInput) => {
    const { helperTxtColor } = useStyle();
    const {
        register,
        trigger,
        formState: { errors },
    } = useForm<AllowanceField>();

    const {
        onChange: onChangeValidate,
        name,
        ref,
    } = register('allowance', {
        valueAsNumber: true,
        required: {
            value: true,
            message: useMessages('field.isRequired'),
        },
        validate,
    });

    const { allowance: allowanceErrors } = errors;

    useEffect(() => {
        if (!isFunction(onValidationChange)) return;

        const validation: Validation = {
            name: 'allowance',
            isValid: isEmpty(allowanceErrors),
        };
        if (!isEmpty(allowanceErrors)) {
            const { type, message } = allowanceErrors;
            validation.error = { message, type };
        }

        onValidationChange(validation);
    }, [allowanceErrors]);

    return (
        <Field.Root
            pr={{ base: 0, md: '20vw' }}
            my={4}
            invalid={!isNil(allowanceErrors)}
        >
            <Field.Label htmlFor="allowance_amount" fontWeight="medium">
                Enter the allowance
            </Field.Label>
            <InputGroup
                endElement={
                    <Box color="gray" fontSize={12}>
                        CTSI
                    </Box>
                }
            >
                <Input
                    id="allowance_amount"
                    type="number"
                    size="lg"
                    onBlur={() => trigger('allowance')}
                    ref={ref}
                    name={name}
                    onChange={(evt) => {
                        onChangeValidate(evt);
                        onChange(evt?.target.value);
                        trigger('allowance');
                    }}
                />
            </InputGroup>
            <Field.ErrorText>{allowanceErrors?.message}</Field.ErrorText>
            <Field.HelperText color={helperTxtColor} fontSize={14}>
                This is going to be the maximum amount of CTSI that Cartesi’s
                staking contract will be able to receive from your personal
                account.
            </Field.HelperText>
        </Field.Root>
    );
};

const enableBtnWhen = (
    allowance: string,
    transactionInProgress: boolean,
    errors: Errors
) => !isEmpty(allowance) && !transactionInProgress && isEmpty(errors);

const SetAllowance = ({
    stepNumber,
    currentStep,
    inFocus,
    onStepActive,
}: IStep) => {
    const [hiredNodeAddress] = useAtom(hiredNodeAddressAtom);
    const router = useRouter();
    const wallet = useWallet();
    const { account, active } = wallet;
    const { staking } = useStaking(account);
    const { approve, transaction } = useCartesiToken(account, staking?.address);

    const [stepState] = useStepState({ inFocus });
    const [allowanceAmount, setAllowance] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const bg = useColorModeValue('white', 'dark.background.secondary');
    const borderColor = useColorModeValue(
        'light.grey.tertiary',
        'dark.border.quaternary'
    );
    const buttonColorScheme = useColorModeValue('teal', 'cyan');
    const isHighlighted =
        stepNumber - 1 === currentStep || stepNumber <= currentStep;
    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };

    const enableBtn =
        enableBtnWhen(allowanceAmount, transaction.isOngoing, errors) && active;

    const isStepCompleted = transaction?.state === 'confirmed';

    useEffect(() => {
        if (isStepCompleted) {
            router.push(
                isEmpty(hiredNodeAddress)
                    ? '/node-runners'
                    : `/node/${hiredNodeAddress}/manage`
            );
        }
    }, [hiredNodeAddress, isStepCompleted, router]);

    return (
        <Step
            title="Set Allowance"
            subtitle="Final steps to run your node."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
            bg={isHighlighted ? bg : undefined}
            borderRadius={'md'}
            borderWidth={isHighlighted ? '1px' : 0}
            borderColor={borderColor}
            borderStyle={'solid'}
        >
            <StepBody>
                {!active && (
                    <Notification
                        title={useMessages('wallet.is.disconnected')}
                        status="warning"
                    >
                        <ConnectWallet wallet={wallet} />
                    </Notification>
                )}

                <TransactionBanner
                    title="Setting the allowance..."
                    failTitle="Setting the allowance failed"
                    successDescription="Allowance set!"
                    transaction={transaction}
                />
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
                        disabled={!enableBtn}
                        minWidth={{ base: '10rem' }}
                        colorPalette={buttonColorScheme}
                        loading={transaction.isOngoing}
                        onClick={() =>
                            approve(
                                staking.address,
                                toBigNumber(allowanceAmount)
                            )
                        }
                    >
                        RUN YOUR NODE
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default SetAllowance;
