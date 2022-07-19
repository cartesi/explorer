// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ContractReceipt, ContractTransaction } from 'ethers';
import { useEffect, useState } from 'react';
import { serializeError } from 'eth-rpc-errors';
import { SerializedEthereumRpcError } from 'eth-rpc-errors/dist/classes';
import { confirmations } from '../utils/networks';
import { useWallet } from '../contexts/wallet';
import {
    allPass,
    anyPass,
    complement,
    cond,
    isEmpty,
    isEqual,
    pipe,
    prop,
    propEq,
    T,
} from 'lodash/fp';

export class Transaction<R> {
    submitting: boolean;
    acknowledged: boolean;
    transaction?: ContractTransaction;
    error?: string;
    receipt?: ContractReceipt;
    set: (transaction: Promise<ContractTransaction>) => void;
    ack: () => void;
    result?: R;
    /**
     * Transaction is considered ongoing when is submitting, or
     * the transaction was submitted to the blockchain and it is waiting for the receipt (based on confirmations)
     * to be set.
     */
    isOngoing?: boolean;
    state?: TransactionState;
}

const isNotEmpty = complement(isEmpty);

const isOngoing = anyPass<TransactionState>([
    isEqual('submitting'),
    isEqual('waiting_confirmation'),
]);

type TransactionState =
    | 'submitting'
    | 'waiting_confirmation'
    | 'confirmed'
    | 'errored'
    | 'acknowledged'
    | 'unexpected';

const deriveStateFrom = cond<Transaction<any>, TransactionState>([
    [propEq('acknowledged', true), () => 'acknowledged'],
    [pipe([prop('error'), isNotEmpty]), () => 'errored'],
    [propEq('submitting', true), () => 'submitting'],
    [
        allPass([
            pipe(prop('transaction'), isNotEmpty),
            pipe(prop('receipt'), isEmpty),
        ]),
        () => 'waiting_confirmation',
    ],
    [
        allPass([
            pipe(prop('transaction'), isNotEmpty),
            pipe(prop('receipt'), isNotEmpty),
        ]),
        () => 'confirmed',
    ],
    [T, () => 'unexpected'],
]);

function extractError(error: SerializedEthereumRpcError): string {
    if (error.data) {
        const data: any = error.data as any;
        if (data?.originalError?.error) {
            return extractError(
                data.originalError.error as SerializedEthereumRpcError
            );
        }
    }
    return error.message;
}

export function useTransaction<R>(
    resultResolver?: (receipt: ContractReceipt) => R
): Transaction<R> {
    const { chainId } = useWallet();
    const [acknowledged, setAcknowledged] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>();
    const [transaction, setTransaction] = useState<ContractTransaction>();
    const [receipt, setReceipt] = useState<ContractReceipt>();
    const [result, setResult] = useState<R>();

    const set = (transaction: Promise<ContractTransaction>) => {
        setAcknowledged(false);
        setSubmitting(true);
        setReceipt(undefined);
        setResult(undefined);
        setError(undefined);
        transaction
            .then(setTransaction)
            .catch((e) => {
                const error = serializeError(e);
                setError(extractError(error));
            })
            .finally(() => setSubmitting(false));
    };
    const ack = () => setAcknowledged(true);

    useEffect(() => {
        const update = async () => {
            setError(null);
            try {
                // wait for confirmations
                const receipt = await transaction.wait(confirmations[chainId]);
                setReceipt(receipt);

                // resolve result from receipt (events?)
                if (resultResolver) {
                    setResult(resultResolver(receipt));
                }
            } catch (e) {
                setError(e.message);
            }
        };
        if (transaction) {
            update();
        }
    }, [transaction]);

    const t = {
        submitting,
        acknowledged,
        transaction,
        error,
        receipt,
        set,
        ack,
        result,
    };

    const state = deriveStateFrom(t);

    return {
        ...t,
        state,
        isOngoing: isOngoing(state),
    };
}
