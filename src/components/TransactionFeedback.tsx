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
    AlertTitle,
    Box,
    CloseButton,
    HStack,
    Spinner,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { Transaction } from '../services/transaction';
import Address from './Address';
import { useColorModeValue } from './ui/color-mode';

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

    const addressColor = useColorModeValue('gray.900', 'white');
    const alertIconColor = useColorModeValue(
        `light.support.${status}`,
        `dark.support.${status}`
    );

    const hash = transaction?.transaction?.hash;
    const chainId = transaction?.transaction?.chainId;
    return !transaction?.acknowledged ? (
        <Alert.Root status={status} alignItems="center">
            {status === 'info' && <Spinner mx={2} />}
            {status !== 'info' && <Alert.Indicator />}
            <Alert.Content>
                <Box flex="1">
                    <HStack>
                        <Alert.Title alignSelf="flex-start">
                            {children}
                        </Alert.Title>
                        {hash && (
                            <Address
                                address={hash}
                                type="tx"
                                truncated
                                chainId={chainId}
                                color={addressColor}
                                iconColor={alertIconColor}
                            />
                        )}
                    </HStack>
                    <Alert.Description display="block">
                        {transaction?.error}
                    </Alert.Description>
                </Box>
            </Alert.Content>
            <CloseButton
                data-testid="transaction-feedback-close-button"
                onClick={() => transaction?.ack()}
            />
        </Alert.Root>
    ) : (
        <></>
    );
};

export default TransactionFeedback;
