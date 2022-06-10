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
    Text,
    Box,
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
import { isNil, isEmpty, isFunction, omit } from 'lodash/fp';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '../../../contexts/wallet';
import { useBalance } from '../../../services/eth';
import { useNode, NodeStatus } from '../../../services/node';
import { Transaction } from '../../../services/transaction';
import { useMessages } from '../../../utils/messages';
import { formatValue } from '../../../utils/numberFormatter';
import { toBigNumber } from '../../../utils/numberParser';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { BaseInput, ValidationResult, MappedErrors } from '../../BaseInput';
import TransactionBanner from '../TransactionBanner';
import { hiredNodeAddressAtom } from './HireNode.atoms';
import { NodeInput, NodeField, evaluateNode } from '../inputs/NodeInput';

type DepositField = 'deposit';

interface InitialFundsInput extends BaseInput<DepositField> {
    min: number;
    max: number;
}

type Validation = ValidationResult<NodeField | DepositField>;
type Errors = Partial<MappedErrors<Validation>>;

const { COMPLETED } = StepStatus;

const numberFormatOpts: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
};

const useStyle = () => {
    const helperTxtColor = useColorModeValue('gray', 'gray.100');
    const tipsBgColor = useColorModeValue('gray.80', 'gray.800');
    return {
        helperTxtColor,
        tipsBgColor,
    };
};

const InitialFundsInput = ({
    onChange,
    min,
    max,
    onValidationChange,
}: InitialFundsInput) => {
    const { helperTxtColor } = useStyle();
    const { account } = useWallet();
    const userBalance = useBalance(account);
    const ethBalance = userBalance
        ? formatValue(userBalance, 'eth', numberFormatOpts)
        : '0.00';
    const {
        register,
        formState: { errors },
        trigger,
    } = useForm<{ deposit: number }>();

    const validate = (value: number) => {
        if (toBigNumber(value.toString()).gt(userBalance)) {
            return 'Insufficient ETH balance';
        }
        return true;
    };

    const {
        name,
        onChange: onChangeValidate,
        ref,
    } = register('deposit', {
        shouldUnregister: true,
        valueAsNumber: true,
        validate,
        required: {
            value: true,
            message: useMessages('field.isRequired'),
        },
        max: {
            value: max,
            message: useMessages('deposit.maxAllowed', max),
        },
        min: {
            value: min,
            message: useMessages('deposit.minAllowed', min),
        },
    });

    const { deposit: depositErrors } = errors;

    useEffect(() => {
        if (!isFunction(onValidationChange)) return;

        const validation: Validation = {
            name: 'deposit',
            isValid: isEmpty(depositErrors),
        };
        if (!isEmpty(depositErrors)) {
            const { type, message } = depositErrors;
            validation.error = { message, type };
        }

        onValidationChange(validation);
    }, [depositErrors]);

    return (
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            isInvalid={!isNil(depositErrors)}
        >
            <FormLabel htmlFor="initial_funds" fontWeight="medium">
                Initial Funds
            </FormLabel>
            <InputGroup>
                <Input
                    size="lg"
                    ref={ref}
                    id="initial_funds"
                    name={name}
                    type="number"
                    onBlur={() => trigger('deposit')}
                    onChange={(evt) => {
                        onChangeValidate(evt);
                        onChange(evt?.target?.value);
                        //trigger validations for registered field called deposit
                        trigger('deposit');
                    }}
                />
                <InputRightElement
                    children="ETH"
                    m={1}
                    mr={2}
                    color="gray"
                    fontSize={12}
                />
            </InputGroup>
            <FormErrorMessage>{depositErrors?.message}</FormErrorMessage>
            <FormHelperText color={helperTxtColor} fontSize={14}>
                Your balance: {ethBalance} ETH
            </FormHelperText>
        </FormControl>
    );
};

const enableNextWhen = (
    funds: string,
    nodeStatus: NodeStatus,
    errors: Errors
): boolean => {
    return nodeStatus === 'available' && isEmpty(errors) && !isEmpty(funds);
};

const isNodeHiringCompleted = (transaction: Transaction<any>) =>
    transaction.receipt?.confirmations >= 1;

const HireNode = ({
    stepNumber,
    onComplete,
    onPrevious,
    onStepActive,
    inFocus,
}: IStep) => {
    const [, setNodeAddressAtom] = useAtom(hiredNodeAddressAtom);
    const { tipsBgColor } = useStyle();
    const [stepState, setStepState] = useStepState({ inFocus });
    const { account } = useWallet();
    const [nodeAddress, setNodeAddress] = useState<string | null>();
    const [initialFunds, setInitialFunds] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const node = useNode(nodeAddress);
    const { status } = evaluateNode(account, node);
    const enableNext = enableNextWhen(initialFunds, status, errors);
    const { transaction } = node;
    const isStepCompleted = isNodeHiringCompleted(transaction);

    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };

    useEffect(() => {
        if (isStepCompleted) {
            setNodeAddressAtom(nodeAddress);
            setStepState(COMPLETED);
            onComplete && onComplete();
        }
    }, [isStepCompleted]);

    return (
        <Step
            title="Hire Node"
            subtitle="At this point, stake your funds using Cartesi Explorer."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                <TransactionBanner
                    title="Hiring the node..."
                    failTitle="Hiring the node failed"
                    successDescription="Node hired! moving to the next step..."
                    transaction={node.transaction}
                />
                <NodeInput
                    onValidationChange={handleValidation}
                    onChange={setNodeAddress}
                    helperText="You may find from the docker configuration"
                    account={account}
                    node={node}
                />
                <InitialFundsInput
                    onValidationChange={handleValidation}
                    onChange={setInitialFunds}
                    max={3}
                    min={0.001}
                />
                <Box px={6} py={4} bgColor={tipsBgColor} mt={6}>
                    <Text>
                        You need to specify the amount of ETH you want to give
                        to your node. The node holds a separate Ethereum account
                        and key pair, and only spends your ETH to accept being
                        hired during setup (only once) and then to produce
                        blocks. That means you only incur transaction fee
                        expenses when you are rewarded with CTSI.
                    </Text>
                </Box>
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'space-between', md: 'flex-start' }}
                >
                    <Button
                        variant="ghost"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={() => {
                            onPrevious && onPrevious();
                        }}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        disabled={!enableNext || node.transaction?.submitting}
                        isLoading={node.transaction?.submitting}
                        colorScheme="blue"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={() => node.hire(toBigNumber(initialFunds))}
                    >
                        NEXT
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default HireNode;
