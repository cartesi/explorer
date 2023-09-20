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
import { Address } from '@explorer/ui';
import { isFunction } from 'lodash/fp';
import React, { FC, useEffect, useState } from 'react';
import { Transaction } from '../../services/transaction';

export interface AlertMessage {
    title?: string;
    failTitle?: string;
    successDescription?: React.ReactNode;
}

export interface ITransactionInfoBannerProps extends AlertProps, AlertMessage {
    transaction: Transaction<any>;
    onBeginTransaction?: () => void;
    onEndTransaction?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    onClose?: () => void;
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
    onClose,
    ...props
}) => {
    const [innerTransaction, setInnerTransaction] = useState(transaction);

    useEffect(() => {
        if (transaction) setInnerTransaction(transaction);
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
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const variant = useColorModeValue('left-accent', undefined);
    const alertIconColor = useColorModeValue(
        `light.support.${status}`,
        `dark.support.${status}`
    );
    const borderColor = useColorModeValue('gray.100', 'dark.border.quaternary');

    return !innerTransaction?.acknowledged ? (
        <Alert
            variant={variant}
            alignItems="flex-start"
            bg={bg}
            status={status}
            borderRadius="1rem"
            borderWidth="1px"
            borderColor={borderColor}
            {...props}
        >
            {status === 'info' && <Spinner mx={2} />}
            {status !== 'info' && <AlertIcon color={alertIconColor} />}
            <Box flex="1">
                <HStack>
                    <AlertTitle alignSelf="flex-start">
                        {isError && failTitle ? failTitle : title}
                    </AlertTitle>
                    {hash && (
                        <Address
                            address={hash}
                            type="tx"
                            truncated
                            chainId={chainId}
                            alignItems="flex-start"
                        />
                    )}
                </HStack>

                <AlertDescription display="block" fontSize={'1rem'}>
                    {isError && error ? error : ''}
                    {isSuccess && !isError ? successDescription : ''}
                </AlertDescription>
            </Box>
            {transactionEnded && (
                <CloseButton
                    position="absolute"
                    right="8px"
                    top="8px"
                    role="close-button"
                    onClick={() => {
                        if (innerTransaction) {
                            innerTransaction.ack();
                        }
                        if (isFunction(onClose)) {
                            onClose();
                        }
                    }}
                />
            )}
        </Alert>
    ) : (
        <></>
    );
};
