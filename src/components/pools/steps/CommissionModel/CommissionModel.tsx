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
import TransactionBanner from '../../../node/TransactionBanner';
import FlatRateCommission, { FlatRateModel } from './FlatRateCommission';
import GasBasedCommission, { GasBasedModel } from './GasBasedCommission';
import { omit } from 'lodash/fp';
import { Transaction } from '../../../../services/transaction';
import { useMessages } from '../../../../utils/messages';

type CommissionModels = FlatRateModel | GasBasedModel;
type Validation = ValidationResult<FlatRateModel | GasBasedModel>;
type Errors = OptionalMappedErrors<Validation>;
const { COMPLETED } = StepStatus;

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

const CommissionModel = ({
    stepNumber,
    inFocus,
    onComplete,
    onPrevious,
    onStepActive,
}: IStep) => {
    const {
        createFlatRateCommission,
        createGasTaxCommission,
        loading,
        paused,
        ready,
        transaction,
    } = useStakingPoolFactory();
    const [stepState, setStepState] = useStepState({ inFocus });
    const [modelType, setModelType] =
        useState<CommissionModels>('flatRateCommission');
    const [flatRateVal, setFlatRateVal] = useState<string | null>();
    const [gasBasedVal, setGasBasedVal] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const radioHandler = (v: CommissionModels) => setModelType(v);
    const notInitialised = !loading && !ready;
    const poolCreationIsPaused = !loading && paused;

    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };

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
                <Heading as="h3" size="sm" my={4}>
                    Choose commission model
                </Heading>

                <Stack direction="row" spacing={{ base: 3, md: 7 }} mt={2}>
                    <RadioGroup
                        onChange={radioHandler}
                        value={modelType}
                        pt={1}
                    >
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

                <Stack direction="row" spacing={{ base: 3, md: 7 }} mt={8}>
                    <RadioGroup
                        onChange={radioHandler}
                        value={modelType}
                        pt={1}
                    >
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
                        colorScheme="blue"
                        minWidth={{ base: '50%', md: '10rem' }}
                        onClick={(evt) => {
                            onComplete();
                            setStepState(COMPLETED);
                        }}
                    >
                        CREATE POOL
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default CommissionModel;
