// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CheckIcon } from '@chakra-ui/icons';
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
    Spinner,
} from '@chakra-ui/react';
import { constant, matches, cond, stubTrue, isNil } from 'lodash/fp';
import { useEffect, useState } from 'react';
import { useWallet } from '../../../contexts/wallet';
import { useBalance } from '../../../services/eth';
import { useNode, Node } from '../../../services/node';
import { useMessages } from '../../../utils/messages';
import { formatValue } from '../../../utils/numberFormatter';
import { toBigNumber } from '../../../utils/numberParser';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep } from '../../StepGroup';
import { useForm } from 'react-hook-form';

const { ACTIVE, NOT_ACTIVE, COMPLETED } = StepStatus;

type NodeStatus = 'available' | 'owned' | 'pending' | 'retired' | 'none';

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

const evaluateNodeStatus = cond<Node, NodeStatus>([
    [matches({ available: true }), constant('available')],
    [matches({ retired: true }), constant('retired')],
    [matches({ pending: true }), constant('pending')],
    [matches({ owned: true }), constant('owned')],
    [stubTrue, constant('none')],
]);

const evaluateNode = (account: string, node: Node) => {
    const status = evaluateNodeStatus(node);
    const state = { isInvalid: false, errorMessage: '', status };
    const mine = account?.toLowerCase() === node?.user.toLowerCase();
    switch (status) {
        case 'owned':
            return {
                ...state,
                isInvalid: true,
                errorMessage: mine
                    ? useMessages('node.owned.mine')
                    : useMessages('node.owned.notMine'),
            };
        case 'pending':
            return {
                ...state,
                isInvalid: true,
                errorMessage: mine
                    ? useMessages('node.pending.mine')
                    : useMessages('node.pending.notMine'),
            };
        case 'retired':
            return {
                ...state,
                isInvalid: true,
                errorMessage: useMessages('node.retired'),
            };
        default:
            return state;
    }
};

interface InputError {
    name: string;
    message: string;
    type: string;
}
interface BaseInput {
    onChange: (address: string) => void;
    helperText?: string;
    onError?: (error: InputError) => void;
}

interface NodeInput extends BaseInput {
    node: Node;
    account: string;
}

interface InitialFundsInput extends BaseInput {
    min: number;
    max: number;
}

const NodeInput = ({ onChange, node, account, helperText }: NodeInput) => {
    const [value, setValue] = useState<string>('');
    const { isInvalid, errorMessage, status } = evaluateNode(account, node);
    const displayLoader = value && node.loading && status === 'none';
    const { helperTxtColor } = useStyle();
    const isAvailable = status === 'available';

    return (
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            mb={6}
            mt={4}
            isInvalid={isInvalid}
        >
            <FormLabel htmlFor="node_address" fontWeight="medium">
                Node Address
            </FormLabel>
            <InputGroup>
                <Input
                    id="node_address"
                    type="text"
                    size="lg"
                    onChange={(evt) => {
                        const value = evt?.target?.value || '';
                        setValue(value);
                        onChange(value);
                    }}
                />
                {displayLoader && (
                    <InputRightElement h="100%" children={<Spinner />} />
                )}
                {isAvailable && (
                    <InputRightElement
                        h="100%"
                        children={<CheckIcon color="green.500" />}
                    />
                )}
            </InputGroup>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
            {helperText && (
                <FormHelperText fontSize={14} color={helperTxtColor}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

const InitialFundsInput = ({
    onChange,
    min,
    max,
    onError,
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
        onBlur,
        onChange: onChangeValidate,
        ref,
    } = register('deposit', {
        shouldUnregister: true,
        valueAsNumber: true,
        validate,
        required: {
            value: true,
            message: useMessages('required.field'),
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
        console.log('changed!');
        console.log(depositErrors);
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
                    name={name}
                    onBlur={onBlur}
                    onChange={(evt) => {
                        onChangeValidate(evt);
                        onChange(evt?.target?.value);
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

const HireNode = ({
    stepNumber,
    onComplete,
    onPrevious,
    onStepActive,
    inFocus,
}: IStep) => {
    const { tipsBgColor } = useStyle();
    const { account } = useWallet();
    const [nodeAddress, setNodeAddress] = useState<string>('');
    const node = useNode(nodeAddress);

    const [stepState, setStepState] = useState({
        status: inFocus ? ACTIVE : NOT_ACTIVE,
    });

    useEffect(() => {
        if (!inFocus && stepState.status === COMPLETED) return;

        const status = inFocus ? ACTIVE : NOT_ACTIVE;
        setStepState((stepState) => ({ ...stepState, status }));
    }, [inFocus]);

    return (
        <Step
            title="Hire Node"
            subtitle="At this point, stake your funds using Cartesi Explorer."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                <NodeInput
                    onChange={setNodeAddress}
                    helperText="You may find from the docker configuration"
                    account={account}
                    node={node}
                />
                <InitialFundsInput
                    onChange={(value) => {
                        console.log(`initial funds value: ${value}`);
                    }}
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
                        onClick={(e) => {
                            setStepState((state) => ({
                                ...state,
                                status: NOT_ACTIVE,
                            }));
                            onPrevious(e);
                        }}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        colorScheme="blue"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(e) => {
                            setStepState((state) => ({
                                ...state,
                                status: COMPLETED,
                            }));
                            onComplete(e);
                        }}
                    >
                        NEXT
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default HireNode;
