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

import { useWallet } from '../../../contexts/wallet';

import { useNode, NodeStatus } from '../../../services/node';
import { Transaction } from '../../../services/transaction';
import { toBigNumber } from '../../../utils/numberParser';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { ValidationResult, MappedErrors } from '../../BaseInput';
import TransactionBanner from '../../node/TransactionBanner';
import { hiredNodeAddressAtom } from '../../node/steps/HireNode.atoms';
import {
    NodeInput,
    NodeField,
    evaluateNode,
} from '../../node/inputs/NodeInput';
import {
    DepositField,
    InitialFundsInput,
} from '../../node/inputs/InitialFundsInput';

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

const isNodeHiringCompleted = (transaction: Transaction<any>) =>
    transaction.receipt?.confirmations >= 1;

const HireNode = ({ stepNumber, onComplete, onStepActive, inFocus }: IStep) => {
    const [, setNodeAddressAtom] = useAtom(hiredNodeAddressAtom);
    const tipsBgColor = useColorModeValue('gray.80', 'gray.800');
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

    // useEffect(() => {
    //     if (isStepCompleted) {
    //         setNodeAddressAtom(nodeAddress);
    //         setStepState(COMPLETED);
    //         onComplete && onComplete();
    //     }
    // }, [isStepCompleted]);

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
                <Checkbox defaultChecked mt={5}>
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
                        // disabled={!enableNext || node.transaction?.submitting}
                        // isLoading={node.transaction?.submitting}
                        colorScheme="blue"
                        minWidth={{ base: '10rem' }}
                        // onClick={() => node.hire(toBigNumber(initialFunds))}
                        onClick={() => {
                            onComplete();
                            setStepState(COMPLETED);
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
