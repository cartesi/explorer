// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { PropsWithChildren } from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    CloseButton,
    HStack,
    Spinner,
} from '@chakra-ui/react';
import { Address } from '@explorer/ui';
import { Transaction } from '../services/transaction';

export interface TransactionFeedbackProps<R> {
    transaction: Transaction<R>;
}

const TransactionFeedback = <R extends unknown>(
    props: PropsWithChildren<TransactionFeedbackProps<R>>
) => {
    const { transaction, children } = props;

    // TODO: take into account a higher number of confirmations
    // and calculate a percentage
    const progress = transaction?.receipt?.confirmations || 0;

    const status = transaction?.error
        ? 'error'
        : progress >= 1
        ? 'success'
        : 'info';

    const hash = transaction?.transaction?.hash;
    const chainId = transaction?.transaction?.chainId;
    return !transaction?.acknowledged ? (
        <Alert status={status} variant="left-accent">
            {status === 'info' && <Spinner mx={2} />}
            {status !== 'info' && <AlertIcon />}
            <Box flex="1">
                <HStack>
                    <AlertTitle>{children}</AlertTitle>
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
                    {transaction?.error}
                </AlertDescription>
            </Box>
            <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => transaction?.ack()}
            />
        </Alert>
    ) : (
        <></>
    );
};

export default TransactionFeedback;
