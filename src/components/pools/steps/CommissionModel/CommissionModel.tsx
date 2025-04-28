// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Button, Stack } from '@chakra-ui/react';
import { atom, useAtom } from 'jotai';
import { isEmpty, isFunction, omit, toNumber } from 'lodash/fp';
import { useEffect, useState } from 'react';
import { useStakingPoolFactory } from '../../../../services/poolFactory';
import { Transaction } from '../../../../services/transaction';
import { useMessages } from '../../../../utils/messages';
import { OptionalMappedErrors, ValidationResult } from '../../../BaseInput';
import { Step, StepActions, StepBody, StepStatus } from '../../../Step';
import { IStep, useStepState } from '../../../StepGroup';
import TransactionBanner from '../../../TransactionBanner';
import { useWallet } from '../../../wallet';
import { WalletDisconnectedNotification } from '../WalletDisconnectedNotification';
import FlatRateCommission, { FlatRateModel } from './FlatRateCommission';
import { useColorModeValue } from '../../../ui/color-mode';

type Validation = ValidationResult<FlatRateModel>;
type Errors = OptionalMappedErrors<Validation>;
const { COMPLETED } = StepStatus;
const poolAddressAtom = atom<string>('');

const useOpaqueTransaction = (): Transaction<void> => {
    const [ack, setAck] = useState<boolean>(false);
    const t: Transaction<void> = {
        acknowledged: ack,
        ack: () => setAck(true),
        set: () => null,
        submitting: false,
    };

    return t;
};
const PoolFactoryNotInitialisedAlert = () => {
    const t = useOpaqueTransaction();
    t.error = useMessages('pool.factory.not.initialised');
    const title = useMessages('notice.problem');
    return <TransactionBanner failTitle={title} transaction={t} />;
};

const PoolCreationIsPausedAlert = () => {
    const t = useOpaqueTransaction();
    t.error = useMessages('pool.creation.paused');
    const title = useMessages('notice.problem');
    return <TransactionBanner failTitle={title} transaction={t} />;
};

type CreatePoolDisabledProps = {
    creationIsPaused: boolean;
    factoryIsNotReady: boolean;
    commissionModel: string;
    commissionValue: string;
    account: string;
    errors: Errors;
};
const createPoolDisabled = ({
    commissionModel,
    account,
    commissionValue,
    creationIsPaused,
    factoryIsNotReady,
    errors,
}: CreatePoolDisabledProps): boolean =>
    creationIsPaused ||
    factoryIsNotReady ||
    isEmpty(commissionModel) ||
    isEmpty(commissionValue) ||
    isEmpty(account) ||
    !isEmpty(errors);

const isPoolCreationCompleted = (transaction: Transaction<any>) =>
    transaction.state === 'confirmed' && !isEmpty(transaction?.result);

const CommissionModel = ({
    stepNumber,
    currentStep,
    inFocus,
    onComplete,
    onPrevious,
    onStepActive,
}: IStep) => {
    const [, updatePoolAddressAtom] = useAtom(poolAddressAtom);
    const wallet = useWallet();
    const { account, active } = wallet;
    const poolFactory = useStakingPoolFactory();
    const [stepState, setStepState] = useStepState({ inFocus });
    const [flatRateVal, setFlatRateVal] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const notInitialised = !poolFactory.loading && !poolFactory.ready;
    const poolCreationIsPaused = !poolFactory.loading && poolFactory.paused;
    const disablePoolCreationButton = createPoolDisabled({
        creationIsPaused: poolCreationIsPaused,
        factoryIsNotReady: notInitialised,
        commissionModel: 'flatRateCommission',
        commissionValue: flatRateVal,
        account,
        errors,
    });
    const isStepCompleted = isPoolCreationCompleted(poolFactory.transaction);
    const colorScheme = useColorModeValue('teal', 'cyan');
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
            updatePoolAddressAtom(poolFactory?.transaction?.result);
            setStepState(COMPLETED);
            isFunction(onComplete) && onComplete();
        }
    }, [isStepCompleted]);

    useEffect(() => {
        if (inFocus) return;

        setFlatRateVal(null);
    }, [inFocus]);

    return (
        <Step
            title="Commission"
            subtitle="Set the commission fee for your pool"
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
            bg={isHighlighted ? bg : undefined}
        >
            <StepBody>
                <Stack direction="column" gap={2}>
                    {notInitialised && <PoolFactoryNotInitialisedAlert />}
                    {poolCreationIsPaused && <PoolCreationIsPausedAlert />}
                </Stack>
                {!active && <WalletDisconnectedNotification />}
                <TransactionBanner
                    title="Creating the pool..."
                    failTitle="The pool creation failed!"
                    successDescription={`Pool ${poolFactory.transaction?.result} created! moving to the next step...`}
                    transaction={poolFactory.transaction}
                />

                <FlatRateCommission
                    onChange={setFlatRateVal}
                    onValidationChange={handleValidation}
                />
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'space-between', md: 'flex-start' }}
                >
                    <Button
                        colorPalette="gray"
                        variant="ghost"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(evt) => onPrevious && onPrevious(evt)}
                    >
                        PREVIOUS
                    </Button>
                    <Button
                        disabled={
                            disablePoolCreationButton ||
                            poolFactory?.transaction?.isOngoing
                        }
                        loading={poolFactory?.transaction?.isOngoing}
                        colorScheme={colorScheme}
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={() => {
                            poolFactory.createFlatRateCommission(
                                toNumber(flatRateVal) * 100
                            );
                        }}
                    >
                        CREATE POOL
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export { poolAddressAtom };

export default CommissionModel;
