// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Heading, RadioGroup, Radio, Stack, Button } from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepStatus } from '../../../Step';
import { IStep, useStepState } from '../../../StepGroup';
import { useState, useEffect } from 'react';
import { OptionalMappedErrors, ValidationResult } from '../../../BaseInput';
import { useStakingPoolFactory } from '../../../../services/poolFactory';
import TransactionBanner from '../../../TransactionBanner';
import FlatRateCommission, { FlatRateModel } from './FlatRateCommission';
import GasBasedCommission, { GasBasedModel } from './GasBasedCommission';
import { isEmpty, isFunction, omit, toNumber } from 'lodash/fp';
import { Transaction } from '../../../../services/transaction';
import { useMessages } from '../../../../utils/messages';
import { useWallet } from '../../../../contexts/wallet';
import { atom, useAtom } from 'jotai';
import { WalletDisconnectedNotification } from '../WalletDisconnectedNotification';

type CommissionModels = FlatRateModel | GasBasedModel;
type Validation = ValidationResult<FlatRateModel | GasBasedModel>;
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
    const [modelType, setModelType] =
        useState<CommissionModels>('flatRateCommission');
    const [flatRateVal, setFlatRateVal] = useState<string | null>();
    const [gasBasedVal, setGasBasedVal] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const radioHandler = (v: CommissionModels) => setModelType(v);
    const notInitialised = !poolFactory.loading && !poolFactory.ready;
    const poolCreationIsPaused = !poolFactory.loading && poolFactory.paused;
    const disablePoolCreationButton = createPoolDisabled({
        creationIsPaused: poolCreationIsPaused,
        factoryIsNotReady: notInitialised,
        commissionModel: modelType,
        commissionValue:
            modelType === 'flatRateCommission' ? flatRateVal : gasBasedVal,
        account,
        errors,
    });
    const isStepCompleted = isPoolCreationCompleted(poolFactory.transaction);

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
        setGasBasedVal(null);
        setModelType('flatRateCommission');
    }, [inFocus]);

    return (
        <Step
            title="Commission Model"
            subtitle="Choose the commission model and fee for your pool"
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                <Stack direction="column" spacing={2}>
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
                <Heading as="h3" size="sm" my={4}>
                    Choose commission model
                </Heading>

                <Stack
                    direction="row"
                    spacing={{ base: 3, md: 7 }}
                    mt={2}
                    onClick={(e) => radioHandler('flatRateCommission')}
                >
                    <RadioGroup value={modelType} pt={1} name="flatRateOption">
                        <Radio
                            value="flatRateCommission"
                            isChecked={modelType === 'flatRateCommission'}
                        />
                    </RadioGroup>
                    <FlatRateCommission
                        onChange={setFlatRateVal}
                        isDisabled={modelType !== 'flatRateCommission'}
                        onValidationChange={handleValidation}
                    />
                </Stack>

                <Stack
                    direction="row"
                    spacing={{ base: 3, md: 7 }}
                    mt={8}
                    onClick={(e) => radioHandler('gasBasedCommission')}
                >
                    <RadioGroup value={modelType} pt={1} name="gasBasedOption">
                        <Radio
                            value="gasBasedCommission"
                            isChecked={modelType === 'gasBasedCommission'}
                        />
                    </RadioGroup>
                    <GasBasedCommission
                        onChange={setGasBasedVal}
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
                        disabled={
                            disablePoolCreationButton ||
                            poolFactory?.transaction?.isOngoing
                        }
                        isLoading={poolFactory?.transaction?.isOngoing}
                        colorScheme="blue"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={() => {
                            if (modelType === 'flatRateCommission') {
                                poolFactory.createFlatRateCommission(
                                    toNumber(flatRateVal) * 100
                                );
                            } else {
                                poolFactory.createGasTaxCommission(
                                    toNumber(gasBasedVal)
                                );
                            }
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
