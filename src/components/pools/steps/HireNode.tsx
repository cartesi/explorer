// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Button, Checkbox, Stack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { isEmpty, isFunction, omit } from 'lodash/fp';
import { useEffect, useState } from 'react';
import { useColorModeValue } from '../../ui/color-mode';

import { useWallet } from '../../wallet';

import { NodeStatus, useNode } from '../../../services/node';
import { useStakingPool } from '../../../services/pool';
import { TransactionType } from '../../../types/pool';
import { toBigNumber } from '../../../utils/numberParser';
import { MappedErrors, ValidationResult } from '../../BaseInput';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import TransactionBanner from '../../TransactionBanner';
import {
    DepositField,
    InitialFundsInput,
} from '../../node/inputs/InitialFundsInput';
import {
    NodeField,
    NodeInput,
    evaluateNode,
} from '../../node/inputs/NodeInput';
import { poolAddressAtom } from './CommissionModel';
import { WalletDisconnectedNotification } from './WalletDisconnectedNotification';

type Validation = ValidationResult<NodeField | DepositField>;
type Errors = Partial<MappedErrors<Validation>>;

const { COMPLETED } = StepStatus;

const enableNextWhen = (
    funds: string,
    nodeStatus: NodeStatus,
    errors: Errors
): boolean => {
    return nodeStatus === 'available' && isEmpty(errors) && !isEmpty(funds);
};

const wordingFor = {
    pause: {
        title: 'Pausing new stakes',
        failTitle: 'Pausing new stakes setup failed!',
        successDescription: 'The pool will no longer accept new stakes.',
    },
    unpause: {
        title: 'Accepting new stakes',
        failTitle: 'Accepting new stakes setup failed!',
        successDescription: 'The pool is now accepting new stakes.',
    },
    hire: {
        title: 'Hiring node...',
        failTitle: 'Hiring the node failed',
        successDescription: 'Node hired! moving to the next step...',
    },
};

const HireNode = ({
    stepNumber,
    currentStep,
    onComplete,
    onStepActive,
    inFocus,
}: IStep) => {
    const tipsBgColor = useColorModeValue('teal.light', 'dark.gray.tertiary');
    const colorScheme = useColorModeValue('teal', 'cyan');
    const [poolAddress] = useAtom(poolAddressAtom);
    const { account, active } = useWallet();
    const [stepState, setStepState] = useStepState({ inFocus });
    const [nodeAddress, setNodeAddress] = useState<string | null>();
    const [initialFunds, setInitialFunds] = useState<string | null>();
    const [transactionType, setTransactionType] =
        useState<TransactionType | null>();
    const [errors, setErrors] = useState<Errors>({});
    const pool = useStakingPool(poolAddress, account);
    const node = useNode(nodeAddress);
    const { status } = evaluateNode(poolAddress, node);
    const enableNext = enableNextWhen(initialFunds, status, errors) && active;
    const isStepCompleted =
        transactionType === 'hire' && pool?.transaction?.state === 'confirmed';
    const checkboxColorScheme = useColorModeValue('teal', 'gray');
    const bg = useColorModeValue('white', 'dark.background.secondary');
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

    useEffect(() => {
        if (isStepCompleted) {
            setStepState(COMPLETED);
            isFunction(onComplete) && onComplete();
        }
    }, [isStepCompleted]);

    return (
        <Step
            title="Hire Node"
            subtitle="At this point, stake your funds using Cartesi Explorer."
            stepNumber={stepNumber}
            bg={isHighlighted ? bg : undefined}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                {!active && <WalletDisconnectedNotification />}
                <TransactionBanner
                    title={wordingFor[transactionType]?.title}
                    failTitle={wordingFor[transactionType]?.failTitle}
                    successDescription={
                        wordingFor[transactionType]?.successDescription
                    }
                    transaction={pool.transaction}
                />
                <NodeInput
                    onValidationChange={handleValidation}
                    onChange={setNodeAddress}
                    helperText="You may find from the docker configuration"
                    account={poolAddress}
                    node={node}
                />
                <InitialFundsInput
                    onValidationChange={handleValidation}
                    onChange={setInitialFunds}
                    max={3}
                    min={0.001}
                />
                <Checkbox.Root
                    defaultChecked
                    mt={5}
                    checked={!pool.paused}
                    colorPalette={checkboxColorScheme}
                    onChange={() => {
                        const tType = pool.paused ? 'unpause' : 'pause';
                        setTransactionType(tType);
                        pool[tType]();
                    }}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
                </Checkbox.Root>
                <Box px={6} py={4} bg={tipsBgColor} mt={6} rounded="md">
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
                    justifyContent={{ base: 'flex-end', md: 'flex-start' }}
                >
                    <Button
                        disabled={!enableNext || pool.transaction?.isOngoing}
                        loading={pool.transaction?.isOngoing}
                        colorPalette={colorScheme}
                        minWidth={{ base: '10rem' }}
                        onClick={() => {
                            setTransactionType('hire');
                            pool.hire(nodeAddress, toBigNumber(initialFunds));
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
