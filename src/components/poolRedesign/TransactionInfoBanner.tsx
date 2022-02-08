// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertProps,
    AlertTitle,
    Box,
    CloseButton,
    HStack,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import Address from '../Address';
import { Transaction } from '../../services/transaction';

interface ITransactionInfoBannerProps extends AlertProps {
    title?: string;
    failTitle?: string;
    successDescription?: string;
    transaction: Transaction<any>;
    onBeginTransaction?: () => void;
    onEndTransaction?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
}

export const TransactionInfoBanner: FC<ITransactionInfoBannerProps> = ({
    title,
    failTitle,
    successDescription,
    transaction,
    onSuccess,
    onError,
    onBeginTransaction,
    onEndTransaction,
    ...props
}) => {
    const [innerTransaction, setInnerTransacation] = useState(transaction);

    useEffect(() => {
        if (transaction) setInnerTransacation(transaction);
    }, [transaction]);

    // TODO: take into account a higher number of confirmations
    // and calculate a percentage
    const progress = innerTransaction?.receipt?.confirmations || 0;

    const status = innerTransaction?.error
        ? 'error'
        : progress >= 1
        ? 'success'
        : 'info';

    const isSuccess = status === 'success';
    const isError = status === 'error';

    const [transactionStarted, setTransactionStarted] = useState(false);
    const [transactionEnded, setTransactionEnded] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!transactionStarted) {
            setTransactionStarted(true);
            setError('');
            if (onBeginTransaction) onBeginTransaction();
        }

        if (isSuccess) {
            setError('');
            if (onSuccess) onSuccess();
        }

        if (isError) {
            const errMessage = innerTransaction?.error;
            if (!error) {
                setError(errMessage); // only the first time
                if (onError) onError();
            }
        }

        if (!transactionEnded) {
            setTransactionEnded(true);
            if (onEndTransaction) onEndTransaction();
        }
    }, [isSuccess, isError]);

    const hash = innerTransaction?.transaction?.hash;
    const chainId = innerTransaction?.transaction?.chainId;
    const bg = useColorModeValue('white', 'gray.700');

    return !innerTransaction?.acknowledged ? (
        <Alert
            variant="left-accent"
            alignItems="flex-start"
            borderRadius="lg"
            boxShadow="sm"
            bg={bg}
            status={status}
            {...props}
        >
            {status === 'info' && <Spinner mx={2} />}
            {status !== 'info' && <AlertIcon />}
            <Box flex="1">
                <HStack>
                    <AlertTitle>
                        {isError && failTitle ? failTitle : title}
                    </AlertTitle>
                    {hash && (
                        <Address
                            address={hash}
                            type="tx"
                            truncated
                            chainId={chainId}
                        />
                    )}
                </HStack>

                <AlertDescription display="block">
                    {isError && error ? error : ''}
                    {isSuccess && !isError ? successDescription : ''}
                </AlertDescription>
            </Box>
            {transactionEnded && (
                <CloseButton
                    position="absolute"
                    right="8px"
                    top="8px"
                    onClick={() => innerTransaction?.ack()}
                />
            )}
        </Alert>
    ) : (
        <></>
    );
};
