// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    Radio,
    RadioGroup,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

import Layout from '../../components/Layout';
import { useStakingPoolFactory } from '../../services/poolFactory';
import PageHeader from '../../components/PageHeader';
import { LockIcon } from '@chakra-ui/icons';
import TransactionFeedback from '../../components/TransactionFeedback';
import { truncateString } from '../../utils/stringUtils';

type CommissionModel = 'flatRate' | 'gasTax';
type FormData = {
    model: CommissionModel;
    flatRate: number;
    gasTax: number;
};

const CreatePool: FunctionComponent = () => {
    const { account, chainId } = useWeb3React<Web3Provider>();
    const {
        loading,
        paused,
        ready,
        createFlatRateCommission,
        createGasTaxCommission,
        transaction,
    } = useStakingPoolFactory();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            model: 'flatRate',
            flatRate: undefined,
            gasTax: undefined,
        },
    });

    // watch the model value, for validation and disabling controls
    const model = watch('model');

    const numberValidation =
        (m: CommissionModel, maxValue?: number) => (value: number) => {
            if (m !== model) {
                return true;
            }

            if (Number.isNaN(value)) {
                return 'Value is not a number';
            }

            if (maxValue && value > maxValue) {
                return `Maximum value is ${maxValue}`;
            }

            return true;
        };

    const onSubmit = handleSubmit((data) => {
        if (data.model == 'flatRate') {
            createFlatRateCommission(data.flatRate * 100);
        } else if (data.model == 'gasTax') {
            createGasTaxCommission(data.gasTax);
        }
    });

    return (
        <Layout>
            <Head>
                <title>Cartesi - Create Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader title="Create Pool" />

            <VStack px="6vw" py={10} spacing={10}>
                <VStack align="flex-start" w="100%">
                    {transaction.transaction && (
                        <TransactionFeedback
                            chainId={chainId}
                            progress={transaction.receipt?.confirmations}
                            error={transaction.error}
                            hash={transaction.transaction?.hash}
                        >
                            {transaction.result ? (
                                <Link
                                    href={'/pools/' + transaction.result}
                                >{`Pool ${truncateString(
                                    transaction.result
                                )} created`}</Link>
                            ) : (
                                'Creating pool...'
                            )}
                        </TransactionFeedback>
                    )}
                    {!loading && !ready && (
                        <Alert status="error">
                            <AlertIcon />
                            Pool factory is not properly initialized.
                        </Alert>
                    )}
                    {!loading && paused && (
                        <Alert status="error">
                            <AlertIcon />
                            Creation of new pools is currently disabled.
                        </Alert>
                    )}
                </VStack>
                <form onSubmit={onSubmit}>
                    <Controller
                        name="model"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormControl>
                                <RadioGroup
                                    name="commissionModel"
                                    defaultValue="flatRate"
                                    value={value}
                                    onChange={onChange}
                                >
                                    <VStack spacing="24px" align="flex-start">
                                        <VStack align="flex-start">
                                            <Radio
                                                name="model"
                                                value="flatRate"
                                            >
                                                Flat Rate Commission
                                            </Radio>
                                            <FormHelperText>
                                                This model calculates the
                                                commission as a fixed percentage
                                                of the block CTSI reward before
                                                distributing the remaining
                                                amount to the pool users.
                                            </FormHelperText>
                                            <FormControl
                                                isInvalid={
                                                    errors.flatRate &&
                                                    touchedFields.flatRate
                                                }
                                            >
                                                <InputGroup>
                                                    <Input
                                                        {...register(
                                                            'flatRate',
                                                            {
                                                                valueAsNumber:
                                                                    true,
                                                                validate:
                                                                    numberValidation(
                                                                        'flatRate',
                                                                        100
                                                                    ),
                                                            }
                                                        )}
                                                        width="xs"
                                                        placeholder="Percentage"
                                                        disabled={
                                                            model != 'flatRate'
                                                        }
                                                    />
                                                    <InputRightAddon children="%" />
                                                </InputGroup>
                                                <FormErrorMessage>
                                                    {errors.flatRate?.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </VStack>

                                        <VStack align="flex-start">
                                            <Radio name="model" value="gasTax">
                                                Gas Tax Commission
                                            </Radio>
                                            <FormHelperText>
                                                This model calculates the
                                                commission considering the
                                                current network gas price,
                                                Ethereum price and CTSI price.
                                                The configured amount of gas
                                                above is multiplied by the gas
                                                price provided by a{' '}
                                                <a href="https://data.chain.link/fast-gas-gwei">
                                                    ChainLink oracle
                                                </a>
                                                , then converted from ETH to
                                                CTSI using an{' '}
                                                <a href="https://v2.info.uniswap.org/pair/0x58eeb5d44dc41965ab0a9e563536175c8dc5c3b3">
                                                    Uniswap V2 price oracle
                                                </a>
                                                .
                                            </FormHelperText>
                                            <FormControl
                                                isInvalid={
                                                    errors.gasTax &&
                                                    touchedFields.gasTax
                                                }
                                            >
                                                <InputGroup>
                                                    <Input
                                                        {...register('gasTax', {
                                                            valueAsNumber: true,
                                                            validate:
                                                                numberValidation(
                                                                    'gasTax'
                                                                ),
                                                        })}
                                                        width="xs"
                                                        disabled={
                                                            model != 'gasTax'
                                                        }
                                                    />
                                                    <InputRightAddon children="Gas" />
                                                </InputGroup>
                                                <FormErrorMessage>
                                                    {errors.gasTax?.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </VStack>
                                        <Button
                                            type="submit"
                                            disabled={
                                                !account || paused || !ready
                                            }
                                        >
                                            <Text>Create Pool</Text>
                                            {paused && <LockIcon />}
                                        </Button>
                                    </VStack>
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </form>
            </VStack>
        </Layout>
    );
};

export default CreatePool;
