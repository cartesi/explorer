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
    Stack,
    useColorModeValue,
    Checkbox,
} from '@chakra-ui/react';
import { isEmpty, omit } from 'lodash/fp';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { useWallet } from '@explorer/wallet';

import { useNode, NodeStatus } from '../../../services/node';
import { toBigNumber } from '../../../utils/numberParser';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { ValidationResult, MappedErrors } from '../../BaseInput';
import TransactionBanner from '../../TransactionBanner';
import {
    NodeInput,
    NodeField,
    evaluateNode,
} from '../../node/inputs/NodeInput';
import {
    DepositField,
    InitialFundsInput,
} from '../../node/inputs/InitialFundsInput';
import { poolAddressAtom } from './CommissionModel';
import { useStakingPool } from '../../../services/pool';
import { TransactionType } from '../../../types/pool';
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

const HireNode = ({ stepNumber, onComplete, onStepActive, inFocus }: IStep) => {
    const tipsBgColor = useColorModeValue('white', 'dark.gray.tertiary');
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
                <Checkbox
                    defaultChecked
                    mt={5}
                    isChecked={!pool.paused}
                    colorScheme={checkboxColorScheme}
                    onChange={() => {
                        const tType = pool.paused ? 'unpause' : 'pause';
                        setTransactionType(tType);
                        pool[tType]();
                    }}
                >
                    Allowing your pool to accept new stakes
                </Checkbox>
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
                    justifyContent={{ base: 'flex-end', md: 'flex-start' }}
                >
                    <Button
                        disabled={!enableNext || pool.transaction?.isOngoing}
                        isLoading={pool.transaction?.isOngoing}
                        colorScheme="blue"
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
