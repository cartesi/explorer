// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent, useEffect, useState } from 'react';
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
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Radio,
    RadioGroup,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    Formik,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
} from 'formik';

import Layout from '../../components/Layout';
import { useStakingPoolFactory } from '../../services/poolFactory';
import ConfirmationIndicator from '../../components/ConfirmationIndicator';
import { useRouter } from 'next/router';
import PageHeader from '../../components/PageHeader';
import { LockIcon } from '@chakra-ui/icons';

type CommissionModel = 'flatRate' | 'gasTax';
interface FormValues {
    model: CommissionModel;
    flatRate: string;
    gasTax: string;
}

const CreatePool: FunctionComponent = () => {
    const { account } = useWeb3React<Web3Provider>();
    const {
        waiting,
        error,
        loading,
        createFlatRateCommission,
        createGasTaxCommission,
        paused,
        ready,
    } = useStakingPoolFactory();

    const initialValues: FormValues = {
        model: 'flatRate',
        flatRate: '',
        gasTax: '',
    };

    const validate = (values: FormValues) => {
        const errors: any = {};
        console.log(values);
        if (values.model === 'flatRate') {
            if (!values.flatRate) {
                errors.flatRate = 'This value is required';
            } else {
                const value = Number.parseFloat(values.flatRate);
                if (Number.isNaN(value)) {
                    errors.flatRate = 'Value is not a number';
                } else if (value > 100) {
                    errors.flatRate = 'Maximum value is 100';
                }
            }
        } else if (values.model === 'gasTax') {
            if (!values.gasTax) {
                errors.gasTax = 'This value is required';
            } else {
                const value = Number.parseFloat(values.gasTax);
                if (Number.isNaN(value)) {
                    errors.gasTax = 'Value is not a number';
                } else if (!Number.isInteger(value)) {
                    errors.gasTax = 'Value must be an integer';
                }
            }
        }
        return errors;
    };

    const onCreate = (
        values: FormValues,
        actions: FormikHelpers<FormValues>
    ) => {
        if (values.model == 'flatRate') {
            const flatRate = Number.parseFloat(values.flatRate);
            createFlatRateCommission(flatRate * 100);
            actions.setSubmitting(true);
        } else if (values.model == 'gasTax') {
            const gasTax = Number.parseInt(values.gasTax);
            createGasTaxCommission(gasTax);
            actions.setSubmitting(true);
        }
    };

    return (
        <Layout>
            <Head>
                <title>Cartesi - Create Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader title="Create Pool">
                <ConfirmationIndicator loading={waiting} error={error} />
            </PageHeader>

            <VStack px="6vw" py={10} spacing={10}>
                <VStack align="flex-start" w="100%">
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
                <Formik
                    initialValues={initialValues}
                    onSubmit={onCreate}
                    validate={validate}
                >
                    {(props) => (
                        <FormControl>
                            <RadioGroup
                                name="commissionModel"
                                defaultValue="flatRate"
                            >
                                <VStack spacing="24px" align="flex-start">
                                    <VStack align="flex-start">
                                        <Field
                                            type="radio"
                                            name="model"
                                            value="flatRate"
                                        >
                                            {({ field }) => (
                                                <Radio {...field}>
                                                    Flat Rate Commission
                                                </Radio>
                                            )}
                                        </Field>
                                        <FormHelperText>
                                            This model calculates the commission
                                            as a fixed percentage of the block
                                            CTSI reward before distributing the
                                            remaining amount to the pool users.
                                        </FormHelperText>
                                        <Field name="flatRate">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.flatRate &&
                                                        form.touched.flatRate
                                                    }
                                                >
                                                    <InputGroup>
                                                        <Input
                                                            {...field}
                                                            id="flatRate"
                                                            width="xs"
                                                            placeholder="Percentage"
                                                        />
                                                        <InputRightAddon children="%" />
                                                    </InputGroup>
                                                    <FormErrorMessage>
                                                        {props.errors.flatRate}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </VStack>

                                    <VStack align="flex-start">
                                        <Field
                                            type="radio"
                                            name="model"
                                            value="gasTax"
                                        >
                                            {({ field }) => (
                                                <Radio {...field}>
                                                    Gas Tax Commission
                                                </Radio>
                                            )}
                                        </Field>
                                        <FormHelperText>
                                            This model calculates the commission
                                            considering the current network gas
                                            price, Ethereum price and CTSI
                                            price. The configured amount of gas
                                            above is multiplied by the gas price
                                            provided by a{' '}
                                            <a href="https://data.chain.link/fast-gas-gwei">
                                                ChainLink oracle
                                            </a>
                                            , then converted from ETH to CTSI
                                            using an{' '}
                                            <a href="https://v2.info.uniswap.org/pair/0x58eeb5d44dc41965ab0a9e563536175c8dc5c3b3">
                                                Uniswap V2 price oracle
                                            </a>
                                            .
                                        </FormHelperText>
                                        <Field name="gasTax">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.gasTax &&
                                                        form.touched.gasTax
                                                    }
                                                >
                                                    <InputGroup>
                                                        <Input
                                                            {...field}
                                                            id="gasTax"
                                                            width="xs"
                                                        />
                                                        <InputRightAddon children="Gas" />
                                                    </InputGroup>
                                                    <FormErrorMessage>
                                                        {props.errors.gasTax}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </VStack>
                                    <Button
                                        type="submit"
                                        onClick={props.submitForm}
                                        disabled={
                                            waiting ||
                                            !account ||
                                            paused ||
                                            !ready
                                        }
                                    >
                                        <Text>Create Pool</Text>
                                        {paused && <LockIcon />}
                                    </Button>
                                </VStack>
                            </RadioGroup>
                        </FormControl>
                    )}
                </Formik>
            </VStack>
        </Layout>
    );
};

export default CreatePool;
