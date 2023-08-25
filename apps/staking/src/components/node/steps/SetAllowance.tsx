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
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useWallet } from '@explorer/wallet';
import { useAtom } from 'jotai';
import { isEmpty, isFunction, isNil, omit } from 'lodash/fp';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStaking } from '../../../services/staking';
import { useCartesiToken } from '../../../services/token';
import { useMessages } from '../../../utils/messages';
import { toBigNumber } from '../../../utils/numberParser';
import { hiredNodeAddressAtom } from './HireNode.atoms';

import { ConnectWallet, Notification } from '@explorer/ui';
import {
    BaseInput,
    OptionalMappedErrors,
    ValidationResult,
} from '../../BaseInput';
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
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            my={4}
            isInvalid={!isNil(allowanceErrors)}
        >
            <FormLabel htmlFor="allowance_amount" fontWeight="medium">
                Enter the allowance
            </FormLabel>
            <InputGroup>
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
                <InputRightElement
                    children="CTSI"
                    m={1}
                    mr={2}
                    color="gray"
                    fontSize={12}
                />
            </InputGroup>
            <FormErrorMessage>{allowanceErrors?.message}</FormErrorMessage>
            <FormHelperText color={helperTxtColor} fontSize={14}>
                This is going to be the maximum amount of CTSI that Cartesi’s
                staking contract will be able to receive from your personal
                account.
            </FormHelperText>
        </FormControl>
    );
};

const enableBtnWhen = (
    allowance: string,
    transactionInProgress: boolean,
    errors: Errors
) => !isEmpty(allowance) && !transactionInProgress && isEmpty(errors);

const buildURL = (nodeAddress: string) =>
    !isEmpty(nodeAddress) ? `/node/${nodeAddress}/manage` : '/node-runners';

const SetAllowance = ({ stepNumber, inFocus, onStepActive }: IStep) => {
    const [hiredNodeAddress] = useAtom(hiredNodeAddressAtom);
    const router = useRouter();
    const wallet = useWallet();
    const { account, active } = wallet;
    const { staking } = useStaking(account);
    const { approve, transaction } = useCartesiToken(account, staking?.address);

    const [stepState] = useStepState({ inFocus });
    const [allowanceAmount, setAllowance] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const bg = useColorModeValue('teal.light', 'rgba(255, 255, 255, 0.06)');
    const borderColor = useColorModeValue(
        'light.grey.tertiary',
        'rgba(255, 255, 255, 0.10)'
    );
    const { colorMode } = useColorMode();
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
            router.push(buildURL(hiredNodeAddress));
        }
    }, [isStepCompleted]);

    return (
        <Step
            title="Set Allowance"
            subtitle="Final steps to run your node."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
            bg={bg}
            borderRadius={'md'}
            borderWidth={'1px'}
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
                        colorScheme={colorMode === 'dark' ? 'cyan' : 'teal'}
                        isLoading={transaction.isOngoing}
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
