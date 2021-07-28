// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
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
import Address from './Address';

export interface TransactionFeedbackProps {
    title: string;
    chainId: number;
    hash?: string;
    progress: number;
    error?: string;
}

const TransactionFeedback: FC<TransactionFeedbackProps> = ({
    title,
    chainId,
    hash,
    progress,
    error,
}) => {
    const status = error ? 'error' : progress >= 1 ? 'success' : 'info';
    return (
        <Alert status={status} variant="left-accent">
            {status === 'info' && <Spinner mx={2} />}
            {status !== 'info' && <AlertIcon />}
            <Box flex="1">
                <HStack>
                    <AlertTitle>{title}</AlertTitle>
                    {hash && (
                        <Address
                            address={hash}
                            type="tx"
                            size="xs"
                            truncated
                            chainId={chainId}
                        />
                    )}
                </HStack>
                <AlertDescription display="block">{error}</AlertDescription>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
    );
};

export default TransactionFeedback;
