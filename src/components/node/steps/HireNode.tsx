// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Button,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { isEmpty, omit } from 'lodash/fp';
import { useEffect, useState } from 'react';

import { useWallet } from '../../wallet';

import { NodeStatus, useNode } from '../../../services/node';
import { useMessages } from '../../../utils/messages';
import { toBigNumber } from '../../../utils/numberParser';
import { MappedErrors, ValidationResult } from '../../BaseInput';
import { ConnectWallet } from '../../header/ConnectWallet';
import { Notification } from '../../Notification';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import TransactionBanner from '../../TransactionBanner';
import { DepositField, InitialFundsInput } from '../inputs/InitialFundsInput';
import { NodeField, NodeInput, evaluateNode } from '../inputs/NodeInput';
import { hiredNodeAddressAtom } from './HireNode.atoms';

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

const HireNode = ({
    stepNumber,
    onComplete,
    onPrevious,
    onStepActive,
    inFocus,
}: IStep) => {
    const [, setNodeAddressAtom] = useAtom(hiredNodeAddressAtom);
    const tipsBgColor = useColorModeValue('teal.light', 'dark.gray.tertiary');
    const [stepState, setStepState] = useStepState({ inFocus });
    const wallet = useWallet();
    const { account, active } = wallet;
    const [nodeAddress, setNodeAddress] = useState<string | null>();
    const [initialFunds, setInitialFunds] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const node = useNode(nodeAddress);
    const { status } = evaluateNode(account, node);
    const enableNext =
        enableNextWhen(initialFunds, status, errors) && wallet.active;
    const isStepCompleted = node.transaction?.state === 'confirmed';

    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };
    const bg = useColorModeValue('white', 'dark.background.secondary');
    const borderColor = useColorModeValue(
        'light.grey.tertiary',
        'dark.border.quaternary'
    );
    const { colorMode } = useColorMode();

    useEffect(() => {
        if (inFocus) return;

        setNodeAddress(null);
        setInitialFunds(null);
    }, [inFocus]);

    useEffect(() => {
        if (isStepCompleted) {
            setNodeAddressAtom(nodeAddress);
            setStepState(COMPLETED);
            onComplete?.();
        }
    }, [isStepCompleted]);

    return (
        <Step
            title="Hire Node"
            subtitle="At this point, stake your funds using Cartesi Explorer."
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
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        title={useMessages('wallet.is.disconnected')}
                        status="warning"
                    >
                        <ConnectWallet wallet={wallet} />
                    </Notification>
                )}
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
                <Box px={6} py={4} bgColor={tipsBgColor} mt={6} rounded="md">
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
                        variant="outline"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={() => {
                            onPrevious?.();
                        }}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        disabled={!enableNext || node.transaction?.isOngoing}
                        isLoading={node.transaction?.isOngoing}
                        colorScheme={colorMode === 'dark' ? 'cyan' : 'teal'}
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
